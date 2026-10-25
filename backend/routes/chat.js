const express = require("express");
const multer = require("multer");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const rateLimit = require("express-rate-limit");
const requireAdmin = require("../middleware/adminAuth");
const { tokenHash, visitorAuthorized, publicConversation, escapeHtml } = require("../chatSecurity");
const chatDirectory = path.join(__dirname, "../uploads/chat");
fs.mkdirSync(chatDirectory, { recursive: true });


const Conversation = require("../models/Conversation");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();
router.use((req, res, next) => { res.set("Cache-Control", "no-store"); next(); });
router.get("/capabilities", (req, res) => res.json({ success: true, visitorSession: true, version: 2 }));
const visitorWriteLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 40, standardHeaders: true, legacyHeaders: false });
const visitorReadLimit = rateLimit({ windowMs: 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false });
const validId = id => /^[a-f0-9]{24}$/i.test(String(id || ""));

// =====================================================
// 📂 CHAT FILE STORAGE
// =====================================================
const storage = multer.diskStorage({
  destination: chatDirectory,

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

// =====================================================
// 📂 CHAT FILE UPLOAD
// =====================================================
const upload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

// =====================================================
// 🔐 ADMIN MIDDLEWARE
// =====================================================
// =====================================================
// 💬 CREATE / SEND CLIENT MESSAGE
// POST /api/chat
// =====================================================
router.post(
  "/",
  visitorWriteLimit,
  upload.array("files", 10),
  async (req, res) => {

  try {

    const {
      conversationId,
      name,
      email,
      phone,
      message,
    } = req.body;

// =====================================================
// UPLOADED FILES
// =====================================================
const uploadedFiles =
  (req.files || []).map(
    (file) => ({

      originalName:
        file.originalname,

      filename:
        file.filename,

      url:
        file.path,

      publicId:
        file.filename,  

      mimetype:
        file.mimetype,

      size:
        file.size,

    })
  );

    // =====================================================
    // VALIDATION
    // =====================================================
    if ([message, name, email, phone, conversationId].some(value => value != null && typeof value !== "string")) {
      return res.status(400).json({ success: false, error: "Format de message invalide." });
    }
    if (
  !message?.trim() &&
  uploadedFiles.length === 0
) {
  return res.status(400).json({
    success: false,
    error: "Message ou fichier requis",
  });
}


    if (String(message || "").length > 5000 || String(name || "").length > 120 || String(email || "").length > 254) {
      return res.status(400).json({ success: false, error: "Message ou coordonnées trop longs." });
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success: false, error: "Adresse e-mail invalide." });
    let conversation = null;
    let visitorToken;

    // =====================================================
    // EXISTING CONVERSATION
    // =====================================================
    if (conversationId) {

      if (!validId(conversationId)) return res.status(400).json({ success: false, error: "Conversation invalide." });
      conversation = await Conversation.findById(conversationId).select("+visitorTokenHash");
      if (!conversation || !visitorAuthorized(conversation, req.get("Authorization"))) {
        return res.status(403).json({ success: false, error: "Accès à la conversation refusé." });
      }

    }

    // =====================================================
    // CREATE NEW CONVERSATION
    // =====================================================
    if (!conversation) {

      if (!String(name || "").trim()) return res.status(400).json({ success: false, error: "Votre prénom est requis." });
      visitorToken = crypto.randomBytes(32).toString("hex");
      conversation =
        await Conversation.create({
          visitorTokenHash: tokenHash(visitorToken),

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

  text: message?.trim() || "Fichier joint",

  files: uploadedFiles,

  readByClient: true,

  readByAdmin: false,

});

    // =====================================================
    // UPDATE STATUS
    // =====================================================
    conversation.status =
      "Ouverte";

    conversation.lastMessageAt =
      new Date();

    // =====================================================
    // AUTO RETURN TO ACTIVE
    // IF CLIENT WRITES AGAIN
    // =====================================================
    conversation.archived = false;

    // =====================================================
    // SAVE
    // =====================================================
    await conversation.save();

    // =====================================================
    // EMAIL ADMIN
    // =====================================================
    if (process.env.ADMIN_EMAIL) {

      sendEmail({

        to:
          process.env.ADMIN_EMAIL,

        subject:
          "💬 Nouveau message chat MecaPrint3D",

        html: `
          <h1>Nouveau message chat</h1>

          <p>
            <strong>Nom :</strong>
            ${escapeHtml(conversation.visitorName || "-")}
          </p>

          <p>
            <strong>Email :</strong>
            ${escapeHtml(conversation.visitorEmail || "-")}
          </p>

          <p>
            <strong>Téléphone :</strong>
            ${escapeHtml(conversation.visitorPhone || "-")}
          </p>

          <p>
            <strong>Message :</strong>
          </p>

          <p>
            ${escapeHtml(message || "")}
          </p>
        `,
      }).catch(error => console.error("Notification chat non envoyée :", error.name));

    }

    // =====================================================
    // RESPONSE
    // =====================================================
    res.json({

      success: true,

      conversationId:
        conversation._id,
      ...(visitorToken ? { visitorToken } : {}),

      reply:
        "Merci 👌 Votre message a bien été transmis. Nous vous répondrons rapidement.",

      conversation: publicConversation(conversation),

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
  upload.array("files"),
  async (req, res) => {

    try {

      const { message } = req.body;
const uploadedFiles =
  (req.files || []).map((file) => ({
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    mimetype: file.mimetype,
    size: file.size,
  }));
      // =====================================================
      // VALIDATION
      // =====================================================
      if (
  !message?.trim() &&
  uploadedFiles.length === 0
) {
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
  text: message?.trim() || "Fichier joint",
  files: uploadedFiles,
  readByAdmin: true,
  readByClient: false,
});

      // =====================================================
      // UPDATE STATUS
      // =====================================================
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
router.get("/:id", visitorReadLimit, async (req, res) => {

  try {

    if (!validId(req.params.id)) return res.status(400).json({ success: false, error: "Conversation invalide." });
    const conversation = await Conversation.findById(req.params.id).select("+visitorTokenHash");

    if (!conversation) {

      return res.status(404).json({

        success: false,

        error:
          "Conversation introuvable",

      });

    }

    if (!visitorAuthorized(conversation, req.get("Authorization"))) return res.status(403).json({ success: false, error: "Accès à la conversation refusé." });
    res.json({ success: true, conversation: publicConversation(conversation) });

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