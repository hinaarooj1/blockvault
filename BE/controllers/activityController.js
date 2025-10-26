const getActivityModel = require('../crmDB/models/activityModel');
const getLeadModel = require('../crmDB/models/leadsModel');
const User = require('../models/userModel'); // Main database User model
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Helper function to log activity
async function logActivity({ leadId, type, createdBy, comment = '', changes = null, metadata = {}, isSystemGenerated = false }) {
    try {
        const Activity = await getActivityModel();
        const activity = await Activity.create({
            leadId,
            type,
            createdBy: {
                userId: createdBy._id,
                userName: `${createdBy.firstName} ${createdBy.lastName}`,
                userRole: createdBy.role
            },
            comment,
            changes,
            metadata,
            isSystemGenerated
        });
        return activity;
    } catch (error) {
        console.error('Error logging activity:', error);
        return null;
    }
}

// Get activities for a lead
exports.getLeadActivities = catchAsyncErrors(async (req, res) => {
    const { leadId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const currentUser = req.user;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // ✅ SECURITY: Check if user can view this lead's activities
    const Lead = await getLeadModel();
    const lead = await Lead.findById(leadId).select('agent').lean();
    
    if (!lead) {
        return res.status(404).json({
            success: false,
            message: 'Lead not found'
        });
    }

    const userRole = currentUser.role;
    const userId = currentUser._id.toString();
    const leadAgentId = lead.agent ? lead.agent.toString() : null;

    if (userRole === 'subadmin') {
        if (!leadAgentId || leadAgentId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You can only view activities for your own assigned leads'
            });
        }
    } else if (userRole === 'admin') {
        if (currentUser.adminPermissions?.canManageCrmLeads) {
            if (leadAgentId && leadAgentId !== userId) {
                const assignedAgent = await User.findById(leadAgentId).select('role').lean();
                if (!assignedAgent || (assignedAgent.role !== 'subadmin' && assignedAgent._id.toString() !== userId)) {
                    return res.status(403).json({
                        success: false,
                        message: 'Access denied: You can only view activities for your own leads and subadmin leads'
                    });
                }
            }
        } else {
            if (!leadAgentId || leadAgentId !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied: You can only view activities for your own assigned leads'
                });
            }
        }
    }

    const Activity = await getActivityModel();
    const [activities, total] = await Promise.all([
        Activity.find({ leadId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        Activity.countDocuments({ leadId })
    ]);

    // Format activities for display
    const formattedActivities = activities.map(activity => {
        let description = '';
        
        if (activity.type === 'field_update' && activity.changes) {
            description = activity.changes.description || 'Field updated';
        } else if (activity.type === 'assignment_change' && activity.changes) {
            description = `Agent changed from '${activity.changes.oldValue || 'Unassigned'}' to '${activity.changes.newValue || 'Unassigned'}'`;
        } else if (activity.type === 'status_change' && activity.changes) {
            description = `Status changed from '${activity.changes.oldValue || 'N/A'}' to '${activity.changes.newValue}'`;
        } else if (activity.type === 'comment') {
            description = activity.comment;
        } else if (activity.type === 'created') {
            description = activity.changes?.description || 'Lead created';
        } else if (activity.changes && activity.changes.description) {
            description = activity.changes.description;
        }

        return {
            ...activity,
            description
        };
    });

    res.json({
        success: true,
        activities: formattedActivities,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    });
});

// Add comment to lead
exports.addLeadComment = catchAsyncErrors(async (req, res) => {
    const { leadId } = req.params;
    const { comment } = req.body;
    const user = req.user;

    if (!comment || comment.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Comment cannot be empty'
        });
    }

    const Lead = await getLeadModel();
    const lead = await Lead.findById(leadId).lean();

    if (!lead) {
        return res.status(404).json({
            success: false,
            message: 'Lead not found'
        });
    }

    // ✅ SECURITY: Check if user can comment on this lead
    const userRole = user.role;
    const userId = user._id.toString();
    const leadAgentId = lead.agent ? lead.agent.toString() : null;

    if (userRole === 'subadmin') {
        // Subadmin can ONLY comment on their own assigned leads
        if (!leadAgentId || leadAgentId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You can only comment on your own assigned leads'
            });
        }
    } else if (userRole === 'admin') {
        // Admin with canManageCrmLeads can comment on own + subadmins' leads
        if (user.adminPermissions?.canManageCrmLeads) {
            if (leadAgentId && leadAgentId !== userId) {
                // Check if lead is assigned to a subadmin
                const assignedAgent = await User.findById(leadAgentId).select('role').lean();
                if (!assignedAgent || (assignedAgent.role !== 'subadmin' && assignedAgent._id.toString() !== userId)) {
                    return res.status(403).json({
                        success: false,
                        message: 'Access denied: You can only comment on your own leads and subadmin leads'
                    });
                }
            }
        } else {
            // Admin without permission can ONLY comment on own leads
            if (!leadAgentId || leadAgentId !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied: You can only comment on your own assigned leads'
                });
            }
        }
    }
    // Superadmin can comment on all leads (no restriction)

    const activity = await logActivity({
        leadId,
        type: 'comment',
        createdBy: user,
        comment: comment.trim()
    });

    res.json({
        success: true,
        message: 'Comment added successfully',
        activity: {
            ...activity.toObject(),
            description: comment.trim()
        }
    });
});

