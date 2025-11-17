// controllers/callController.js
const getLeadModel = require('../crmDB/models/leadsModel');
const getCallModel = require('../crmDB/models/callModel');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const { logActivity } = require('./activityController');

/**
 * Initiate a call for a lead (manual)
 */
exports.initiateCall = catchAsyncErrors(async (req, res, next) => {
    try {
        const { leadId, phoneNumber } = req.body;

        if (!leadId || !phoneNumber) {
            return next(new ErrorHandler('Lead ID and phone number are required', 400));
        }

        // Get models
        const Lead = await getLeadModel();
        const Call = await getCallModel();

        // Verify lead exists
        const lead = await Lead.findById(leadId);
        if (!lead) {
            return next(new ErrorHandler('Lead not found', 404));
        }

        // Create call record
        const sessionId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const call = new Call({
            leadId: leadId,
            sessionId: sessionId,
            phoneNumber: phoneNumber,
            status: 'ringing',
            callType: 'manual',
            startedAt: new Date()
        });
        await call.save();

        // Emit Socket.io event for real-time status
        if (global.io) {
            global.io.emit('call:status:update', {
                callId: call._id,
                sessionId: sessionId,
                leadId: leadId,
                status: 'ringing'
            });
        }

        // Initiate call using VoIP agent
        if (global.voipAgent) {
            // Store leadId in session metadata
            const callSession = await global.voipAgent.makeCall(phoneNumber, 'shimmer', null, { leadId: leadId });
            
            // Update call with session info
            call.sessionId = callSession.id || sessionId;
            await call.save();

            // Update call status to in-progress when call starts
            setTimeout(async () => {
                const updatedCall = await Call.findById(call._id);
                if (updatedCall && updatedCall.status === 'ringing') {
                    updatedCall.status = 'in-progress';
                    await updatedCall.save();
                    
                    if (global.io) {
                        global.io.emit('call:status:update', {
                            callId: call._id,
                            sessionId: call.sessionId,
                            leadId: leadId,
                            status: 'in-progress'
                        });
                    }
                }
            }, 2000);
        } else {
            return next(new ErrorHandler('VoIP agent not initialized', 500));
        }

        res.status(200).json({
            success: true,
            call: {
                id: call._id,
                sessionId: call.sessionId,
                leadId: leadId,
                phoneNumber: phoneNumber,
                status: call.status
            }
        });

    } catch (error) {
        console.error('Error initiating call:', error);
        return next(new ErrorHandler(error.message || 'Failed to initiate call', 500));
    }
});

/**
 * Bulk call leads (automatic)
 */
exports.bulkCallLeads = catchAsyncErrors(async (req, res, next) => {
    try {
        const { leadIds, options = {} } = req.body;

        if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
            return next(new ErrorHandler('Lead IDs array is required', 400));
        }

        const Lead = await getLeadModel();
        const Call = await getCallModel();

        // Get leads
        const leads = await Lead.find({ _id: { $in: leadIds } });
        if (leads.length === 0) {
            return next(new ErrorHandler('No valid leads found', 404));
        }

        const calls = [];
        const delay = options.delay || 5000; // 5 seconds between calls

        // Create call records and queue calls
        for (let i = 0; i < leads.length; i++) {
            const lead = leads[i];
            if (!lead.phone) {
                console.log(`⚠️ Lead ${lead._id} has no phone number, skipping`);
                continue;
            }

            const sessionId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const call = new Call({
                leadId: lead._id,
                sessionId: sessionId,
                phoneNumber: lead.phone,
                status: 'scheduled',
                callType: 'automatic',
                scheduledAt: new Date(Date.now() + (i * delay))
            });
            await call.save();
            calls.push(call);

            // Emit progress
            if (global.io) {
                global.io.emit('bulk:call:progress', {
                    total: leads.length,
                    completed: i + 1,
                    current: {
                        callId: call._id,
                        leadId: lead._id,
                        phoneNumber: lead.phone
                    }
                });
            }

            // Initiate call with delay
            setTimeout(async () => {
                if (global.voipAgent) {
                    try {
                        await global.voipAgent.makeCall(lead.phone, 'shimmer', null, { leadId: lead._id });
                        
                        // Update status
                        const updatedCall = await Call.findById(call._id);
                        if (updatedCall) {
                            updatedCall.status = 'in-progress';
                            updatedCall.startedAt = new Date();
                            await updatedCall.save();
                        }
                    } catch (error) {
                        console.error(`Error calling lead ${lead._id}:`, error);
                        const updatedCall = await Call.findById(call._id);
                        if (updatedCall) {
                            updatedCall.status = 'failed';
                            updatedCall.endedAt = new Date();
                            await updatedCall.save();
                        }
                    }
                }
            }, i * delay);
        }

        res.status(200).json({
            success: true,
            message: `Queued ${calls.length} calls`,
            calls: calls.map(c => ({
                id: c._id,
                sessionId: c.sessionId,
                leadId: c.leadId,
                phoneNumber: c.phoneNumber,
                status: c.status
            }))
        });

    } catch (error) {
        console.error('Error in bulk call:', error);
        return next(new ErrorHandler(error.message || 'Failed to initiate bulk calls', 500));
    }
});

/**
 * Schedule a call for a specific time
 */
