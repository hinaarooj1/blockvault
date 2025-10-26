// New Activate Leads Controller - Separates User Creation from Email Sending
const getLeadModel = require('../crmDB/models/leadsModel');
const User = require('../models/userModel');
const PendingActivationEmail = require('../models/pendingActivationEmail');
const FailedEmail = require('../models/failedEmail');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Helper function to generate random password
const generatePassword = () => {
    return crypto.randomBytes(4).toString('hex'); // 8 characters
};

// Helper function to sanitize name
const sanitizeName = (name, defaultValue = 'User') => {
    if (!name || typeof name !== 'string') return defaultValue;
    return name.trim() || defaultValue;
};

// Helper function to sanitize phone
const sanitizePhone = (phoneValue) => {
    if (!phoneValue) return 0;
    if (typeof phoneValue === 'number') return phoneValue;
    if (typeof phoneValue === 'string') {
        const cleaned = phoneValue.replace(/[^\d+]/g, '');
        const numericOnly = cleaned.replace(/\+/g, '');
        const phoneNum = parseInt(numericOnly, 10);
        return isNaN(phoneNum) ? 0 : phoneNum;
    }
    return 0;
};

/**
 * Bulk Activate Leads - ONLY creates users, queues emails
 * This is FAST and shows real-time progress in blocking modal
 */
exports.bulkActivateLeads = catchAsyncErrors(async (req, res, next) => {
    const { leadIds } = req.body;
    const Lead = await getLeadModel();

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
        return res.status(400).json({
            success: false,
            msg: 'No lead IDs provided'
        });
    }

    // Setup SSE for real-time progress
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sendProgress = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
        // Get leads
        const leads = await Lead.find({ _id: { $in: leadIds }, isDeleted: false });

        if (leads.length === 0) {
            sendProgress({
                type: 'complete',
                total: 0,
                activated: 0,
                skipped: 0,
                failed: 0,
                msg: 'No leads found',
                completed: true
            });
            res.end();
            return;
        }

        const total = leads.length;
        let activatedCount = 0;
        let skippedCount = 0;
        let failedCount = 0;
        const pendingEmails = [];

        // Send start event
        sendProgress({
            type: 'start',
            total,
            activated: 0,
            skipped: 0,
            failed: 0,
            percentage: 0,
            msg: `Creating ${total} user accounts...`,
            completed: false
        });

        // Process each lead - CREATE USERS ONLY
        for (let i = 0; i < leads.length; i++) {
            const lead = leads[i];

            try {
                // Check if user already exists
                const existingUser = await User.findOne({ email: lead.email });
                
                if (existingUser) {
                    skippedCount++;
                    
                    sendProgress({
                        type: 'progress',
                        total,
                        activated: activatedCount,
                        skipped: skippedCount,
                        failed: failedCount,
                        percentage: Math.round(((activatedCount + skippedCount + failedCount) / total) * 100),
                        msg: `Skipped: ${lead.email} (already exists)`,
                        completed: false
                    });
                    continue;
                }

                // Generate password
                const tempPassword = generatePassword();

                // Create user with all required fields (match existing defaults)
                const newUser = await User.create({
                    firstName: sanitizeName(lead.firstName, 'User'),
                    lastName: sanitizeName(lead.lastName, 'Unknown'),
                    email: lead.email,
                    password: tempPassword,
                    phone: sanitizePhone(lead.phone),
                    address: lead.Address || 'N/A',
                    city: lead.city || 'N/A',  // ✅ Required field with default
                    country: lead.country || 'N/A',  // ✅ Required field with default
                    postalCode: lead.postalCode || 'N/A',  // ✅ Required field with default
                    role: 'user',
                    verified: true,  // ✅ Auto-verified like old controller
                    isShared: false
                });

                activatedCount++;
                
                // Store for pending email
                pendingEmails.push({
                    userId: newUser._id,
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    password: tempPassword,
                    leadId: lead._id
                });

                // Send progress
                sendProgress({
                    type: 'progress',
                    total,
                    activated: activatedCount,
                    skipped: skippedCount,
                    failed: failedCount,
                    percentage: Math.round(((activatedCount + skippedCount + failedCount) / total) * 100),
                    msg: `Created user: ${newUser.email}`,
                    completed: false
                });

            } catch (error) {
                failedCount++;
                console.error(`Error creating user for ${lead.email}:`, error.message);
                
                sendProgress({
                    type: 'progress',
                    total,
                    activated: activatedCount,
                    skipped: skippedCount,
                    failed: failedCount,
                    percentage: Math.round(((activatedCount + skippedCount + failedCount) / total) * 100),
                    msg: `Failed: ${lead.email}`,
                    completed: false
                });
            }
        }

        // Add all to pending emails collection (BATCH INSERT)
        if (pendingEmails.length > 0) {
            console.log(`📝 Inserting ${pendingEmails.length} emails to pending queue...`);
            await PendingActivationEmail.insertMany(pendingEmails);
            console.log(`✅ Added ${pendingEmails.length} emails to pending queue successfully`);
            
            // ✅ Emit Socket.io event for real-time update
            if (global.io) {
                // Count all pending activation emails
                const pendingCount = await PendingActivationEmail.countDocuments({ 
                    status: { $in: ['pending', 'processing', 'retrying'] } 
                });
                
                // Count failed emails (exclude 'sent')
                const failedCount = await FailedEmail.countDocuments({ 
                    status: { $in: ['pending', 'retrying', 'permanent_failure'] } 
                });
                
                console.log(`📊 Queue status: pending=${pendingCount}, failed=${failedCount}`);
                
                global.io.emit('emailQueueUpdate', {
                    pending: pendingCount,
                    processing: 0, // Not tracking separately
                    failed: failedCount,
                    total: pendingCount,
                    timestamp: new Date()
                });
                
                console.log(`📡 Socket.io emailQueueUpdate event emitted`);
            }
        }

        // Send completion
        sendProgress({
            type: 'complete',
            total,
            activated: activatedCount,
            skipped: skippedCount,
            failed: failedCount,
            percentage: 100,
            msg: `Completed! ${activatedCount} users created. Emails will be sent in background.`,
            completed: true,
            emailsQueued: pendingEmails.length
        });

        res.end();

    } catch (error) {
        console.error('Error in bulk activation:', error);
        sendProgress({
            type: 'error',
            msg: error.message || 'Activation failed',
            completed: true
        });
        res.end();
    }
});