// Get lead details with latest activity
exports.getLeadWithActivity = catchAsyncErrors(async (req, res) => {
    const { leadId } = req.params;
    const currentUser = req.user;

    const Lead = await getLeadModel();
    const Activity = await getActivityModel();
    
    // Get lead and activities (exclude deleted & nested replies, sort pinned first)
    const [lead, recentActivities, totalActivities] = await Promise.all([
        Lead.findById(leadId).lean(),
        Activity.find({ 
            leadId,
            isDeleted: { $ne: true },        // ✅ Exclude deleted comments
            $or: [
                { parentCommentId: { $exists: false } },  // Field doesn't exist
                { parentCommentId: null }                  // Field is null
            ]
        })
            .sort({ 
                isPinned: -1,      // ✅ Pinned comments first
                createdAt: -1      // Then by date
            })
            .limit(100) // Increased limit
            .lean(),
        Activity.countDocuments({ 
            leadId, 
            isDeleted: { $ne: true },
            $or: [
                { parentCommentId: { $exists: false } },
                { parentCommentId: null }
            ]
        })
    ]);
    
    console.log('📊 Backend - Activities found:', recentActivities.length);
    console.log('📊 Backend - Activity types:', {
        comments: recentActivities.filter(a => a.type === 'comment').length,
        withParent: recentActivities.filter(a => a.parentCommentId).length,
        withoutParent: recentActivities.filter(a => !a.parentCommentId).length
    });

    if (!lead) {
        return res.status(404).json({
            success: false,
            message: 'Lead not found'
        });
    }

    // ✅ SECURITY: Record-level authorization
    const userRole = currentUser.role;
    const userId = currentUser._id.toString();
    const leadAgentId = lead.agent ? lead.agent.toString() : null;

    if (userRole === 'subadmin') {
        // Subadmin can ONLY view their own assigned leads
        if (!leadAgentId || leadAgentId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You can only view your own assigned leads'
            });
        }
    } else if (userRole === 'admin') {
        // Admin with canManageCrmLeads can view own + subadmins' leads
        if (currentUser.adminPermissions?.canManageCrmLeads) {
            // Can view own leads + subadmin leads
            if (leadAgentId && leadAgentId !== userId) {
                // Check if lead is assigned to a subadmin
                const assignedAgent = await User.findById(leadAgentId).select('role').lean();
                if (!assignedAgent || (assignedAgent.role !== 'subadmin' && assignedAgent._id.toString() !== userId)) {
                    return res.status(403).json({
                        success: false,
                        message: 'Access denied: You can only view your own leads and subadmin leads'
                    });
                }
            }
        } else {
            // Admin without permission can ONLY view own leads
            if (!leadAgentId || leadAgentId !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied: You can only view your own assigned leads'
                });
            }
        }
    }
    // Superadmin can view all leads (no restriction)

    // Manually populate agent from main database if exists
    if (lead.agent) {
        try {
            const agent = await User.findById(lead.agent).select('firstName lastName email role').lean();
            if (agent) {
                lead.agent = agent;
            }
        } catch (error) {
            console.error('Error fetching agent:', error);
            // Continue without agent data
        }
    }

    // Format activities
    const formattedActivities = recentActivities.map(activity => {
        let description = '';
        
        if (activity.type === 'field_update' && activity.changes) {
            description = activity.changes.description || 'Field updated';
        } else if (activity.type === 'assignment_change' && activity.changes) {
            description = `Agent changed from '${activity.changes.oldValue || 'Unassigned'}' to '${activity.changes.newValue || 'Unassigned'}'`;
        } else if (activity.type === 'status_change' && activity.changes) {
            description = `Status changed from '${activity.changes.oldValue || 'N/A'}' to '${activity.changes.newValue}'`;
        } else if (activity.type === 'comment') {
            description = activity.comment;
        } else if (activity.type === 'created') {
            description = activity.changes?.description || 'Lead created';
        } else if (activity.changes && activity.changes.description) {
            description = activity.changes.description;
        }

        return {
            ...activity,
            description
        };
    });

    res.json({
        success: true,
        lead,
        activities: formattedActivities,
        totalActivities
    });
});

