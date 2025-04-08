const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
    unique: true,
  },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: "2h" },
  },
});

// tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7200 });
module.exports = mongoose.model("token", tokenSchema);
