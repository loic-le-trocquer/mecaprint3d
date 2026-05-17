const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    project: String,
    quantity: Number,
    material: String,
    message: String,

    files: [
  {
    originalName: String,
    filename: String,
    path: String,
    mimetype: String,
    size: Number,
  },
],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quote", quoteSchema);