// backend/routes/stripe.js

const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Quote = require("../models/Quote");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// =====================================================
// 🔔 STRIPE WEBHOOK
// POST /api/stripe/webhook
// =====================================================
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error("❌ Webhook Stripe invalide :", error.message);

      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
      // =====================================================
      // ✅ PAIEMENT VALIDÉ
      // =====================================================
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const quoteId = session.metadata?.quoteId;

        if (!quoteId) {
          console.warn("⚠️ Webhook sans quoteId");
          return res.json({ received: true });
        }

        const quote = await Quote.findById(quoteId);

        if (!quote) {
          console.warn("⚠️ Devis introuvable :", quoteId);
          return res.json({ received: true });
        }

        quote.paymentStatus = "Payé";
        quote.status = "En fabrication";
        quote.paidAt = new Date();
        quote.stripeSessionId = session.id;

        await quote.save();

        // =====================================================
        // 📧 EMAIL CLIENT
        // =====================================================
        await sendEmail({
          to: quote.email,
          subject: `Paiement reçu - ${quote.quoteNumber || "Devis MecaPrint3D"}`,
          html: `
            <h1>Paiement reçu</h1>

            <p>Bonjour ${quote.name || ""},</p>

            <p>
              Nous confirmons la réception du paiement pour votre devis
              <strong>${quote.quoteNumber || ""}</strong>.
            </p>

            <p>
              Votre projet passe maintenant en fabrication.
            </p>

            <p>
              Merci pour votre confiance.<br/>
              L'équipe MecaPrint3D
            </p>
          `,
        });

        console.log(
          `✅ Paiement validé pour ${quote.quoteNumber || quote._id}`
        );
      }

      res.json({ received: true });
    } catch (error) {
      console.error("❌ Erreur traitement webhook Stripe :", error);

      res.status(500).json({
        success: false,
        error: "Erreur webhook Stripe",
      });
    }
  }
);

module.exports = router;