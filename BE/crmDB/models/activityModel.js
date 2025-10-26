const mongoose = require('mongoose');
const connectCRMDatabase = require('../../config/crmDatabase');

const activitySchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['comment', 'status_change', 'assignment_change', 'field_update', 'created', 'email_sent', 'call_logged'],
        required: true,
        default: 'comment'
    },
    createdBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        userRole: {
            type: String,
            required: true
        }
    },
    comment: {
        type: String,
        default: ''
    },
    changes: {
        field: String,
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed,
        description: String
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    isSystemGenerated: {
        type: Boolean,
        default: false
    },
    // ✅ NEW: Enhanced Comment Features
    likes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        userName: String,
        userRole: String,
        likedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isPinned: {
        type: Boolean,
        default: false
    },
    pinnedBy: {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        pinnedAt: Date
    },
    attachments: [{
        fileName: String,
        fileUrl: String,
        fileType: String,
        fileSize: Number,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    editHistory: [{
        editedBy: {
            userId: mongoose.Schema.Types.ObjectId,
            userName: String,
            userRole: String
        },
        previousContent: String,
        editedAt: {
            type: Date,
            default: Date.now
        },
        editReason: String
    }],
    isImportant: {
        type: Boolean,
        default: false
    },
    markedImportantBy: {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        markedAt: Date
    },
    // ✅ NEW: Thread/Nested Replies
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        default: null,
        index: true
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }],
    // ✅ NEW: Quote Reply
    quotedComment: {
        commentId: mongoose.Schema.Types.ObjectId,
        content: String,
        author: {
            userName: String,
            userRole: String
        }
    },
    // ✅ NEW: Mentions
    mentions: [{
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        userRole: String
    }],
    isEdited: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        userRole: String,
        deletedAt: Date
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
activitySchema.index({ leadId: 1, createdAt: -1 });
activitySchema.index({ 'createdBy.userId': 1, createdAt: -1 });
activitySchema.index({ leadId: 1, isPinned: -1, createdAt: -1 }); // For pinned comments
activitySchema.index({ leadId: 1, parentCommentId: 1 }); // For nested replies
activitySchema.index({ 'mentions.userId': 1 }); // For finding mentions

// Method to format activity for display
activitySchema.methods.formatForDisplay = function() {
    const activity = this.toObject();
    
    // Format description based on type
    if (this.type === 'field_update' && this.changes) {
        activity.description = this.changes.description || 'Field updated';
    } else if (this.type === 'assignment_change' && this.changes) {
        activity.description = `Agent changed from '${this.changes.oldValue || 'Unassigned'}' to '${this.changes.newValue || 'Unassigned'}'`;
    } else if (this.type === 'status_change' && this.changes) {
        activity.description = `Status changed from '${this.changes.oldValue || 'N/A'}' to '${this.changes.newValue}'`;
    } else if (this.type === 'comment') {
        activity.description = this.comment;
    } else if (this.type === 'created') {
        activity.description = this.changes?.description || 'Lead created';
    } else if (this.changes && this.changes.description) {
        activity.description = this.changes.description;
    }
    
    return activity;
};

// ✅ NEW: Helper method to check if user can delete this activity
activitySchema.methods.canUserDelete = function(userId, userRole) {
    const authorId = this.createdBy.userId.toString();
    const authorRole = this.createdBy.userRole;
    const currentUserId = userId.toString();
    
    // Superadmin can delete all comments
    if (userRole === 'superadmin') return true;
    
    // Admin can delete subadmin comments and their own
    if (userRole === 'admin') {
        if (currentUserId === authorId) return true; // Own comment
        if (authorRole === 'subadmin') return true; // Subadmin's comment
        return false;
    }
    
    // Subadmin can delete only their own comments
    if (userRole === 'subadmin') {
        return currentUserId === authorId;
    }
    
    return false;
};

// ✅ NEW: Helper method to check if user can edit this activity
activitySchema.methods.canUserEdit = function(userId) {
    const authorId = this.createdBy.userId.toString();
    const currentUserId = userId.toString();
    
    // Only the author can edit their own comment
    return currentUserId === authorId && this.type === 'comment';
};

// ✅ NEW: Helper method to check if user can pin
activitySchema.methods.canUserPin = function(userRole) {
    // Only superadmin and admin can pin
    return userRole === 'superadmin' || userRole === 'admin';
};

// Export as async function that returns model with CRM DB connection
const getActivityModel = async () => {
    const crmDB = await connectCRMDatabase();
    return crmDB.model('Activity', activitySchema);
};

module.exports = getActivityModel;
module.exports.getActivityModel = getActivityModel;


