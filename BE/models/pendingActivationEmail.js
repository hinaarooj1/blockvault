const mongoose = require('mongoose');

const pendingActivationEmailSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead'
    },
    attempts: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'retrying'],
        default: 'pending'
    },
    lastAttempt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for quick queries
pendingActivationEmailSchema.index({ status: 1, createdAt: 1 });
pendingActivationEmailSchema.index({ userId: 1 });

module.exports = mongoose.model('PendingActivationEmail', pendingActivationEmailSchema);