// ===========================
// ✅ NEW: ENHANCED COMMENT FEATURES
// ===========================

// Edit Comment
exports.editComment = catchAsyncErrors(async (req, res) => {
    const { leadId, commentId } = req.params;
    const { content, editReason } = req.body;
    const currentUser = req.user;

    if (!content || !content.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Comment content is required'
        });
    }

    const Activity = await getActivityModel();
    const comment = await Activity.findOne({ _id: commentId, leadId });

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: 'Comment not found'
        });
    }

    // ✅ SECURITY: Only author can edit
    if (!comment.canUserEdit(currentUser._id)) {
        return res.status(403).json({
            success: false,
            message: 'Access denied: You can only edit your own comments'
        });
    }

    // Save to edit history
    comment.editHistory.push({
        editedBy: {
            userId: currentUser._id,
            userName: `${currentUser.firstName} ${currentUser.lastName}`,
            userRole: currentUser.role
        },
        previousContent: comment.comment,
        editedAt: new Date(),
        editReason: editReason || 'No reason provided'
    });

    comment.comment = content.trim();
    comment.isEdited = true;
    await comment.save();

    res.json({
        success: true,
        message: 'Comment edited successfully',
        comment
    });
});

// Delete Comment
exports.deleteComment = catchAsyncErrors(async (req, res) => {
    const { leadId, commentId } = req.params;
    const currentUser = req.user;

    const Activity = await getActivityModel();
    const comment = await Activity.findOne({ _id: commentId, leadId });

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: 'Comment not found'
        });
    }

    // ✅ SECURITY: Role-based delete permissions
    if (!comment.canUserDelete(currentUser._id, currentUser.role)) {
        return res.status(403).json({
            success: false,
            message: 'Access denied: You do not have permission to delete this comment'
        });
    }

    // Soft delete - mark as deleted
    comment.isDeleted = true;
    comment.deletedBy = {
        userId: currentUser._id,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        userRole: currentUser.role,
        deletedAt: new Date()
    };
    await comment.save();

    res.json({
        success: true,
        message: 'Comment deleted successfully'
    });
});

// Like/Unlike Comment
exports.toggleLike = catchAsyncErrors(async (req, res) => {
    const { leadId, commentId } = req.params;
    const currentUser = req.user;

    const Activity = await getActivityModel();
    const comment = await Activity.findOne({ _id: commentId, leadId });

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: 'Comment not found'
        });
    }

    // Check if user already liked
    const likeIndex = comment.likes.findIndex(
        like => like.userId.toString() === currentUser._id.toString()
    );

    if (likeIndex > -1) {
        // Unlike
        comment.likes.splice(likeIndex, 1);
        await comment.save();
        return res.json({
            success: true,
            message: 'Like removed',
            liked: false,
            likesCount: comment.likes.length,
            likes: comment.likes
        });
    } else {
        // Like
        comment.likes.push({
            userId: currentUser._id,
            userName: `${currentUser.firstName} ${currentUser.lastName}`,
            userRole: currentUser.role,
            likedAt: new Date()
        });
        await comment.save();
        return res.json({
            success: true,
            message: 'Comment liked',
            liked: true,
            likesCount: comment.likes.length,
            likes: comment.likes
        });
    }
});