exports.scheduleCall = catchAsyncErrors(async (req, res, next) => {
    try {
        const { leadId, phoneNumber, scheduledAt } = req.body;

        if (!leadId || !phoneNumber || !scheduledAt) {
            return next(new ErrorHandler('Lead ID, phone number, and scheduled time are required', 400));
        }

        const Call = await getCallModel();
        const scheduledDate = new Date(scheduledAt);

        if (scheduledDate < new Date()) {
            return next(new ErrorHandler('Scheduled time must be in the future', 400));
        }

        const sessionId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const call = new Call({
            leadId: leadId,
            sessionId: sessionId,
            phoneNumber: phoneNumber,
            status: 'scheduled',
            callType: 'scheduled',
            scheduledAt: scheduledDate
        });
        await call.save();

        res.status(200).json({
            success: true,
            call: {
                id: call._id,
                sessionId: call.sessionId,
                leadId: leadId,
                phoneNumber: phoneNumber,
                status: call.status,
                scheduledAt: call.scheduledAt
            }
        });

    } catch (error) {
        console.error('Error scheduling call:', error);
        return next(new ErrorHandler(error.message || 'Failed to schedule call', 500));
    }
});

/**
 * Get call status
 */
exports.getCallStatus = catchAsyncErrors(async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const Call = await getCallModel();
        const call = await Call.findOne({ sessionId: sessionId }).populate('leadId', 'firstName lastName email phone');

        if (!call) {
            return next(new ErrorHandler('Call not found', 404));
        }

        res.status(200).json({
            success: true,
            call: call
        });

    } catch (error) {
        console.error('Error getting call status:', error);
        return next(new ErrorHandler(error.message || 'Failed to get call status', 500));
    }
});

/**
 * Get call history for a lead
 */
exports.getCallHistory = catchAsyncErrors(async (req, res, next) => {
    try {
        const { leadId } = req.params;

        const Call = await getCallModel();
        const calls = await Call.find({ leadId: leadId })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            calls: calls
        });

    } catch (error) {
        console.error('Error getting call history:', error);
        return next(new ErrorHandler(error.message || 'Failed to get call history', 500));
    }
});

/**
 * Cancel a call
 */
exports.cancelCall = catchAsyncErrors(async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const Call = await getCallModel();
        const call = await Call.findOne({ sessionId: sessionId });

        if (!call) {
            return next(new ErrorHandler('Call not found', 404));
        }

        if (call.status === 'completed' || call.status === 'cancelled') {
            return next(new ErrorHandler('Call cannot be cancelled', 400));
        }

        call.status = 'cancelled';
        call.endedAt = new Date();
        await call.save();

        // Emit Socket.io event
        if (global.io) {
            global.io.emit('call:status:update', {
                callId: call._id,
                sessionId: sessionId,
                leadId: call.leadId,
                status: 'cancelled'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Call cancelled',
            call: call
        });

    } catch (error) {
        console.error('Error cancelling call:', error);
        return next(new ErrorHandler(error.message || 'Failed to cancel call', 500));
    }
});

/**
 * Webhook endpoint for call summary (called by VoIP bot)
 */
exports.receiveCallSummary = catchAsyncErrors(async (req, res, next) => {
    try {
        const { sessionId, leadId, summary, transcript, metadata } = req.body;

        if (!sessionId) {
            return next(new ErrorHandler('Session ID is required', 400));
        }

        const Call = await getCallModel();
        const Lead = await getLeadModel();

        // Find call by sessionId
        const call = await Call.findOne({ sessionId: sessionId });
        if (!call) {
            return next(new ErrorHandler('Call not found', 404));
        }

        // Update call with summary
        call.summary = summary || call.summary;
        call.transcript = transcript || call.transcript;
        call.metadata = metadata || call.metadata;
        call.status = 'completed';
        call.endedAt = new Date();
        if (call.startedAt) {
            call.duration = Math.floor((call.endedAt - call.startedAt) / 1000);
        }
        await call.save();

        // Update lead's call history
        if (leadId) {
            const lead = await Lead.findById(leadId);
            if (lead) {
                if (!lead.callHistory) {
                    lead.callHistory = [];
                }
                if (!lead.callHistory.includes(call._id)) {
                    lead.callHistory.push(call._id);
                    await lead.save();
                }
            }
        }

        // Create activity log entry
        if (leadId && summary) {
            await logActivity({
                leadId: leadId,
                type: 'call_logged',
                comment: summary,
                metadata: {
                    callId: call._id,
                    sessionId: sessionId,
                    duration: call.duration,
                    transcript: transcript
                },
                isSystemGenerated: true
            });
        }

        // Emit Socket.io event
        if (global.io) {
            global.io.emit('call:summary:ready', {
                callId: call._id,
                sessionId: sessionId,
                leadId: leadId || call.leadId,
                summary: summary
            });
        }

        res.status(200).json({
            success: true,
            message: 'Call summary received',
            call: call
        });

    } catch (error) {
        console.error('Error receiving call summary:', error);
        return next(new ErrorHandler(error.message || 'Failed to receive call summary', 500));
    }
});

/**
 * Internal method to update call status (called by VoIP bot)
 */
exports.updateCallStatus = catchAsyncErrors(async (sessionId, status, data = {}) => {
    try {
        const Call = await getCallModel();
        const call = await Call.findOne({ sessionId: sessionId });

        if (!call) {
            console.error(`Call not found for sessionId: ${sessionId}`);
            return;
        }

        call.status = status;
        if (data.duration) call.duration = data.duration;
        if (data.endedAt) call.endedAt = data.endedAt;
        if (data.startedAt) call.startedAt = data.startedAt;
        await call.save();

        // Emit Socket.io event
        if (global.io) {
            global.io.emit('call:status:update', {
                callId: call._id,
                sessionId: sessionId,
                leadId: call.leadId,
                status: status
            });
        }

    } catch (error) {
        console.error('Error updating call status:', error);
    }
});

