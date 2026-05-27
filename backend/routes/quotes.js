// =====================================================
// ✏️ MISE À JOUR D’UN DEVIS
// PUT /api/quotes/:id
// =====================================================
router.put("/:id", requireAdmin, async (req, res) => {

  try {

    // ================= FIND =================
    const existingQuote =
      await Quote.findById(req.params.id);

    if (!existingQuote) {

      return res.status(404).json({
        success: false,
        error: "Devis introuvable",
      });

    }

    // ================= OLD STATUS =================
    const oldStatus =
      existingQuote.status;

    // ================= UPDATE =================
    existingQuote.status =
      req.body.status;

    existingQuote.adminNotes =
      req.body.adminNotes;

    existingQuote.archived =
      req.body.archived;

    existingQuote.quoteLines =
      req.body.quoteLines;

    existingQuote.quoteAmount =
      req.body.quoteAmount;

    existingQuote.quoteDelay =
      req.body.quoteDelay;

    existingQuote.quoteComment =
      req.body.quoteComment;

    await existingQuote.save();

    // =====================================================
    // 📧 EMAIL STATUS UPDATE
    // =====================================================
    if (
      req.body.status &&
      req.body.status !== oldStatus
    ) {

      const statusLabels = {

        nouveau:
          "Nouveau devis reçu",

        en_cours:
          "Projet en cours d’étude",

        valide:
          "Devis validé",

        termine:
          "Projet terminé",

        archive:
          "Projet archivé",

      };

      const statusMessages = {

        nouveau:
          "Votre demande a bien été enregistrée.",

        en_cours:
          "Votre projet est actuellement en cours d’étude par notre atelier.",

        valide:
          "Votre devis a été validé. Nous revenons rapidement vers vous pour la suite du projet.",

        termine:
          "Votre projet est terminé.",

        archive:
          "Votre demande a été archivée.",

      };

      // ================= EMAIL =================
      await sendEmail({

        to: existingQuote.email,

        subject: `Mise à jour de votre projet - ${statusLabels[existingQuote.status]}`,

        html: `
          <div style="font-family:Arial,sans-serif;background:#f4f4f5;padding:40px;">

            <div style="max-width:620px;margin:auto;background:#18181b;border-radius:24px;overflow:hidden;border:1px solid #27272a;">

              <div style="padding:40px;background:linear-gradient(135deg,#f97316,#ea580c);">

                <img
                  src="https://mecaprint3d.fr/logo-mail.jpg"
                  width="280"
                  alt="MecaPrint3D"
                />

              </div>

              <div style="padding:40px;color:#e4e4e7;">

                <h1 style="margin-top:0;color:white;">
                  Bonjour ${existingQuote.name},
                </h1>

                <p style="font-size:16px;line-height:1.7;color:#d4d4d8;">
                  ${statusMessages[existingQuote.status]}
                </p>

                <div style="margin-top:30px;padding:24px;background:#09090b;border-radius:18px;border:1px solid #27272a;">

                  <p>
                    <strong>Projet :</strong>
                    ${existingQuote.project}
                  </p>

                  <p>
                    <strong>Statut :</strong>
                    ${statusLabels[existingQuote.status]}
                  </p>

                </div>

                <div style="margin-top:35px;text-align:center;">

                  <a
                    href="https://mecaprint3d.fr"
                    style="
                      display:inline-block;
                      background:#f97316;
                      color:white;
                      text-decoration:none;
                      padding:16px 28px;
                      border-radius:14px;
                      font-weight:800;
                    "
                  >
                    Accéder au site
                  </a>

                </div>

              </div>

            </div>

          </div>
        `,

      });

    }

    // ================= RESPONSE =================
    res.json({
      success: true,
      quote: existingQuote,
    });

  } catch (error) {

    console.error(
      "❌ Erreur mise à jour devis :",
      error
    );

    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });

  }

});