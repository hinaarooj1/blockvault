// models/ErrorLog.js
const mongoose = require("mongoose");

const errorLogSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    UserEmail: String,
    route: String,
    method: String,
    message: String,
    stack: String,
    body: Object,
    params: Object,
    query: Object,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ErrorLog", errorLogSchema);
