const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    type: {
        type: String, // e.g., 'card_request', 'ticket_message'
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,

    },
    status: {
        type: String,

    },
    ticketId: {
        type: String,

    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId, // ID of the card request or ticket
    },
    isRead: {
        type: Boolean,
        default: false
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Notification", notificationSchema);
