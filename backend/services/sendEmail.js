

async function sendEmail({ to, subject, html }) {
  console.log("📧 Tentative email vers :", to);

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: process.env.SENDER_NAME || "MecaPrint3D",
        email: process.env.SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  const data = await response.json();

  console.log("📧 Réponse Brevo :", response.status, data);

  if (!response.ok) {
    throw new Error(data.message || "Erreur envoi email Brevo");
  }

  return data;
}

module.exports = sendEmail;
