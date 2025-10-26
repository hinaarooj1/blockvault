// controllers/crmController.js
const getLeadModel = require('../crmDB/models/leadsModel');
const csv = require('csv-parser');
const fs = require('fs');
const User = require('../models/userModel'); // from main DB
const sendEmail = require('../utils/sendEmail'); // Email utility
const crypto = require('crypto'); // For generating passwords

const jwtToken = require('../utils/jwtToken');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const { logActivity } = require('./activityController');

const stream = require('stream');

// Escape user input for safe use in regex
function escapeRegex(text) {
    return text && typeof text === 'string'
        ? text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        : text;
}

exports.loginCRM = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await User.findOne({ email, role: { $in: ['admin', 'superadmin', 'subadmin'] } });

        if (!admin) return next(new ErrorHandler('Access denied', 400))
        if (admin.password != password) {
            return next(new ErrorHandler("Invalid Email or Password", 500));
        }

        jwtToken(admin, 200, res, req);


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});



exports.createLead = catchAsyncErrors(async (req, res, next) => {

    try {

        const {
            firstName,
            lastName,
            email,
            phone,
            country,
            Brand,
            Address,
            status = 'New',
            agentId,
        } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                success: false,
                msg: 'First name, last name, and email are required'
            });
        }

        // Get Lead model

        const Lead = await getLeadModel();
        const existingLead = await Lead.findOne({ email, isDeleted: false });
        if (existingLead) {
            return res.status(400).json({
                success: false,
                msg: 'A lead with this email already exists'
            });
        }

        // Decide agent assignment
        let assignedAgent = null;
        if (req.user && req.user.role === 'superadmin' && agentId) {
            const agentUser = await User.findById(agentId);
            if (!agentUser) return res.status(404).json({ success: false, msg: 'Agent user not found' });
            if (!['admin', 'subadmin', 'superadmin'].includes(agentUser.role)) {
                return res.status(400).json({ success: false, msg: 'Agent must be an admin, subadmin, or superadmin' });
            }
            assignedAgent = agentUser._id;
        } else if (req.user && req.user.role !== 'superadmin') {
            assignedAgent = req.user._id;
        } else {
            assignedAgent = null; // superadmin without agent selection leaves unassigned
        }

        // Create new lead
        const newLead = new Lead({
            firstName,
            lastName,
            email,
            phone,
            country: country ? String(country).trim() : undefined,
            Brand,
            Address,
            status,
            agent: assignedAgent,
        });

        await newLead.save();

        // Log creation activity
        const fieldsList = [];
        if (firstName) fieldsList.push(`firstName: '${firstName}'`);
        if (lastName) fieldsList.push(`lastName: '${lastName}'`);
        if (email) fieldsList.push(`email: '${email}'`);
        if (phone) fieldsList.push(`phone: '${phone}'`);
        if (country) fieldsList.push(`country: '${country}'`);
        if (Brand) fieldsList.push(`brand: '${Brand}'`);
        if (Address) fieldsList.push(`address: '${Address}'`);
        if (status) fieldsList.push(`status: '${status}'`);

        await logActivity({
            leadId: newLead._id,
            type: 'created',
            createdBy: req.user,
            changes: {
                description: `Lead created: ${fieldsList.join('; ')}`
            }
        });

        res.status(201).json({
            success: true,
            msg: 'Lead created successfully',
            data: { lead: newLead }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lead creation failed' });
    }
});
exports.uploadCSV = catchAsyncErrors(async (req, res, next) => {

    try {

        console.log('req.file: ', req.file);
        const Lead = await getLeadModel();
        if (!req.file) {
            return res.status(400).json({
                success: false,
                msg: 'No file uploaded'
            });
        }

        const fieldMapping = JSON.parse(req.body.fieldMapping || '{}');
        const selectedFields = JSON.parse(req.body.selectedFields || '{}');
        const incomingAgentId = req.body.agentId;
        const enableProgress = req.body.enableProgress === 'true'; // Check if progress tracking is enabled

        // Resolve assignment agent once per upload
        if (req.user && req.user.role === 'admin') {
            // Admin must have permission to manage CRM leads
            const me = await User.findById(req.user._id).select('adminPermissions');
            if (!me?.adminPermissions?.canManageCrmLeads) {
                return res.status(403).json({ success: false, msg: 'CRM leads management not allowed for admin' });
            }
        }
        let uploadAssignedAgent = null;
        if (req.user && req.user.role === 'superadmin' && incomingAgentId) {
            const agentUser = await User.findById(incomingAgentId);
            if (!agentUser) {
                return res.status(404).json({ success: false, msg: 'Agent user not found' });
            }
            if (!['admin', 'subadmin', 'superadmin'].includes(agentUser.role)) {
                return res.status(400).json({ success: false, msg: 'Agent must be an admin, subadmin, or superadmin' });
            }
            uploadAssignedAgent = agentUser._id;
        } else if (req.user && ['admin', 'subadmin'].includes(req.user.role)) {
            uploadAssignedAgent = req.user._id;
        } else {
            uploadAssignedAgent = null; // superadmin may leave unassigned
        }

        const results = [];
        const errors = [];
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);
        
        // If progress tracking enabled, set up SSE
        if (enableProgress) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();
        }

        const sendProgress = (data) => {
            if (enableProgress) {
                res.write(`data: ${JSON.stringify(data)}\n\n`);
            }
        };

        await new Promise((resolve, reject) => {
            bufferStream
                .pipe(csv())
                .on('data', (data) => {
                    try {
                        const mappedData = {};
                        let hasRequiredFields = true;

                        // Map fields according to user selection
                        Object.keys(selectedFields).forEach(fieldKey => {
                            if (selectedFields[fieldKey] && fieldMapping[fieldKey]) {
                                const csvValue = data[fieldMapping[fieldKey]];
                                if (csvValue !== undefined && csvValue !== '') {
                                    mappedData[fieldKey] = csvValue;
                                }
                            }
                        });

                        // Check required fields
                        if (!mappedData.firstName || !mappedData.lastName || !mappedData.email) {
                            errors.push({
                                row: results.length + 1,
                                error: 'Missing required fields (firstName, lastName, email)',
                                data: mappedData
                            });
                            return;
                        }

                        // Clean and validate data
                        const cleanData = {
                            firstName: mappedData.firstName ? mappedData.firstName.trim() : '',
                            lastName: mappedData.lastName ? mappedData.lastName.trim() : '',
                            email: mappedData.email ? mappedData.email.trim().toLowerCase() : '',
                            phone: mappedData.phone ? mappedData.phone.trim() : '',
                            country: mappedData.country ? mappedData.country.trim() : '',
                            Brand: mappedData.Brand ? mappedData.Brand.trim() : '',
                            Address: mappedData.Address ? mappedData.Address.trim() : '',
                            status: mappedData.status && ['New', 'Call Back', 'Not Active', 'Active', "Not Interested"].includes(mappedData.status)
                                ? mappedData.status
                                : 'New',
                            agent: uploadAssignedAgent,
                        };

                        results.push(cleanData);
                    } catch (rowError) {
                        errors.push({
                            row: results.length + 1,
                            error: `Row processing error: ${rowError.message}`,
                            data
                        });
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });

        if (results.length === 0) {
            if (enableProgress) {
                sendProgress({
                    type: 'error',
                    message: 'No valid data found in CSV file',
                    errors
                });
                res.end();
            } else {
            return res.status(400).json({
                success: false,
                msg: 'No valid data found in CSV file',
                errors
            });
            }
            return;
        }

        // Send initial progress
        sendProgress({
            type: 'start',
            total: results.length,
            percentage: 0
        });

        // Process leads in batches with bulk operations
        const BATCH_SIZE = 1000; // Increased batch size for better performance
        let processedCount = 0; // Track count instead of storing documents
        const skippedLeads = [];
        let lastProgressUpdate = 0;
        const PROGRESS_UPDATE_INTERVAL = results.length > 1000 ? 50 : 10; // Less frequent updates for large datasets

        for (let i = 0; i < results.length; i += BATCH_SIZE) {
            const batch = results.slice(i, i + BATCH_SIZE);

            // Bulk duplicate check: Get all emails in this batch
            const batchEmails = batch.map(lead => lead.email);
            const existingLeads = await Lead.find({
                email: { $in: batchEmails },
                        isDeleted: false
            }).select('email').lean();

            // Create a Set of existing emails for fast lookup
            const existingEmailsSet = new Set(existingLeads.map(lead => lead.email));

            // Separate leads into new and duplicate
            const leadsToInsert = [];
            for (const leadData of batch) {
                if (existingEmailsSet.has(leadData.email)) {
                        skippedLeads.push({
                            email: leadData.email,
                            reason: 'Duplicate email'
                        });
                } else {
                    leadsToInsert.push(leadData);
                }
            }

            // Bulk insert new leads
            if (leadsToInsert.length > 0) {
                try {
                    const result = await Lead.insertMany(leadsToInsert, { ordered: false });
                    processedCount += result.length; // Only count, don't store documents
                } catch (error) {
                    // Handle any individual errors during bulk insert
                    if (error.writeErrors) {
                        error.writeErrors.forEach(writeError => {
                    skippedLeads.push({
                                email: leadsToInsert[writeError.index]?.email || 'unknown',
                                reason: writeError.errmsg || 'Insert error'
                            });
                        });
                        // Count successful inserts even if some failed
                        processedCount += (leadsToInsert.length - error.writeErrors.length);
                    } else {
                        // If entire batch failed, add to skipped
                        leadsToInsert.forEach(lead => {
                            skippedLeads.push({
                                email: lead.email,
                                reason: error.message || 'Insert error'
                            });
                    });
                }
            }
        }

            // Send progress update every N leads
            const currentProgress = processedCount + skippedLeads.length;
            if (currentProgress - lastProgressUpdate >= PROGRESS_UPDATE_INTERVAL || currentProgress === results.length) {
                sendProgress({
                    type: 'progress',
                    total: results.length,
                    uploaded: processedCount,
                    skipped: skippedLeads.length,
                    percentage: Math.round((currentProgress / results.length) * 100)
                });
                lastProgressUpdate = currentProgress;
            }
        }

        const responseData = {
            success: true,
            msg: `Successfully processed ${processedCount} leads${skippedLeads.length > 0 ? `, ${skippedLeads.length} skipped` : ''}`,
            data: {
                processed: processedCount,
                skipped: skippedLeads.length,
                details: {
                    // Don't return full lead objects to save memory
                    skippedLeads: skippedLeads.length > 100 ? skippedLeads.slice(0, 100) : skippedLeads, // Limit skipped list
                    errors: errors.length > 0 ? (errors.length > 100 ? errors.slice(0, 100) : errors) : undefined
                }
            }
        };

        if (enableProgress) {
            // Send completion
            sendProgress({
                type: 'complete',
                ...responseData
            });
            res.end();
        } else {
            res.json(responseData);
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Upload failed' });
    }
});


// GET /api/leads
exports.getLeads = async (req, res) => {
    try {
        const Lead = await getLeadModel();
         
        const {
            search,
            status,
            country,
            agent,
            page = 1,
            limit = 100,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build query
        const query = { isDeleted: false };

        if (search) {
            const searchTrimmed = String(search).trim();
            const regexGlobal = { $regex: searchTrimmed, $options: "i" };
            const nameRegex = new RegExp(escapeRegex(searchTrimmed), 'i');
            const parts = searchTrimmed.split(/\s+/);

            query.$or = [
                { firstName: regexGlobal },
                { lastName: regexGlobal },
                { email: regexGlobal },
                { phone: regexGlobal },
                { Brand: regexGlobal },
                { Address: regexGlobal },
                // Full name contains search (e.g., "john doe")
                { $expr: { $regexMatch: { input: { $concat: ['$firstName', ' ', '$lastName'] }, regex: nameRegex } } }
            ];

            if (parts.length >= 2) {
                const first = new RegExp(escapeRegex(parts[0]), 'i');
                const last = new RegExp(escapeRegex(parts.slice(1).join(' ')), 'i');
                // Match first and last separately in either order
                query.$or.push({ $and: [{ firstName: first }, { lastName: last }] });
                query.$or.push({ $and: [{ firstName: last }, { lastName: first }] });
            }
        }

        if (status && status !== '') query.status = status;
        if (country && country !== '') {
            // Case-insensitive, whitespace-tolerant country match
            const countryPattern = new RegExp(`^${escapeRegex(String(country).trim())}$`, 'i');
            query.country = countryPattern;
        }
        if (agent && agent !== '') query.agent = agent;

        // Visibility rules
        if (req.user && req.user.role === 'subadmin') {
            // Subadmin: only own leads
            query.agent = req.user._id;
        } else if (req.user && req.user.role === 'admin') {
            // Admin: own leads + subadmins' leads only if allowed
            const me = await User.findById(req.user._id).select('adminPermissions');
            if (me?.adminPermissions?.canManageCrmLeads) {
                const subadmins = await User.find({ role: 'subadmin' }).select('_id');
                const subadminIds = subadmins.map(u => u._id);
                query.agent = { $in: [req.user._id, ...subadminIds] };
            } else {
                query.agent = req.user._id;
            }
        }

        // Parse pagination parameters
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Validate pagination
        if (pageNum < 1 || limitNum < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid pagination parameters"
            });
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Get leads without population first
        const leads = await Lead.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limitNum)
            .lean(); // Use lean() for better performance

        // Manually populate agent data
        const agentIds = leads.map(lead => lead.agent).filter(id => id);
        const agents = await User.find({ _id: { $in: agentIds } })
            .select('firstName lastName email role')
            .lean();

        const agentMap = agents.reduce((map, agent) => {
            map[agent._id.toString()] = agent;
            return map;
        }, {});

        // Combine leads with agent data
        const populatedLeads = leads.map(lead => ({
            ...lead,
            agent: lead.agent ? agentMap[lead.agent.toString()] : null
        }));

        // Get counts
        const [totalLeads, totalFiltered] = await Promise.all([
            Lead.countDocuments({ isDeleted: false }),
            Lead.countDocuments(query)
        ]);

        // Calculate pagination info
        const totalPages = Math.ceil(totalFiltered / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPrevPage = pageNum > 1;

        res.status(200).json({
            success: true,
            data: {
                leads: populatedLeads,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalLeads,
                    totalFiltered,
                    hasNextPage,
                    hasPrevPage,
                    limit: limitNum,
                    nextPage: hasNextPage ? pageNum + 1 : null,
                    prevPage: hasPrevPage ? pageNum - 1 : null
                }
            }
        });
    } catch (err) {
        console.error("Error fetching leads:", err);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
};
// Assign or reassign multiple leads to a specific agent (admin or subadmin)
exports.assignLeadsToAgent = async (req, res) => {
    try {
        const Lead = await getLeadModel();
      
        const { leadIds, agentId } = req.body;

        if (!Array.isArray(leadIds) || leadIds.length === 0 || !agentId) {
            return res.status(400).json({ success: false, msg: 'agentId and leadIds are required' });
        }

        // Validate target agent exists and has appropriate role
        const agentUser = await User.findById(agentId);
        if (!agentUser) {
            return res.status(404).json({ success: false, msg: 'Agent user not found' });
        }
        if (!['admin', 'subadmin', 'superadmin'].includes(agentUser.role)) {
            return res.status(400).json({ success: false, msg: 'Agent must be an admin, subadmin, or superadmin' });
        }

        // If requester is admin, ensure they have permission and can only assign to subadmins
        if (req.user && req.user.role === 'admin') {
            const me = await User.findById(req.user._id).select('adminPermissions');
            if (!me?.adminPermissions?.canManageCrmLeads) {
                return res.status(403).json({ success: false, msg: 'CRM leads assignment not allowed for admin' });
            }
            if (agentUser.role !== 'subadmin') {
                return res.status(400).json({ success: false, msg: 'Admins can assign only to subadmins' });
            }
        }

        // Get leads before update to track old agents
        const leadsToUpdate = await Lead.find({ _id: { $in: leadIds }, isDeleted: false }).select('_id agent');

        // Update leads in bulk
        const result = await Lead.updateMany(
            { _id: { $in: leadIds }, isDeleted: false },
            { $set: { agent: agentId, updatedAt: new Date() } }
        );

        // Log assignment change activities
        for (const lead of leadsToUpdate) {
            let oldAgentName = 'Unassigned';
            if (lead.agent) {
                const oldAgent = await User.findById(lead.agent).select('firstName lastName');
                if (oldAgent) {
                    oldAgentName = `${oldAgent.firstName} ${oldAgent.lastName}`;
                }
            }
            
            await logActivity({
                leadId: lead._id,
                type: 'assignment_change',
                createdBy: req.user,
                changes: {
                    field: 'agent',
                    oldValue: oldAgentName,
                    newValue: `${agentUser.firstName} ${agentUser.lastName}`
                }
            });
        }

        return res.status(200).json({
            success: true,
            msg: `${result.modifiedCount} lead(s) assigned to ${agentUser.firstName} ${agentUser.lastName}`,
            data: { modifiedCount: result.modifiedCount }
        });
    } catch (err) {
        console.error('Error assigning leads:', err);
        return res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

exports.deleteLead = async (req, res) => {
    try {
        const Lead = await getLeadModel();
        const lead = await Lead.findById(req.params.id);
        console.log('req.params.id: ', req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                msg: 'Lead not found'
            });
        }

        // ✅ SECURITY: Check record-level authorization
        if (req.user.role === 'subadmin') {
            // Subadmin can only delete their own leads
            if (!lead.agent || lead.agent.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    msg: 'Unauthorized: You can only delete your own leads'
                });
            }
        } else if (req.user.role === 'admin') {
            // Admin can delete own leads + subadmin leads (if they have permission)
            const me = await User.findById(req.user._id).select('adminPermissions');
            if (me?.adminPermissions?.canManageCrmLeads) {
                // Admin with permission can delete own + subadmin leads
                const subadmins = await User.find({ role: 'subadmin' }).select('_id');
                const allowedAgents = [req.user._id.toString(), ...subadmins.map(s => s._id.toString())];
                
                if (lead.agent && !allowedAgents.includes(lead.agent.toString())) {
                    return res.status(403).json({
                        success: false,
                        msg: 'Unauthorized: You can only delete your own leads or subadmin leads'
                    });
                }
            } else {
                // Admin without permission can only delete own leads
                if (!lead.agent || lead.agent.toString() !== req.user._id.toString()) {
                    return res.status(403).json({
                        success: false,
                        msg: 'Unauthorized: You can only delete your own leads'
                    });
                }
            }
        }
        // Superadmin can delete any lead (no check needed)

        // Soft delete by setting isDeleted to true and timestamp
        lead.isDeleted = true;
        lead.deletedAt = new Date();
        await lead.save();

        res.status(200).json({
            success: true,
            msg: 'Lead deleted successfully'
        });
    } catch (err) {
        console.error("Error deleting lead:", err);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
};
exports.bulkDeleteLeads = async (req, res) => {
    try {
        const { leadIds } = req.body;
        console.log('req.body: ', req.body);
        const Lead = await getLeadModel();

        if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
            return res.status(400).json({
                success: false,
                msg: 'No lead IDs provided'
            });
        }

        // ✅ SECURITY: Check record-level authorization for bulk delete
        const leads = await Lead.find({ _id: { $in: leadIds } }).select('agent');
        
        if (leads.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'No leads found'
            });
        }

        // Build authorization filter based on user role
        let authorizedLeadIds = [];
        
        if (req.user.role === 'superadmin') {
            // Superadmin can delete all leads
            authorizedLeadIds = leadIds;
        } else if (req.user.role === 'admin') {
            const me = await User.findById(req.user._id).select('adminPermissions');
            if (me?.adminPermissions?.canManageCrmLeads) {
                // Admin with permission can delete own + subadmin leads
                const subadmins = await User.find({ role: 'subadmin' }).select('_id');
                const allowedAgents = [req.user._id.toString(), ...subadmins.map(s => s._id.toString())];
                
                authorizedLeadIds = leads
                    .filter(lead => !lead.agent || allowedAgents.includes(lead.agent.toString()))
                    .map(lead => lead._id);
            } else {
                // Admin without permission can only delete own leads
                authorizedLeadIds = leads
                    .filter(lead => lead.agent && lead.agent.toString() === req.user._id.toString())
                    .map(lead => lead._id);
            }
        } else if (req.user.role === 'subadmin') {
            // Subadmin can only delete their own leads
            authorizedLeadIds = leads
                .filter(lead => lead.agent && lead.agent.toString() === req.user._id.toString())
                .map(lead => lead._id);
        }

        if (authorizedLeadIds.length === 0) {
            return res.status(403).json({
                success: false,
                msg: 'Unauthorized: You do not have permission to delete these leads'
            });
        }

        const result = await Lead.updateMany(
            { _id: { $in: authorizedLeadIds } },
            { $set: { isDeleted: true, deletedAt: new Date() } }
        );

        const skippedCount = leadIds.length - authorizedLeadIds.length;
        const message = skippedCount > 0 
            ? `${result.modifiedCount} leads deleted successfully (${skippedCount} skipped due to permissions)`
            : `${result.modifiedCount} leads deleted successfully`;

        res.status(200).json({
            success: true,
            msg: message,
            data: { 
                deletedCount: result.modifiedCount,
                skippedCount: skippedCount
            }
        });

    } catch (err) {
        console.error("Error bulk deleting leads:", err);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
};
exports.deleteAllLeads = async (req, res) => {
    try {
        const Lead = await getLeadModel();
        
        // Check if progress tracking is requested
        const enableProgress = req.query.enableProgress === 'true';

        // ✅ SECURITY: Build query based on user role - only delete leads they have access to
        let query = { isDeleted: false };
        
        if (req.user.role === 'subadmin') {
            // Subadmin can only delete their own leads
            query.agent = req.user._id;
        } else if (req.user.role === 'admin') {
            const me = await User.findById(req.user._id).select('adminPermissions');
            if (me?.adminPermissions?.canManageCrmLeads) {
                // Admin with permission can delete own + subadmin leads
                const subadmins = await User.find({ role: 'subadmin' }).select('_id');
                const allowedAgents = [req.user._id, ...subadmins.map(s => s._id)];
                query.agent = { $in: allowedAgents };
            } else {
                // Admin without permission can only delete own leads
                query.agent = req.user._id;
            }
        }
        // Superadmin can delete all leads (no additional query filter)

        // If progress tracking is enabled, use SSE with batch processing
        if (enableProgress) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();

            const sendProgress = (data) => {
                res.write(`data: ${JSON.stringify(data)}\n\n`);
            };

            // Get total count
            const total = await Lead.countDocuments(query);

            if (total === 0) {
                sendProgress({
                    type: 'complete',
                    total: 0,
                    deleted: 0,
                    msg: 'No leads to delete'
                });
                res.end();
                return;
            }

            sendProgress({
                type: 'start',
                total,
                percentage: 0,
                msg: `Starting deletion of ${total} leads...`
            });

            // Process in batches for better performance
            const BATCH_SIZE = 5000; // Larger batch for soft deletes (faster than hard delete)
            let deletedCount = 0;
            let hasMore = true;

            while (hasMore) {
                // Find batch of leads to delete
                const batch = await Lead.find(query)
                    .limit(BATCH_SIZE)
                    .select('_id')
                    .lean();

                if (batch.length === 0) {
                    hasMore = false;
                    break;
                }

                const batchIds = batch.map(lead => lead._id);

                // Soft delete this batch
                const result = await Lead.updateMany(
                    { _id: { $in: batchIds }, isDeleted: false },
                    { $set: { isDeleted: true, deletedAt: new Date() } }
                );

                deletedCount += result.modifiedCount;

                // Send progress update
                const percentage = Math.min(Math.round((deletedCount / total) * 100), 100);
                sendProgress({
                    type: 'progress',
                    total,
                    deleted: deletedCount,
                    remaining: total - deletedCount,
                    percentage,
                    msg: `Deleted ${deletedCount} of ${total} leads...`
                });

                // If we processed less than batch size, we're done
                if (batch.length < BATCH_SIZE) {
                    hasMore = false;
                }
            }

            // Send completion
            sendProgress({
                type: 'complete',
                total,
                deleted: deletedCount,
                percentage: 100,
                success: true,
                msg: `All ${deletedCount} leads deleted successfully`
            });

            res.end();
        } else {
            // Fallback: non-progress version for backward compatibility
            const result = await Lead.updateMany(
                query,
                { $set: { isDeleted: true, deletedAt: new Date() } }
            );

            res.status(200).json({
                success: true,
                msg: `All ${result.modifiedCount} leads deleted successfully`,
                data: { deletedCount: result.modifiedCount }
            });
        }

    } catch (err) {
        console.error("Error deleting all leads:", err);
        
        // Try to send error through SSE if using progress
        if (req.query.enableProgress === 'true') {
            try {
                res.write(`data: ${JSON.stringify({
                    type: 'error',
                    message: err.message || 'Failed to delete leads'
                })}\n\n`);
                res.end();
            } catch (e) {
                if (!res.headersSent) {
                    res.status(500).json({
                        success: false,
                        message: "Server Error",
                        error: err.message
                    });
                }
            }
        } else {
            res.status(500).json({
                success: false,
                message: "Server Error",
                error: err.message
            });
        }
    }
};
exports.editLead = async (req, res) => {
    try {
        const Lead = await getLeadModel();
        const {
            firstName,
            lastName,
            email,
            phone,
            country,
            Brand,
            Address,
            status,
        } = req.body;

        // Validation
        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                success: false,
                msg: 'First name, last name, and email are required'
            });
        }

        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({
                success: false,
                msg: 'Lead not found'
            });
        }

        // ✅ SECURITY: Check record-level authorization
        if (req.user.role === 'subadmin') {
            // Subadmin can only edit their own leads
            if (!lead.agent || lead.agent.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    msg: 'Unauthorized: You can only edit your own leads'
                });
            }
        } else if (req.user.role === 'admin') {
            // Admin can edit own leads + subadmin leads (if they have permission)
            const me = await User.findById(req.user._id).select('adminPermissions');
            if (me?.adminPermissions?.canManageCrmLeads) {
                // Admin with permission can edit own + subadmin leads
                const subadmins = await User.find({ role: 'subadmin' }).select('_id');
                const allowedAgents = [req.user._id.toString(), ...subadmins.map(s => s._id.toString())];
                
                if (lead.agent && !allowedAgents.includes(lead.agent.toString())) {
                    return res.status(403).json({
                        success: false,
                        msg: 'Unauthorized: You can only edit your own leads or subadmin leads'
                    });
                }
            } else {
                // Admin without permission can only edit own leads
                if (!lead.agent || lead.agent.toString() !== req.user._id.toString()) {
                    return res.status(403).json({
                        success: false,
                        msg: 'Unauthorized: You can only edit your own leads'
                    });
                }
            }
        }
        // Superadmin can edit any lead (no check needed)

        // Check if email is being changed and if it conflicts with another lead
        if (email !== lead.email) {
            const existingLead = await Lead.findOne({
                email,
                isDeleted: false,
                _id: { $ne: req.params.id }
            });
            if (existingLead) {
                return res.status(400).json({
                    success: false,
                    msg: 'Another lead with this email already exists'
                });
            }
        }

        // Track changes for activity log
        const changes = [];
        if (lead.firstName !== firstName) changes.push(`firstName: from '${lead.firstName || 'N/A'}' to '${firstName}'`);
        if (lead.lastName !== lastName) changes.push(`lastName: from '${lead.lastName || 'N/A'}' to '${lastName}'`);
        if (lead.email !== email) changes.push(`email: from '${lead.email || 'N/A'}' to '${email}'`);
        if (lead.phone !== phone) changes.push(`phone: from '${lead.phone || 'N/A'}' to '${phone}'`);
        if (lead.country !== country) changes.push(`country: from '${lead.country || 'N/A'}' to '${country}'`);
        if (lead.Brand !== Brand) changes.push(`brand: from '${lead.Brand || 'N/A'}' to '${Brand}'`);
        if (lead.Address !== Address) changes.push(`address: from '${lead.Address || 'N/A'}' to '${Address}'`);
        
        // Track status change separately
        const statusChanged = lead.status !== status;
        const oldStatus = lead.status;

        // Update lead
        lead.firstName = firstName;
        lead.lastName = lastName;
        lead.email = email;
        lead.phone = phone;
        lead.country = country;
        lead.Brand = Brand;
        lead.Address = Address;
        lead.status = status;

        await lead.save();

        // Log activities
        if (changes.length > 0) {
            await logActivity({
                leadId: lead._id,
                type: 'field_update',
                createdBy: req.user,
                changes: {
                    description: changes.join('; ')
                }
            });
        }

        if (statusChanged) {
            await logActivity({
                leadId: lead._id,
                type: 'status_change',
                createdBy: req.user,
                changes: {
                    field: 'status',
                    oldValue: oldStatus,
                    newValue: status
                }
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Lead updated successfully',
            data: { lead }
        });

    } catch (err) {
        console.error("Error updating lead:", err);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
};
exports.exportLeads = async (req, res) => {
    try {
        console.log("an", req.query);
        const Lead = await getLeadModel();
        const { search, status, country, agent, fields } = req.query;

        // Build query (same as getLeads)
        const query = { isDeleted: false };

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { Brand: { $regex: search, $options: "i" } },
                { Address: { $regex: search, $options: "i" } }
            ];
        }

        if (status && status !== '') query.status = status;
        if (country && country !== '') query.country = country;
        if (agent && agent !== '') query.agent = agent;

        // Export visibility
        if (req.user && req.user.role === 'subadmin') {
            query.agent = req.user._id;
        } else if (req.user && req.user.role === 'admin') {
            const me = await User.findById(req.user._id).select('adminPermissions');
            if (me?.adminPermissions?.canManageCrmLeads) {
                const subadmins = await User.find({ role: 'subadmin' }).select('_id');
                const subadminIds = subadmins.map(u => u._id);
                query.agent = { $in: [req.user._id, ...subadminIds] };
            } else {
                query.agent = req.user._id;
            }
        }

        // Get all leads matching the filters (no pagination for export)
        const leads = await Lead.find(query).sort({ createdAt: -1 });

        // Define available fields and their headers
        const availableFields = {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            phone: 'Phone',
            country: 'Country',
            Brand: 'Brand',
            Address: 'Address',
            status: 'Status',
            createdAt: 'Created Date'
        };

        // Determine which fields to export
        let exportFields = Object.keys(availableFields);
        if (fields) {
            exportFields = fields.split(',').filter(field => availableFields[field]);
        }

        // Create CSV headers
        const headers = exportFields.map(field => availableFields[field]);
        let csvContent = headers.join(',') + '\n';

        // Create CSV rows
        leads.forEach(lead => {
            const row = exportFields.map(field => {
                let value = lead[field] || '';

                // Format dates
                if (field === 'createdAt') {
                    value = new Date(value).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                }

                // Format phone numbers to prevent scientific notation
                if (field === 'phone') {
                    // Convert to string and ensure it's treated as text
                    // Add a tab character prefix to force Excel to treat it as text
                    if (value) {
                        return `"\t${String(value).replace(/"/g, '""')}"`;
                    }
                    return '""';
                }

                // Escape CSV special characters and wrap in quotes
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvContent += row.join(',') + '\n';
        });

        // Set response headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=leads-export-${new Date().toISOString().split('T')[0]}.csv`);

        res.status(200).send(csvContent);



    } catch (err) {
        console.error("Error fetching leads:", err);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
};

// List deleted leads (recycle bin)
exports.getDeletedLeads = async (req, res) => {
    try {
        const Lead = await getLeadModel();
        const { page = 1, limit = 100, search, status, agent } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const query = { isDeleted: true };

        if (search) {
            const searchTrimmed = String(search).trim();
            const regexGlobal = { $regex: searchTrimmed, $options: "i" };
            const nameRegex = new RegExp(escapeRegex(searchTrimmed), 'i');
            const parts = searchTrimmed.split(/\s+/);
            query.$or = [
                { firstName: regexGlobal },
                { lastName: regexGlobal },
                { email: regexGlobal },
                { phone: regexGlobal },
                { Brand: regexGlobal },
                { Address: regexGlobal },
                { $expr: { $regexMatch: { input: { $concat: ['$firstName', ' ', '$lastName'] }, regex: nameRegex } } }
            ];
            if (parts.length >= 2) {
                const first = new RegExp(escapeRegex(parts[0]), 'i');
                const last = new RegExp(escapeRegex(parts.slice(1).join(' ')), 'i');
                query.$or.push({ $and: [{ firstName: first }, { lastName: last }] });
                query.$or.push({ $and: [{ firstName: last }, { lastName: first }] });
            }
        }
        if (status && status !== '') query.status = status;
        if (agent && agent !== '') query.agent = agent;

        // Visibility: subadmin only self; admin self + subadmins (if allowed)
        if (req.user && req.user.role === 'subadmin') {
            query.agent = req.user._id;
        } else if (req.user && req.user.role === 'admin') {
            const me = await User.findById(req.user._id).select('adminPermissions');
            if (me?.adminPermissions?.canManageCrmLeads) {
                const subadmins = await User.find({ role: 'subadmin' }).select('_id');
                const subadminIds = subadmins.map(u => u._id);
                query.agent = { $in: [req.user._id, ...subadminIds] };
            } else {
                query.agent = req.user._id;
            }
        }

        const [leadsRaw, totalFiltered] = await Promise.all([
            Lead.find(query).sort({ deletedAt: -1 }).skip(skip).limit(limitNum).lean(),
            Lead.countDocuments(query)
        ]);

        // Manual populate agent from main DB
        const agentIds = leadsRaw.map(l => l.agent).filter(Boolean);
        const agents = await User.find({ _id: { $in: agentIds } }).select('firstName lastName email role').lean();
        const agentMap = agents.reduce((m, a) => { m[a._id.toString()] = a; return m; }, {});
        const leads = leadsRaw.map(l => ({
            ...l,
            agent: l.agent ? agentMap[l.agent.toString()] || null : null,
        }));

        const totalPages = Math.ceil(totalFiltered / limitNum);

        res.status(200).json({
            success: true,
            data: {
                leads,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalFiltered,
                    limit: limitNum,
                }
            }
        });
    } catch (err) {
        console.error('Error fetching deleted leads:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// Restore a soft-deleted lead
exports.restoreLead = async (req, res) => {
    try {
        const Lead = await getLeadModel();
        const lead = await Lead.findById(req.params.id);
        if (!lead || !lead.isDeleted) return res.status(404).json({ success: false, msg: 'Lead not found or not deleted' });
        lead.isDeleted = false;
        lead.deletedAt = null;
        await lead.save();
        res.status(200).json({ success: true, msg: 'Lead restored successfully' });
    } catch (err) {
        console.error('Error restoring lead:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// Permanently delete a lead
exports.hardDeleteLead = async (req, res) => {
    try {
        const Lead = await getLeadModel();
        const result = await Lead.deleteOne({ _id: req.params.id, isDeleted: true });
        if (result.deletedCount === 0) return res.status(404).json({ success: false, msg: 'Lead not found or not in recycle bin' });
        res.status(200).json({ success: true, msg: 'Lead permanently deleted' });
    } catch (err) {
        console.error('Error hard deleting lead:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

exports.bulkRestoreLeads = async (req, res) => {
    try {
        const { leadIds } = req.body;
        const Lead = await getLeadModel();
        const result = await Lead.updateMany({ _id: { $in: leadIds }, isDeleted: true }, { $set: { isDeleted: false, deletedAt: null } });
        res.status(200).json({ success: true, msg: `${result.modifiedCount} lead(s) restored`, data: { restored: result.modifiedCount } });
    } catch (err) {
        console.error('Error bulk restoring leads:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

exports.bulkHardDeleteLeads = async (req, res) => {
    try {
        const { leadIds } = req.body;
        const Lead = await getLeadModel();
        const result = await Lead.deleteMany({ _id: { $in: leadIds }, isDeleted: true });
        res.status(200).json({ success: true, msg: `${result.deletedCount} lead(s) permanently deleted`, data: { deleted: result.deletedCount } });
    } catch (err) {
        console.error('Error bulk hard deleting leads:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// Restore ALL deleted leads with batch processing and progress tracking
exports.restoreAllLeads = async (req, res) => {
    try {
        const Lead = await getLeadModel();
        
        // Enable Server-Sent Events for progress tracking
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        const sendProgress = (data) => {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        };

        // Get total count of deleted leads
        const total = await Lead.countDocuments({ isDeleted: true });

        if (total === 0) {
            sendProgress({
                type: 'complete',
                total: 0,
                restored: 0,
                msg: 'No leads to restore'
            });
            res.end();
            return;
        }

        sendProgress({
            type: 'start',
            total,
            percentage: 0,
            msg: `Starting restore of ${total} leads...`
        });

        // Process in batches for better performance
        const BATCH_SIZE = 2000;
        let restoredCount = 0;
        let hasMore = true;

        while (hasMore) {
            // Find batch of deleted leads
            const batch = await Lead.find({ isDeleted: true })
                .limit(BATCH_SIZE)
                .select('_id')
                .lean();

            if (batch.length === 0) {
                hasMore = false;
                break;
            }

            const batchIds = batch.map(lead => lead._id);

            // Restore this batch
            const result = await Lead.updateMany(
                { _id: { $in: batchIds }, isDeleted: true },
                { $set: { isDeleted: false, deletedAt: null } }
            );

            restoredCount += result.modifiedCount;

            // Send progress update
            const percentage = Math.min(Math.round((restoredCount / total) * 100), 100);
            sendProgress({
                type: 'progress',
                total,
                restored: restoredCount,
                remaining: total - restoredCount,
                percentage,
                msg: `Restored ${restoredCount} of ${total} leads...`
            });

            // If we restored less than batch size, we're done
            if (batch.length < BATCH_SIZE) {
                hasMore = false;
            }
        }

        // Send completion
        sendProgress({
            type: 'complete',
            total,
            restored: restoredCount,
            percentage: 100,
            success: true,
            msg: `All ${restoredCount} lead(s) restored from recycle bin`
        });

        res.end();
    } catch (err) {
        console.error('Error restoring all leads:', err);
        
        // Try to send error through SSE if headers not sent yet
        try {
            res.write(`data: ${JSON.stringify({
                type: 'error',
                message: err.message || 'Failed to restore leads'
            })}\n\n`);
            res.end();
        } catch (e) {
            // If SSE fails, send regular error response
            if (!res.headersSent) {
                res.status(500).json({ 
                    success: false, 
                    message: 'Server Error', 
                    error: err.message 
                });
            }
        }
    }
};

// Permanently delete ALL leads from recycle bin with batch processing and progress tracking
exports.hardDeleteAllLeads = async (req, res) => {
    try {
        const Lead = await getLeadModel();
        
        // Enable Server-Sent Events for progress tracking
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        const sendProgress = (data) => {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        };

        // Get total count of deleted leads
        const total = await Lead.countDocuments({ isDeleted: true });

        if (total === 0) {
            sendProgress({
                type: 'complete',
                total: 0,
                deleted: 0,
                msg: 'No leads to delete'
            });
            res.end();
            return;
        }

        sendProgress({
            type: 'start',
            total,
            percentage: 0,
            msg: `Starting permanent deletion of ${total} leads...`
        });

        // Process in batches for better performance
        const BATCH_SIZE = 2000;
        let deletedCount = 0;
        let hasMore = true;

        while (hasMore) {
            // Find batch of deleted leads
            const batch = await Lead.find({ isDeleted: true })
                .limit(BATCH_SIZE)
                .select('_id')
                .lean();

            if (batch.length === 0) {
                hasMore = false;
                break;
            }

            const batchIds = batch.map(lead => lead._id);

            // Permanently delete this batch
            const result = await Lead.deleteMany({ _id: { $in: batchIds }, isDeleted: true });

            deletedCount += result.deletedCount;

            // Send progress update
            const percentage = Math.min(Math.round((deletedCount / total) * 100), 100);
            sendProgress({
                type: 'progress',
                total,
                deleted: deletedCount,
                remaining: total - deletedCount,
                percentage,
                msg: `Deleted ${deletedCount} of ${total} leads...`
            });

            // If we deleted less than batch size, we're done
            if (batch.length < BATCH_SIZE) {
                hasMore = false;
            }
        }

        // Send completion
        sendProgress({
            type: 'complete',
            total,
            deleted: deletedCount,
            percentage: 100,
            success: true,
            msg: `All ${deletedCount} lead(s) permanently deleted from recycle bin`
        });

        res.end();
    } catch (err) {
        console.error('Error permanently deleting all leads:', err);
        
        // Try to send error through SSE if headers not sent yet
        try {
            res.write(`data: ${JSON.stringify({
                type: 'error',
                message: err.message || 'Failed to delete leads'
            })}\n\n`);
            res.end();
        } catch (e) {
            // If SSE fails, send regular error response
            if (!res.headersSent) {
                res.status(500).json({ 
                    success: false, 
                    message: 'Server Error', 
                    error: err.message 
                });
            }
        }
    }
};