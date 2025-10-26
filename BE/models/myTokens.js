// models/Token.js
const mongoose = require("mongoose");
const tokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "User reference is required"],
    immutable: true 
  },
  logo: {
    type: String,
    required: [true, "Token logo is required"],
    trim: true,
  },
  name: {
    type: String,
    required: [true, "Token name is required"],
    maxLength: [50, "Token name cannot exceed 50 characters"],
    trim: true,
  },
  symbol: {
    type: String,
    required: [true, "Token symbol is required"],
    uppercase: true,
    maxLength: [10, "Symbol cannot exceed 10 characters"],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, "Token quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  value: {
    type: Number,
    required: [true, "Token value is required"],
    min: [0, "Token value must be non-negative"],
  },
  totalValue: {
    type: Number,
    required: true,
    min: [0, "Total value must be non-negative"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // optional (admin ID)
}, { timestamps: true });
tokenSchema.pre("save", function (next) {
  this.totalValue = this.quantity * this.value;
  next();
});

module.exports = mongoose.model("MyToken", tokenSchema);

 