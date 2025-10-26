// Activate Leads Controller
const getLeadModel = require('../crmDB/models/leadsModel');
const User = require('../models/userModel');
const ActivationProgress = require('../models/activationProgress');
const FailedEmail = require('../models/failedEmail');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Helper to update activation progress in database
const updateActivationProgress = async (sessionId, progressData) => {
    try {
        await ActivationProgress.findOneAndUpdate(
            { sessionId },
            { 
                ...progressData,
                sessionId,
                lastUpdated: new Date()
            },
            { upsert: true, new: true }
        );
        console.log(`💾 Stored progress for session ${sessionId}:`, progressData);
    } catch (err) {
        console.error('Error storing activation progress:', err);
    }
};

// Helper function to generate random password
const generatePassword = () => {
    return crypto.randomBytes(4).toString('hex'); // 8 characters random password
};

// Helper function to safely convert phone to number
const sanitizePhone = (phoneValue) => {
    if (!phoneValue) return 0; // Default to 0 if empty
    
    // If it's already a number, return it
    if (typeof phoneValue === 'number') return phoneValue;
    
    // If it's a string, clean and convert
    if (typeof phoneValue === 'string') {
        // Remove all non-numeric characters except + at start
        const cleaned = phoneValue.replace(/[^\d+]/g, '');
        
        // Remove + sign for storage (we'll store just numbers)
        const numericOnly = cleaned.replace(/\+/g, '');
        
        // Convert to number
        const phoneNum = parseInt(numericOnly, 10);
        
        // Return valid number or 0
        return isNaN(phoneNum) ? 0 : phoneNum;
    }
    
    return 0; // Default fallback
};

// Helper function to ensure name meets validation requirements (min 2 chars, max 30)
const sanitizeName = (name, defaultName) => {
    if (!name || typeof name !== 'string') return defaultName;
    
    const trimmed = name.trim();
    
    // If too short, use default
    if (trimmed.length < 2) return defaultName;
    
    // If too long, truncate to 30 chars
    if (trimmed.length > 30) return trimmed.substring(0, 30);
    
    return trimmed;
};

