const mongoose = require("mongoose");

// =====================================================
// 💬 MESSAGE SCHEMA
// =====================================================
const messageSchema =
  new mongoose.Schema(
    {

      // =====================================================
      // MESSAGE AUTHOR
      // client | admin | system
      // =====================================================
      from: {
        type: String,

        enum: [
          "client",
          "admin",
          "system",
        ],

        required: true,
      },

      // =====================================================
      // MESSAGE TEXT
      // =====================================================
      text: {
        type: String,

        required: true,

        trim: true,
      },

      // =====================================================
      // FILES ATTACHED TO MESSAGE
      // =====================================================
      files: [
        {

          // Original file name
          originalName: String,

          // Saved filename
          filename: String,

          // File path
          path: String,

          // Mime type
          mimetype: String,

          // File size
          size: Number,

        },
      ],

      // =====================================================
      // READ STATUS - ADMIN
      // =====================================================
      readByAdmin: {
        type: Boolean,

        default: false,
      },

      // =====================================================
      // READ STATUS - CLIENT
      // =====================================================
      readByClient: {
        type: Boolean,

        default: false,
      },

    },
    {

      // =====================================================
      // AUTO CREATED AT / UPDATED AT
      // =====================================================
      timestamps: true,

    }
  );

// =====================================================
// 💬 CONVERSATION SCHEMA
// =====================================================
const conversationSchema =
  new mongoose.Schema(
    {

      // =====================================================
      // VISITOR NAME
      // =====================================================
      visitorName: {
        type: String,

        default: "",

        trim: true,
      },

      // =====================================================
      // VISITOR EMAIL
      // =====================================================
      visitorEmail: {
        type: String,

        default: "",

        trim: true,
      },

      // =====================================================
      // VISITOR PHONE
      // =====================================================
      visitorPhone: {
        type: String,

        default: "",

        trim: true,
      },

      // =====================================================
      // CONVERSATION STATUS
      // =====================================================
      status: {
        type: String,

        enum: [
          "Ouverte",
          "En cours",
          "Terminée",
        ],

        default: "Ouverte",
      },

      // =====================================================
      // ALL CONVERSATION MESSAGES
      // =====================================================
      messages: [
        messageSchema,
      ],

      // =====================================================
      // LAST MESSAGE DATE
      // =====================================================
      lastMessageAt: {
        type: Date,

        default: Date.now,
      },

      // =====================================================
      // ARCHIVED STATUS
      // =====================================================
      archived: {
        type: Boolean,

        default: false,
      },

    },
    {

      // =====================================================
      // AUTO CREATED AT / UPDATED AT
      // =====================================================
      timestamps: true,

    }
  );

// =====================================================
// EXPORT MODEL
// =====================================================
module.exports =
  mongoose.model(
    "Conversation",
    conversationSchema
  );