// Pin/Unpin Comment
exports.togglePin = catchAsyncErrors(async (req, res) => {
    const { leadId, commentId } = req.params;
    const currentUser = req.user;

    const Activity = await getActivityModel();
    const comment = await Activity.findOne({ _id: commentId, leadId });

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: 'Comment not found'
        });
    }

    // ✅ SECURITY: Only superadmin and admin can pin
    if (!comment.canUserPin(currentUser.role)) {
        return res.status(403).json({
            success: false,
            message: 'Access denied: Only admins can pin comments'
        });
    }

    if (comment.isPinned) {
        // Unpin
        comment.isPinned = false;
        comment.pinnedBy = null;
        await comment.save();
        return res.json({
            success: true,
            message: 'Comment unpinned',
            isPinned: false
        });
    } else {
        // Pin
        comment.isPinned = true;
        comment.pinnedBy = {
            userId: currentUser._id,
            userName: `${currentUser.firstName} ${currentUser.lastName}`,
            pinnedAt: new Date()
        };
        await comment.save();
        return res.json({
            success: true,
            message: 'Comment pinned',
            isPinned: true
        });
    }
});

// Mark/Unmark as Important
exports.toggleImportant = catchAsyncErrors(async (req, res) => {
    const { leadId, commentId } = req.params;
    const currentUser = req.user;

    const Activity = await getActivityModel();
    const comment = await Activity.findOne({ _id: commentId, leadId });

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: 'Comment not found'
        });
    }

    // ✅ SECURITY: Only superadmin and admin can mark as important
    if (currentUser.role !== 'superadmin' && currentUser.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied: Only admins can mark comments as important'
        });
    }

    if (comment.isImportant) {
        // Unmark
        comment.isImportant = false;
        comment.markedImportantBy = null;
        await comment.save();
        return res.json({
            success: true,
            message: 'Importance flag removed',
            isImportant: false
        });
    } else {
        // Mark as important
        comment.isImportant = true;
        comment.markedImportantBy = {
            userId: currentUser._id,
            userName: `${currentUser.firstName} ${currentUser.lastName}`,
            markedAt: new Date()
        };
        await comment.save();
        return res.json({
            success: true,
            message: 'Comment marked as important',
            isImportant: true
        });
    }
});

// Add Quote Reply
exports.addQuoteReply = catchAsyncErrors(async (req, res) => {
    const { leadId, commentId } = req.params;
    const { content } = req.body;
    const currentUser = req.user;

    if (!content || !content.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Reply content is required'
        });
    }

    const Activity = await getActivityModel();
    const originalComment = await Activity.findOne({ _id: commentId, leadId });

    if (!originalComment) {
        return res.status(404).json({
            success: false,
            message: 'Original comment not found'
        });
    }

    // Extract mentions from content (@username)
    const mentionPattern = /@(\w+\s+\w+)/g;
    const mentionedNames = [];
    let match;
    while ((match = mentionPattern.exec(content)) !== null) {
        mentionedNames.push(match[1]);
    }

    // Find mentioned users
    const mentions = [];
    if (mentionedNames.length > 0) {
        for (const name of mentionedNames) {
            const [firstName, lastName] = name.split(' ');
            const user = await User.findOne({ firstName, lastName }).select('_id firstName lastName role').lean();
            if (user) {
                mentions.push({
                    userId: user._id,
                    userName: `${user.firstName} ${user.lastName}`,
                    userRole: user.role
                });
            }
        }
    }

    // Create quote reply
    const reply = await Activity.create({
        leadId,
        type: 'comment',
        createdBy: {
            userId: currentUser._id,
            userName: `${currentUser.firstName} ${currentUser.lastName}`,
            userRole: currentUser.role
        },
        comment: content.trim(),
        quotedComment: {
            commentId: originalComment._id,
            content: originalComment.comment,
            author: {
                userName: originalComment.createdBy.userName,
                userRole: originalComment.createdBy.userRole
            }
        },
        mentions
    });

    res.json({
        success: true,
        message: 'Quote reply added successfully',
        reply
    });
});

