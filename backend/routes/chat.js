const express = require("express");

const Conversation = require("../models/Conversation");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// =====================================================
// 🔐 ADMIN MIDDLEWARE
// =====================================================
function requireAdmin(req, res, next) {

  const auth =
    req.headers.authorization || "";

  const token =
    auth.replace("Bearer ", "");

  if (
    !token ||
    token !== process.env.ADMIN_TOKEN
  ) {

    return res.status(401).json({
      success: false,
      error: "Accès non autorisé",
    });

  }

  next();

}

// =====================================================
// 💬 CREATE / SEND CLIENT MESSAGE
// POST /api/chat
// =====================================================
router.post("/", async (req, res) => {

  try {

    const {
      conversationId,
      name,
      email,
      phone,
      message,
    } = req.body;

    // =====================================================
    // VALIDATION
    // =====================================================
    if (!message?.trim()) {

      return res.status(400).json({
        success: false,
        error: "Message requis",
      });

    }

    let conversation = null;

    // =====================================================
    // EXISTING CONVERSATION
    // =====================================================
    if (conversationId) {

      conversation =
        await Conversation.findById(
          conversationId
        );

    }

    // =====================================================
    // CREATE NEW CONVERSATION
    // =====================================================
    if (!conversation) {

      conversation =
        await Conversation.create({

          visitorName:
            name || "",

          visitorEmail:
            email || "",

          visitorPhone:
            phone || "",

          messages: [],

        });

    }

    // =====================================================
    // ADD CLIENT MESSAGE
    // =====================================================
    conversation.messages.push({

      from: "client",

      text: message.trim(),

      readByClient: true,

      readByAdmin: false,

    });

    conversation.status =
      "Ouverte";

    conversation.lastMessageAt =
      new Date();

    await conversation.save();

    // =====================================================
    // EMAIL ADMIN
    // =====================================================
    if (process.env.ADMIN_EMAIL) {

      await sendEmail({

        to:
          process.env.ADMIN_EMAIL,

        subject:
          "💬 Nouveau message chat MecaPrint3D",

        html: `
          <h1>Nouveau message chat</h1>

          <p>
            <strong>Nom :</strong>
            ${conversation.visitorName || "-"}
          </p>

          <p>
            <strong>Email :</strong>
            ${conversation.visitorEmail || "-"}
          </p>

          <p>
            <strong>Téléphone :</strong>
            ${conversation.visitorPhone || "-"}
          </p>

          <p>
            <strong>Message :</strong>
          </p>

          <p>
            ${message}
          </p>
        `,
      });

    }

    // =====================================================
    // RESPONSE
    // =====================================================
    res.json({

      success: true,

      conversationId:
        conversation._id,

      reply:
        "Merci 👌 Votre message a bien été transmis. Nous vous répondrons rapidement.",

      conversation,

    });

  } catch (error) {

    console.error(
      "❌ Erreur chat client :",
      error
    );

    res.status(500).json({

      success: false,

      error: "Erreur serveur",

    });

  }

});

// =====================================================
// 📋 ADMIN - LIST CONVERSATIONS
// GET /api/chat/admin
// =====================================================
router.get(
  "/admin",
  requireAdmin,
  async (req, res) => {

    try {

      // =====================================================
      // SHOW ARCHIVED
      // =====================================================
      const showArchived =
        req.query.archived === "true";

      // =====================================================
      // GET CONVERSATIONS
      // =====================================================
      const conversations =
        await Conversation.find({

          archived:
            showArchived
              ? true
              : { $ne: true },

        }).sort({

          lastMessageAt: -1,

        });

      res.json({

        success: true,

        conversations,

      });

    } catch (error) {

      console.error(
        "❌ Erreur liste conversations :",
        error
      );

      res.status(500).json({

        success: false,

        error: "Erreur serveur",

      });

    }

  }
);

// =====================================================
// ✉️ ADMIN REPLY
// POST /api/chat/admin/:id/reply
// =====================================================
router.post(
  "/admin/:id/reply",
  requireAdmin,
  async (req, res) => {

    try {

      const { message } = req.body;

      // =====================================================
      // VALIDATION
      // =====================================================
      if (!message?.trim()) {

        return res.status(400).json({

          success: false,

          error: "Message requis",

        });

      }

      // =====================================================
      // FIND CONVERSATION
      // =====================================================
      const conversation =
        await Conversation.findById(
          req.params.id
        );

      if (!conversation) {

        return res.status(404).json({

          success: false,

          error:
            "Conversation introuvable",

        });

      }

      // =====================================================
      // ADD ADMIN MESSAGE
      // =====================================================
      conversation.messages.push({

        from: "admin",

        text: message.trim(),

        readByAdmin: true,

        readByClient: false,

      });

      conversation.status =
        "En cours";

      conversation.lastMessageAt =
        new Date();

      await conversation.save();

      // =====================================================
      // RESPONSE
      // =====================================================
      res.json({

        success: true,

        conversation,

      });

    } catch (error) {

      console.error(
        "❌ Erreur réponse admin :",
        error
      );

      res.status(500).json({

        success: false,

        error: "Erreur serveur",

      });

    }

  }
);

// =====================================================
// 📦 ARCHIVE CONVERSATION
// PUT /api/chat/admin/:id/archive
// =====================================================
router.put(
  "/admin/:id/archive",
  requireAdmin,
  async (req, res) => {

    try {

      const conversation =
        await Conversation.findById(
          req.params.id
        );

      if (!conversation) {

        return res.status(404).json({

          success: false,

          error:
            "Conversation introuvable",

        });

      }

      // =====================================================
      // ARCHIVE
      // =====================================================
      conversation.archived = true;

      await conversation.save();

      res.json({

        success: true,

        conversation,

      });

    } catch (error) {

      console.error(
        "❌ Erreur archivage :",
        error
      );

      res.status(500).json({

        success: false,

        error: "Erreur serveur",

      });

    }

  }
);

// =====================================================
// 👁️ MARK AS READ BY ADMIN
// PUT /api/chat/admin/:id/read
// =====================================================
router.put(
  "/admin/:id/read",
  requireAdmin,
  async (req, res) => {

    try {

      const conversation =
        await Conversation.findById(
          req.params.id
        );

      if (!conversation) {

        return res.status(404).json({

          success: false,

          error:
            "Conversation introuvable",

        });

      }

      // =====================================================
      // MARK CLIENT MESSAGES AS READ
      // =====================================================
      conversation.messages =
        conversation.messages.map(
          (message) => {

            if (
              message.from === "client"
            ) {

              message.readByAdmin =
                true;

            }

            return message;

          }
        );

      await conversation.save();

      res.json({

        success: true,

        conversation,

      });

    } catch (error) {

      console.error(
        "❌ Erreur lecture admin :",
        error
      );

      res.status(500).json({

        success: false,

        error: "Erreur serveur",

      });

    }

  }
);

// =====================================================
// 💬 GET CLIENT CONVERSATION
// GET /api/chat/:id
// =====================================================
router.get("/:id", async (req, res) => {

  try {

    const conversation =
      await Conversation.findById(
        req.params.id
      );

    if (!conversation) {

      return res.status(404).json({

        success: false,

        error:
          "Conversation introuvable",

      });

    }

    res.json({

      success: true,

      conversation,

    });

  } catch (error) {

    console.error(
      "❌ Erreur lecture conversation :",
      error
    );

    res.status(500).json({

      success: false,

      error: "Erreur serveur",

    });

  }

});

// =====================================================
// EXPORT
// =====================================================
module.exports = router;