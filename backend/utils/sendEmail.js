// ================= FONCTION PRINCIPALE =================
const sendEmail = async ({
  to,
  subject,
  text = "",
  html,
  attachments = [],
}) => {
  try {

    // ================= SENDER =================
    const senderEmail =
      process.env.BREVO_SENDER_EMAIL ||
      process.env.SENDER_EMAIL ||
      process.env.EMAIL_USER;

    if (!senderEmail) {
      throw new Error(
        "BREVO_SENDER_EMAIL ou EMAIL_USER manquant dans Render"
      );
    }

    console.log("📨 Envoi email Brevo API à:", to);
    console.log("📧 Sender utilisé :", senderEmail);

    // ================= HTML =================
    const finalHtml =
      html ||
      generateEmailTemplate({
        title: subject,
        content: `<p>${String(text).replace(/\n/g, "<br/>")}</p>`,
      });

    // ================= TEXTE =================
    const finalText =
      text && String(text).trim()
        ? String(text)
        : subject || "Message MecaPrint3D";

    // ================= BREVO API =================
    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",

        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },

        body: JSON.stringify({
          sender: {
            name: "MecaPrint3D",
            email: senderEmail,
          },

          to: [{ email: to }],

          subject,

          htmlContent: finalHtml,

          textContent: finalText,

          attachment: attachments.map((file) => ({
            name: file.filename || file.name,
            content: fs
              .readFileSync(file.path)
              .toString("base64"),
          })),
        }),
      }
    );

    // ================= RESPONSE =================
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ ERREUR BREVO:", data);
      throw new Error(data.message || "Erreur Brevo");
    }

    console.log("✅ Email Brevo envoyé:", data.messageId);

    return data;

  } catch (error) {

    console.error("❌ ERREUR EMAIL BREVO:", error);

    throw error;
  }
};