// Helper function to send emails in batches with rate limiting
const sendEmailsBatch = async (emailQueue, onProgress, activationSessionId = '') => {
    // HOSTINGER-OPTIMIZED SETTINGS (Very conservative to avoid any errors)
    const BATCH_SIZE = 1;     // Send 1 email at a time (safe)
    const DELAY_BETWEEN_BATCHES = 20000; // 20 seconds delay (3 emails/minute = 180/hour - well under Hostinger's ~150/hr limit)
    
    let emailsSent = 0;
    let emailsFailed = 0;

    for (let i = 0; i < emailQueue.length; i += BATCH_SIZE) {
        const batch = emailQueue.slice(i, i + BATCH_SIZE);
        
        // Send batch concurrently
        const results = await Promise.allSettled(
            batch.map((emailData, batchIndex) => 
                sendEmail(emailData.email, emailData.subject, emailData.text)
                    .then(() => {
                        console.log(`✅ Email SUCCESS: ${emailData.email}`);
                        return { success: true, email: emailData.email, emailData };
                    })
                    .catch(err => {
                        console.error(`❌ Email FAILURE: ${emailData.email} - ${err.message}`);
                        return { success: false, email: emailData.email, error: err.message, emailData };
                    })
            )
        );

        // Track results and categorize errors
        const failureReasons = [];
        let errorDetails = '';
        const failedEmailsToSave = [];
        
        // First pass: categorize results
        results.forEach((result, index) => {
            // Check the actual returned value, not the promise status
            if (result.status === 'fulfilled') {
                const returnValue = result.value;
                
                if (returnValue && returnValue.success === true) {
                    emailsSent++;
                    console.log(`✅ Counted as SENT: ${returnValue.email}`);
                } else {
                    // This is a failure!
                    emailsFailed++;
                    const errorMsg = returnValue?.error || 'Unknown error';
                    console.error(`❌ Counted as FAILED: ${returnValue?.email} - ${errorMsg}`);
                    
                    // Determine error type
                    let errorType = 'other';
                    if (errorMsg.includes('limit') || errorMsg.includes('quota') || errorMsg.includes('Too many login') || errorMsg.includes('Daily user sending limit')) {
                        failureReasons.push(`Rate Limit/Quota Exceeded`);
                        errorDetails = 'Gmail/SMTP daily or hourly limit exceeded';
                        errorType = 'rate_limit';
                    } else if (errorMsg.includes('authentication') || errorMsg.includes('auth') || errorMsg.includes('EAUTH')) {
                        failureReasons.push('SMTP Authentication Failed');
                        errorDetails = 'SMTP authentication failed or rate limited';
                        errorType = 'authentication';
                    } else if (errorMsg.includes('timeout')) {
                        failureReasons.push('Email Timeout');
                        errorDetails = 'SMTP server timeout';
                        errorType = 'timeout';
                    } else {
                        failureReasons.push(errorMsg.substring(0, 50));
                    }
                    
                    // Queue for database save
                    failedEmailsToSave.push({
                        email: returnValue.email,
                        subject: returnValue.emailData?.subject || 'Activation Email',
                        text: returnValue.emailData?.text || '',
                        leadName: returnValue.emailData?.leadName || returnValue.email,
                        failureReason: errorMsg,
                        errorType: errorType,
                        activationSessionId: activationSessionId,
                        status: 'pending'
                    });
                }
            } else {
                // Promise itself was rejected (shouldn't happen with .catch above)
                emailsFailed++;
                console.error(`❌ Promise rejected:`, result.reason);
            }
        });
        
        // Second pass: save failed emails to database (async)
        if (failedEmailsToSave.length > 0) {
            try {
                await FailedEmail.insertMany(failedEmailsToSave);
                console.log(`💾 Saved ${failedEmailsToSave.length} failed emails to database`);
            } catch (saveErr) {
                console.error('Error saving failed emails:', saveErr);
            }
        }
        
        // Log failure summary if any failures
        if (emailsFailed > 0) {
            const uniqueReasons = [...new Set(failureReasons)];
            console.warn(`⚠️⚠️ BATCH RESULT: ${emailsSent} SENT, ${emailsFailed} FAILED`);
            console.warn(`⚠️ Failure reasons:`, uniqueReasons);
            if (errorDetails) {
                console.warn(`⚠️ Error details:`, errorDetails);
            }
        } else {
            console.log(`✅ Batch complete: All ${emailsSent} emails sent successfully`);
        }

        // Call progress callback if provided (await if it's async)
        if (onProgress) {
            await onProgress(emailsSent, emailsFailed);
        }

        // Add delay between batches to avoid overwhelming SMTP
        if (i + BATCH_SIZE < emailQueue.length) {
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
    }

    return { emailsSent, emailsFailed };
};

// Activate single lead - convert to user
exports.activateLead = catchAsyncErrors(async (req, res, next) => {
    try {
        const Lead = await getLeadModel();
        const leadId = req.params.leadId;

        // Find the lead
        const lead = await Lead.findById(leadId);
        if (!lead || lead.isDeleted) {
            return res.status(404).json({
                success: false,
                msg: 'Lead not found'
            });
        }

        // Check if user already exists with this email
        const existingUser = await User.findOne({ email: lead.email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: 'User with this email already exists'
            });
        }

        // Generate random password
        const tempPassword = generatePassword();

        // Create user in main database with safe defaults
        const newUser = await User.create({
            firstName: sanitizeName(lead.firstName, 'User'),
            lastName: sanitizeName(lead.lastName, 'Unknown'),
            email: lead.email,
            phone: sanitizePhone(lead.phone), // Convert to number safely
            password: tempPassword, // Plain text as requested
            address: lead.Address || 'N/A',
            city: 'N/A',
            country: lead.country || 'N/A',
            postalCode: 'N/A',
            role: 'user', // New users are always 'user' role
            verified: true // Auto-verified
        });

        // Send email with credentials
        const subject = `Welcome to ${process.env.WebName} - Your Account Credentials`;
        const text = `Hello ${lead.firstName} ${lead.lastName},

Your account has been activated!

Here are your login credentials:
Email: ${lead.email}
Password: ${tempPassword}

Please login and change your password immediately.

Login here: ${process.env.BASE_URL}/auth/login

Best regards,
${process.env.WebName} Team`;

        // Send email (non-blocking)
        sendEmail(lead.email, subject, text).catch(err => 
            console.error('Email send error:', err)
        );

        res.status(200).json({
            success: true,
            msg: 'Lead activated successfully. Activation email sent.',
            data: {
                userId: newUser._id,
                email: newUser.email
            }
        });

    } catch (err) {
        console.error('Error activating lead:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
});

// Bulk activate leads with progress tracking
exports.bulkActivateLeads = catchAsyncErrors(async (req, res, next) => {
    try {
        const { leadIds, sessionId } = req.body;
        const Lead = await getLeadModel();
        const enableProgress = req.query.enableProgress === 'true';

        if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
            return res.status(400).json({
                success: false,
                msg: 'No lead IDs provided'
            });
        }

        // Generate session ID if not provided
        const activationSessionId = sessionId || `activation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // If progress tracking is enabled, use SSE
        if (enableProgress) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();

            const sendProgress = (data) => {
                res.write(`data: ${JSON.stringify(data)}\n\n`);
            };

            // Get leads
            const leads = await Lead.find({ _id: { $in: leadIds }, isDeleted: false });

            if (leads.length === 0) {
                sendProgress({
                    type: 'complete',
                    total: 0,
                    activated: 0,
                    skipped: 0,
                    failed: 0,
                    emailsSent: 0,
                    msg: 'No leads to activate'
                });
                res.end();
                return;
            }

            const total = leads.length;
            let activatedCount = 0;
            let skippedCount = 0;
            let failedCount = 0;
            const emailQueue = []; // Queue for batch email sending

            const initialProgress = {
                type: 'start',
                total,
                activated: 0,
                skipped: 0,
                failed: 0,
                emailsSent: 0,
                emailsFailed: 0,
                emailsPending: 0,
                percentage: 0,
                msg: `Starting activation of ${total} leads...`,
                sessionId: activationSessionId
            };
            
            // Store initial progress - MUST AWAIT!
            await updateActivationProgress(activationSessionId, initialProgress);
            sendProgress(initialProgress);

            // Process leads one by one (user creation)
            for (let i = 0; i < leads.length; i++) {
                const lead = leads[i];

                try {
                    // Check if user already exists
                    const existingUser = await User.findOne({ email: lead.email });
                    if (existingUser) {
                        skippedCount++;
                    const progressData = {
                            type: 'progress',
                            total,
                            activated: activatedCount,
                            skipped: skippedCount,
                            failed: failedCount,
                            emailsSent: 0,
                            emailsPending: activatedCount,
                            percentage: Math.round(((activatedCount + skippedCount + failedCount) / total) * 100),
                        msg: `Skipped (already exists): ${lead.email}`,
                        sessionId: activationSessionId
                    };
                    await updateActivationProgress(activationSessionId, progressData);
                    sendProgress(progressData);
                        continue;
                    }

                    // Generate password
                    const tempPassword = generatePassword();

                    // Create user with safe defaults
                    await User.create({
                        firstName: sanitizeName(lead.firstName, 'User'),
                        lastName: sanitizeName(lead.lastName, 'Unknown'),
                        email: lead.email,
                        phone: sanitizePhone(lead.phone), // Convert to number safely
                        password: tempPassword,
                        address: lead.Address || 'N/A',
                        city: 'N/A',
                        country: lead.country || 'N/A',
                        postalCode: 'N/A',
                        role: 'user',
                        verified: true
                    });

                    activatedCount++;

                    // Queue email for batch sending
                    const subject = `Welcome to ${process.env.WebName} - Your Account Credentials`;
                    const text = `Hello ${lead.firstName} ${lead.lastName},

Your account has been activated!

Here are your login credentials:
Email: ${lead.email}
Password: ${tempPassword}

Please login and change your password immediately.

Login here: ${process.env.BASE_URL}/auth/login

Best regards,
${process.env.WebName} Team`;

                    emailQueue.push({
                        email: lead.email,
                        subject,
                        text,
                        leadName: `${lead.firstName} ${lead.lastName}`
                    });

                    const progressData = {
                        type: 'progress',
                        total,
                        activated: activatedCount,
                        skipped: skippedCount,
                        failed: failedCount,
                        emailsSent: 0,
                        emailsPending: emailQueue.length,
                        percentage: Math.round(((activatedCount + skippedCount + failedCount) / total) * 100),
                        msg: `Activated: ${lead.firstName} ${lead.lastName} (${lead.email})`,
                        sessionId: activationSessionId
                    };
                    await updateActivationProgress(activationSessionId, progressData);
                    sendProgress(progressData);

                } catch (error) {
                    failedCount++;
                    console.error(`Error activating lead ${lead.email}:`, error);
                    
                    const progressData = {
                        type: 'progress',
                        total,
                        activated: activatedCount,
                        skipped: skippedCount,
                        failed: failedCount,
                        emailsSent: 0,
                        emailsPending: emailQueue.length,
                        percentage: Math.round(((activatedCount + skippedCount + failedCount) / total) * 100),
                        msg: `Failed: ${lead.email} - ${error.message}`,
                        sessionId: activationSessionId
                    };
                    await updateActivationProgress(activationSessionId, progressData);
                    sendProgress(progressData);
                }
            }

            // Now send all emails in batches with progress tracking
            const emailStartProgress = {
                type: 'progress',
                total,
                activated: activatedCount,
                skipped: skippedCount,
                failed: failedCount,
                emailsSent: 0,
                emailsPending: emailQueue.length,
                percentage: Math.round(((activatedCount + skippedCount + failedCount) / total) * 100),
                msg: `User creation complete. Starting email delivery (${emailQueue.length} emails)...`,
                sessionId: activationSessionId
            };
            await updateActivationProgress(activationSessionId, emailStartProgress);
            sendProgress(emailStartProgress);

            let currentEmailsSent = 0;
            let currentEmailsFailed = 0;

            // Send emails in batches
            let smtpLimitHit = false;
            let emailErrorType = '';
            
            await sendEmailsBatch(emailQueue, async (sent, failed) => {
                currentEmailsSent = sent;
                currentEmailsFailed = failed;
                
                // Check if we're hitting email limits
                const failureRate = failed / (sent + failed || 1);
                if (failed > 3 && failureRate > 0.3) {  // Lower threshold - detect earlier
                    smtpLimitHit = true;
                    emailErrorType = 'SMTP rate limit or quota exceeded';
                    console.warn('🚨🚨 SMTP RATE LIMIT DETECTED!');
                    console.warn(`   Sent: ${sent}, Failed: ${failed}, Failure rate: ${(failureRate * 100).toFixed(1)}%`);
                }
                
                const emailProgress = {
                    type: 'progress',
                    total,
                    activated: activatedCount,
                    skipped: skippedCount,
                    failed: failedCount,
                    emailsSent: sent,
                    emailsFailed: failed,
                    emailsPending: emailQueue.length - sent - failed,
                    percentage: 100, // User creation is 100%
                    msg: smtpLimitHit 
                        ? `🚨 SMTP limit! Only ${sent}/${emailQueue.length} sent, ${failed} FAILED`
                        : `Sending emails... ${sent}/${emailQueue.length} sent${failed > 0 ? `, ${failed} failed` : ''}`,
                    emailLimitReached: smtpLimitHit,
                    emailErrorDetails: smtpLimitHit ? emailErrorType : '',
                    sessionId: activationSessionId
                };
                await updateActivationProgress(activationSessionId, emailProgress);
                sendProgress(emailProgress);
            });

            // Send completion with detailed message
            const emailFailureRate = currentEmailsFailed / (currentEmailsSent + currentEmailsFailed || 1);
            const hasEmailIssues = currentEmailsFailed > 0;
            const likelySmtpLimit = smtpLimitHit || (currentEmailsFailed > 3 && emailFailureRate > 0.3);
            
            let completionMsg = `✅ ${activatedCount} users created successfully!`;
            if (skippedCount > 0) completionMsg += ` (${skippedCount} skipped)`;
            if (failedCount > 0) completionMsg += ` (${failedCount} creation failed)`;
            
            if (hasEmailIssues) {
                completionMsg += ` 📧 Emails: ${currentEmailsSent} sent, ${currentEmailsFailed} FAILED`;
                if (likelySmtpLimit) {
                    completionMsg += ` 🚨 SMTP LIMIT HIT!`;
                }
            } else {
                completionMsg += ` 📧 All ${currentEmailsSent} emails sent!`;
            }
            
            const completionProgress = {
                type: 'complete',
                total,
                activated: activatedCount,
                skipped: skippedCount,
                failed: failedCount,
                emailsSent: currentEmailsSent,
                emailsFailed: currentEmailsFailed,
                emailsPending: 0,
                percentage: 100,
                success: true,
                completed: true,
                msg: completionMsg,
                emailLimitReached: likelySmtpLimit,
                emailErrorDetails: likelySmtpLimit ? emailErrorType : '',
                sessionId: activationSessionId
            };
            
            console.log('🏁 ACTIVATION COMPLETE!');
            console.log(`   Users: ${activatedCount} created, ${skippedCount} skipped, ${failedCount} failed`);
            console.log(`   Emails: ${currentEmailsSent} sent, ${currentEmailsFailed} failed`);
            if (likelySmtpLimit) {
                console.error(`   🚨 SMTP LIMIT WAS HIT! Check email provider limits.`);
            }
            
            await updateActivationProgress(activationSessionId, completionProgress);
            sendProgress(completionProgress);

            res.end();

        } else {
            // Non-progress version (simple bulk)
            const leads = await Lead.find({ _id: { $in: leadIds }, isDeleted: false });
            let activated = 0;
            let skipped = 0;
            const emailQueue = [];

            for (const lead of leads) {
                const existingUser = await User.findOne({ email: lead.email });
                if (existingUser) {
                    skipped++;
                    continue;
                }

                const tempPassword = generatePassword();
                await User.create({
                    firstName: sanitizeName(lead.firstName, 'User'),
                    lastName: sanitizeName(lead.lastName, 'Unknown'),
                    email: lead.email,
                    phone: sanitizePhone(lead.phone), // Convert to number safely
                    password: tempPassword,
                    address: lead.Address || 'N/A',
                    city: 'N/A',
                    country: lead.country || 'N/A',
                    postalCode: 'N/A',
                    role: 'user',
                    verified: true
                });

                activated++;

                // Queue email
                const subject = `Welcome to ${process.env.WebName} - Your Account Credentials`;
                const text = `Hello ${lead.firstName} ${lead.lastName},

Your account has been activated!

Credentials:
Email: ${lead.email}
Password: ${tempPassword}

Login here: ${process.env.BASE_URL}/auth/login

Best regards,
${process.env.WebName} Team`;

                emailQueue.push({ email: lead.email, subject, text });
            }

            // Send emails in batches (non-blocking for response)
            sendEmailsBatch(emailQueue, null).then(result => {
                console.log(`Emails sent: ${result.emailsSent}/${emailQueue.length}, Failed: ${result.emailsFailed}`);
            }).catch(err => {
                console.error('Batch email error:', err);
            });

            res.status(200).json({
                success: true,
                msg: `${activated} leads activated successfully${skipped > 0 ? `, ${skipped} skipped` : ''}. Activation emails are being sent in background.`,
                data: { activated, skipped, emailsQueued: emailQueue.length }
            });
        }

    } catch (err) {
        console.error('Error in bulk activation:', err);
        
        if (req.query.enableProgress === 'true') {
            try {
                res.write(`data: ${JSON.stringify({
                    type: 'error',
                    message: err.message || 'Failed to activate leads'
                })}\n\n`);
                res.end();
            } catch (e) {
                if (!res.headersSent) {
                    res.status(500).json({
                        success: false,
                        message: 'Server Error',
                        error: err.message
                    });
                }
            }
        } else {
            res.status(500).json({
                success: false,
                message: 'Server Error',
                error: err.message
            });
        }
    }
});

// Get failed emails for superadmin
exports.getFailedEmails = catchAsyncErrors(async (req, res, next) => {
    try {
        const { page = 1, limit = 50, status } = req.query;
        
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        
        // Exclude 'sent' status from failed emails list
        // Show: pending, retrying, permanent_failure (NOT sent)
        const query = status 
            ? { status } 
            : { status: { $in: ['pending', 'retrying', 'permanent_failure'] } };
        
        const [failedEmails, total] = await Promise.all([
            FailedEmail.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            FailedEmail.countDocuments(query)
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                emails: failedEmails,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(total / limitNum),
                    total,
                    limit: limitNum
                }
            }
        });
    } catch (err) {
        console.error('Error getting failed emails:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
});

// Resend failed emails
exports.resendFailedEmails = catchAsyncErrors(async (req, res, next) => {
    try {
        const { emailIds } = req.body;
        
        if (!emailIds || !Array.isArray(emailIds) || emailIds.length === 0) {
            return res.status(400).json({
                success: false,
                msg: 'No email IDs provided'
            });
        }
        
        const failedEmails = await FailedEmail.find({ 
            _id: { $in: emailIds },
            status: 'pending'
        });
        
        if (failedEmails.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'No pending failed emails found'
            });
        }
        
        let resent = 0;
        let failed = 0;
        
        // Resend emails one by one with delay
        for (const failedEmail of failedEmails) {
            try {
                // Mark as retrying (temporary status during send attempt)
                failedEmail.status = 'retrying';
                failedEmail.retryCount += 1;
                failedEmail.lastRetryAt = new Date();
                await failedEmail.save();
                
                try {
                    // Attempt to send
                    await sendEmail(failedEmail.email, failedEmail.subject, failedEmail.text);
                    
                    // Success! Mark as sent (will be deleted by cron after 10 days)
                    failedEmail.status = 'sent';
                    failedEmail.sentAt = new Date();
                    await failedEmail.save();
                    resent++;
                    console.log(`✅ Resent email successfully: ${failedEmail.email}`);
                    
                } catch (sendErr) {
                    // Send failed - mark as pending again (can retry later)
                    failedEmail.status = 'pending';
                    failedEmail.failureReason = sendErr.message || 'Unknown error';
                    await failedEmail.save();
                    failed++;
                    console.error(`❌ Resend failed: ${failedEmail.email} - ${sendErr.message}`);
                }
                
            } catch (err) {
                // Error updating status - force back to pending
                failed++;
                console.error(`❌ Critical error during resend: ${failedEmail.email} - ${err.message}`);
                try {
                    failedEmail.status = 'pending';
                    await failedEmail.save();
                } catch (saveErr) {
                    console.error(`❌ Failed to reset status: ${saveErr.message}`);
                }
            }
            
            // Delay between resends (20 seconds - same as batch sending)
            if (resent + failed < failedEmails.length) {
                await new Promise(resolve => setTimeout(resolve, 20000));
            }
        }
        
        res.status(200).json({
            success: true,
            msg: `${resent} email(s) resent successfully${failed > 0 ? `, ${failed} still failed` : ''}`,
            data: { resent, failed }
        });
        
    } catch (err) {
        console.error('Error resending failed emails:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
});

// Delete failed email records
exports.deleteFailedEmails = catchAsyncErrors(async (req, res, next) => {
    try {
        const { emailIds } = req.body;
        
        if (!emailIds || !Array.isArray(emailIds)) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid email IDs'
            });
        }
        
        const result = await FailedEmail.deleteMany({ _id: { $in: emailIds } });
        
        res.status(200).json({
            success: true,
            msg: `${result.deletedCount} failed email(s) deleted`,
            data: { deleted: result.deletedCount }
        });
    } catch (err) {
        console.error('Error deleting failed emails:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
});

// Get current activation progress by session ID
exports.getActivationProgress = catchAsyncErrors(async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        
        console.log('🔍 Looking up progress for session:', sessionId);
        
        if (!sessionId) {
            return res.status(400).json({
                success: false,
                msg: 'Session ID is required'
            });
        }

        const progress = await ActivationProgress.findOne({ sessionId }).lean();
        
        if (!progress) {
            console.log('❌ No progress found for session:', sessionId);
            return res.status(404).json({
                success: false,
                msg: 'No active activation session found'
            });
        }

        console.log('✅ Found progress:', progress);

        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (err) {
        console.error('Error getting activation progress:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
});

