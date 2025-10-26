const mongoose = require("mongoose");

const htmlSchema = new mongoose.Schema({
  description: {
    type: String,
    default: "",
    trim: true,
  },
});

let htmlModel = mongoose.model("htmlData", htmlSchema);

module.exports = htmlModel;
