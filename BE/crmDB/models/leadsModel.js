// models/Lead.js
const mongoose = require("mongoose");
const connectCRMDatabase = require("../../config/crmDatabase");

const noteSchema = new mongoose.Schema({
  text: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const leadSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  country: String,
  Brand: String,
  Address: String,
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: {
    type: String,
    enum: ["New", "Call Back", "Not Active", "Active", "Not Interested"],
    default: "New",
  },
  notes: [noteSchema],
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

leadSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better performance
leadSchema.index({ email: 1, isDeleted: 1 }); // Compound index for duplicate checks
leadSchema.index({ agent: 1, isDeleted: 1 }); // For filtering by agent
leadSchema.index({ status: 1 }); // For filtering by status
leadSchema.index({ createdAt: -1 }); // For sorting by date

const getLeadModel = async () => {
  const crmDB = await connectCRMDatabase();
  return crmDB.model("Lead", leadSchema);
};

module.exports = getLeadModel;
module.exports.getLeadModel = getLeadModel;