/**
 * Get Email Queue Status (for frontend to display)
 */
exports.getEmailQueueStatus = catchAsyncErrors(async (req, res, next) => {
    // Count all pending activation emails (pending, processing, retrying)
    const pendingCount = await PendingActivationEmail.countDocuments({ 
        status: { $in: ['pending', 'processing', 'retrying'] } 
    });
    const processingCount = 0; // Not used separately anymore
    
    // Count failed emails (exclude 'sent' status - show pending, retrying, permanent_failure)
    const failedCount = await FailedEmail.countDocuments({ 
        status: { $in: ['pending', 'retrying', 'permanent_failure'] } 
    });

    // Get pending emails details (all statuses: pending, processing, retrying)
    const pendingEmails = await PendingActivationEmail.find({
        status: { $in: ['pending', 'processing', 'retrying'] }
    })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

    res.status(200).json({
        success: true,
        data: {
            pending: pendingCount,
            processing: 0, // Not tracking separately
            failed: failedCount,
            total: pendingCount,
            pendingEmails
        }
    });
});

/**
 * Manually trigger email queue processing
 * Note: Background worker runs automatically every 30 seconds in server.js
 * This endpoint is for manual triggering if needed
 */
exports.processEmailQueueNow = catchAsyncErrors(async (req, res, next) => {
    // The background worker runs in server.js
    // Just return success - the automatic worker will process it
    
    res.status(200).json({
        success: true,
        msg: 'Email queue is being processed automatically every 30 seconds. Check status in a moment.'
    });
});

/**
 * Clear Email Queue (debug/admin only) - Fix for stuck badges
 */
exports.clearEmailQueue = catchAsyncErrors(async (req, res, next) => {
    console.log('🧹 Clearing email queue (manual admin action)...');
    
    // Count before clearing
    const pendingCount = await PendingActivationEmail.countDocuments();
    const processingCount = await PendingActivationEmail.countDocuments({ status: 'processing' });
    const failedCount = await FailedEmail.countDocuments();
    
    console.log(`📊 Current queue status before clearing:`);
    console.log(`   ├─ Pending emails: ${pendingCount}`);
    console.log(`   ├─ Processing emails: ${processingCount}`);
    console.log(`   └─ Failed emails: ${failedCount}`);
    
    // Clear pending emails (all statuses)
    const pendingDeleted = await PendingActivationEmail.deleteMany({});
    console.log(`🗑️ Deleted ${pendingDeleted.deletedCount} pending emails`);
    
    // Emit updated status immediately
    if (global.io) {
        const queueStatus = {
            pending: 0,
            processing: 0,
            failed: failedCount, // Keep failed emails for reference
            total: 0,
            timestamp: new Date()
        };
        global.io.emit('emailQueueUpdate', queueStatus);
        console.log(`📡 Socket.io update emitted: pending=0, processing=0, failed=${failedCount}`);
    }
    
    res.json({
        success: true,
        msg: `✅ Cleared ${pendingDeleted.deletedCount} emails from queue. Badge should update immediately.`,
        cleared: {
            pending: pendingDeleted.deletedCount,
            processing: processingCount,
            failed: 0 // Not clearing failed emails for audit trail
        },
        newStatus: {
            pending: 0,
            processing: 0,
            failed: failedCount,
            total: 0
        }
    });
});

module.exports = exports;

