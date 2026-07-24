const mongoose = require("mongoose");

const qontoConnectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "mecaprint3d",
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    scopes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QontoConnection", qontoConnectionSchema);