// Add Nested Reply
exports.addNestedReply = catchAsyncErrors(async (req, res) => {
    const { leadId, commentId } = req.params;
    const { content } = req.body;
    const currentUser = req.user;

    if (!content || !content.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Reply content is required'
        });
    }

    const Activity = await getActivityModel();
    const parentComment = await Activity.findOne({ _id: commentId, leadId });

    if (!parentComment) {
        return res.status(404).json({
            success: false,
            message: 'Parent comment not found'
        });
    }

    // Extract mentions
    const mentionPattern = /@(\w+\s+\w+)/g;
    const mentionedNames = [];
    let match;
    while ((match = mentionPattern.exec(content)) !== null) {
        mentionedNames.push(match[1]);
    }

    const mentions = [];
    if (mentionedNames.length > 0) {
        for (const name of mentionedNames) {
            const [firstName, lastName] = name.split(' ');
            const user = await User.findOne({ firstName, lastName }).select('_id firstName lastName role').lean();
            if (user) {
                mentions.push({
                    userId: user._id,
                    userName: `${user.firstName} ${user.lastName}`,
                    userRole: user.role
                });
            }
        }
    }

    // ✅ CRITICAL FIX: Always use TOP-LEVEL parent for consistency
    // If replying to a nested comment, find the top-level parent
    const topLevelParentId = parentComment.parentCommentId || parentComment._id;
    
    console.log(`✅ Creating nested reply - Immediate parent: ${parentComment._id}, Top-level parent: ${topLevelParentId}`);
    
    // Create nested reply - ALWAYS point to top-level parent
    const reply = await Activity.create({
        leadId,
        type: 'comment',
        createdBy: {
            userId: currentUser._id,
            userName: `${currentUser.firstName} ${currentUser.lastName}`,
            userRole: currentUser.role
        },
        comment: content.trim(),
        parentCommentId: topLevelParentId,  // ✅ Always top-level parent!
        mentions
    });

    // Add reply to immediate parent's replies array (for tracking)
    parentComment.replies.push(reply._id);
    await parentComment.save();
    
    // If immediate parent is NOT the top-level parent, also add to top-level
    if (parentComment.parentCommentId) {
        const topLevelParent = await Activity.findById(topLevelParentId);
        if (topLevelParent && !topLevelParent.replies.includes(reply._id)) {
            topLevelParent.replies.push(reply._id);
            await topLevelParent.save();
        }
    }

    res.json({
        success: true,
        message: 'Nested reply added successfully',
        reply
    });
});

// Get Comment Edit History
exports.getCommentHistory = catchAsyncErrors(async (req, res) => {
    const { leadId, commentId } = req.params;

    const Activity = await getActivityModel();
    const comment = await Activity.findOne({ _id: commentId, leadId });

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: 'Comment not found'
        });
    }

    res.json({
        success: true,
        history: comment.editHistory,
        currentContent: comment.comment,
        isEdited: comment.isEdited
    });
});

// Get Nested Replies
exports.getNestedReplies = catchAsyncErrors(async (req, res) => {
    const { leadId, commentId } = req.params;

    const Activity = await getActivityModel();
    const parentComment = await Activity.findOne({ _id: commentId, leadId });

    if (!parentComment) {
        return res.status(404).json({
            success: false,
            message: 'Comment not found'
        });
    }

    // ✅ SIMPLIFIED: All nested replies now point to top-level parent
    // Find the top-level parent ID (could be this comment or its parent)
    const topLevelParentId = parentComment.parentCommentId || commentId;
    
    // Fetch ALL nested replies for the top-level parent
    // Since all replies (at any depth) have parentCommentId = topLevelParent, this gets everything
    const allReplies = await Activity.find({
        leadId,
        parentCommentId: topLevelParentId,
        isDeleted: { $ne: true }
    }).sort({ createdAt: 1 }).lean();
    
    console.log(`✅ Backend getNestedReplies: Fetched ${allReplies.length} replies for top-level parent ${topLevelParentId}`);
    if (allReplies.length > 0) {
        console.log(`   First reply: ${allReplies[0].comment?.substring(0, 30)}...`);
        console.log(`   Last reply: ${allReplies[allReplies.length - 1].comment?.substring(0, 30)}...`);
    }

    res.json({
        success: true,
        replies: allReplies
    });
});

// Search Comments
exports.searchComments = catchAsyncErrors(async (req, res) => {
    const { leadId } = req.params;
    const { query, startDate, endDate, authorRole } = req.query;

    if (!query || !query.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Search query is required'
        });
    }

    const Activity = await getActivityModel();
    
    const searchFilter = {
        leadId,
        type: 'comment',
        isDeleted: { $ne: true },
        comment: { $regex: query.trim(), $options: 'i' }
    };

    // Add date filter if provided
    if (startDate || endDate) {
        searchFilter.createdAt = {};
        if (startDate) searchFilter.createdAt.$gte = new Date(startDate);
        if (endDate) searchFilter.createdAt.$lte = new Date(endDate);
    }

    // Add author role filter
    if (authorRole) {
        searchFilter['createdBy.userRole'] = authorRole;
    }

    const results = await Activity.find(searchFilter)
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

    res.json({
        success: true,
        results,
        count: results.length
    });
});

// Export helper for use in other controllers
exports.logActivity = logActivity;


