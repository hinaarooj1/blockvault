const mongoose = require('mongoose');

const activationProgressSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    total: {
        type: Number,
        default: 0
    },
    activated: {
        type: Number,
        default: 0
    },
    skipped: {
        type: Number,
        default: 0
    },
    failed: {
        type: Number,
        default: 0
    },
    emailsSent: {
        type: Number,
        default: 0
    },
    emailsFailed: {
        type: Number,
        default: 0
    },
    emailsPending: {
        type: Number,
        default: 0
    },
    percentage: {
        type: Number,
        default: 0
    },
    msg: {
        type: String,
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['start', 'progress', 'complete', 'error'],
        default: 'progress'
    },
    success: {
        type: Boolean,
        default: false
    },
    emailLimitReached: {
        type: Boolean,
        default: false
    },
    emailErrorDetails: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // Auto-delete after 10 minutes (TTL index)
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Update lastUpdated on every save
activationProgressSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    next();
});

module.exports = mongoose.model('ActivationProgress', activationProgressSchema);

