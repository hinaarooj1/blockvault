// models/Link.js
const mongoose = require('mongoose');


let linkSchema = new mongoose.Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },
    enabled: { type: Boolean, default: true }, // Admin can toggle
});


let linkModel = mongoose.model("Link", linkSchema);

module.exports = linkModel; 
