
// ================= TEMPLATE HTML PREMIUM =================
const fs = require("fs");

const generateEmailTemplate = ({ title, content, orderId }) => {
  return `
  <div style="margin:0;padding:0;background:#f6f7f9;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="background:#0f172a;padding:25px 30px;color:white;">
                <h2 style="margin:0;color:#f97316;">MecaPrint3D</h2>
                <p style="margin:5px 0 0;font-size:13px;color:#94a3b8;">
                  Impression 3D sur mesure
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:30px;">
                <h2 style="margin:0 0 10px;">${title}</h2>

                ${
                  orderId
                    ? `<p style="color:#64748b;font-size:14px;">
                        Référence : <strong>${orderId}</strong>
                       </p>`
                    : ""
                }

                <div style="color:#475569;margin-top:15px;line-height:1.6;">
                  ${content}
                </div>

                <p style="margin-top:25px;">
                  <strong>MecaPrint3D</strong><br/>
                  <span style="font-size:12px;color:#64748b;">
                    Impression 3D professionnelle
                  </span>
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#f8fafc;text-align:center;padding:15px;font-size:12px;color:#64748b;">
                ${process.env.EMAIL_USER}<br/>
                © MecaPrint3D
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
};

// ================= FONCTION PRINCIPALE =================
const sendEmail = async ({ to, subject, text = "", html, attachments = [] }) => {
  try {
    console.log("📨 Envoi email Brevo API à:", to);

    const finalHtml = html || generateEmailTemplate({
      title: subject,
      content: `<p>${String(text).replace(/\n/g, "<br/>")}</p>`
    });

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "MecaPrint3D",
          email: process.env.EMAIL_USER
        },
        to: [
          { email: to }
        ],
        subject,
        htmlContent: finalHtml,
        textContent: text,
        attachment: attachments.map((file) => ({
          name: file.filename || file.name,
          content: fs.readFileSync(file.path).toString("base64")
        }))
      })
    });

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

module.exports = sendEmail;