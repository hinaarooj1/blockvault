const mongoose = require('mongoose');

const failedEmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    subject: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    leadName: {
        type: String,
        default: ''
    },
    failureReason: {
        type: String,
        default: ''
    },
    errorType: {
        type: String,
        enum: ['rate_limit', 'quota_exceeded', 'authentication', 'timeout', 'other'],
        default: 'other'
    },
    retryCount: {
        type: Number,
        default: 0
    },
    lastRetryAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'retrying', 'sent', 'permanent_failure'],
        default: 'pending'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    activationSessionId: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    sentAt: {
        type: Date,
        default: null
    }
});

// Index for querying pending failed emails
failedEmailSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('FailedEmail', failedEmailSchema);

