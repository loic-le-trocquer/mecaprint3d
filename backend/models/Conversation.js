const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // client | admin | system
    from: {
      type: String,
      enum: ["client", "admin", "system"],
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    readByAdmin: {
      type: Boolean,
      default: false,
    },

    readByClient: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const conversationSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      default: "",
      trim: true,
    },

    visitorEmail: {
      type: String,
      default: "",
      trim: true,
    },

    visitorPhone: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Ouverte", "En cours", "Terminée"],
      default: "Ouverte",
    },

    messages: [messageSchema],

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Conversation",
  conversationSchema
);