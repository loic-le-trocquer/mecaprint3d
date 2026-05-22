const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// =====================================================
// PDF DEVIS PREMIUM — MECAPRINT3D
// Compatible backend Node.js / PDFKit
// =====================================================

const BRAND = {
  navy: "#0f172a",
  orange: "#f97316",
  slate: "#64748b",
  text: "#111827",
  border: "#e5e7eb",
  card: "#f8fafc",
  white: "#ffffff",
};

const COMPANY = {
  name: "MECAPRINT3D",
  legal: "Entrepreneur individuel",
  siret: "52539319500041",
  ape: "7410Z",
  website: "mecaprint3d.fr",
  email: "contact@mecaprint3d.fr",
  tagline:
    "L’impression 3D est devenue accessible. La conception reste la clé d’une pièce performante.",
};

// ================= OUTILS =================

function euro(value) {
  const n = Number(value) || 0;
  return `${n.toFixed(2).replace(".", ",")} €`;
}

function safe(value, fallback = "—") {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

function drawRoundedCard(doc, x, y, w, h, options = {}) {
  doc
    .roundedRect(x, y, w, h, options.radius || 12)
    .fillAndStroke(options.fill || BRAND.white, options.stroke || BRAND.border);
}

function title(doc, text, x, y, w, color = BRAND.orange) {
  doc
    .fillColor(color)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(String(text).toUpperCase(), x, y, {
      width: w,
      characterSpacing: 0.4,
    });
}

function small(doc, text, x, y, options = {}) {
  doc
    .fillColor(options.color || BRAND.slate)
    .font(options.bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(options.size || 9)
    .text(safe(text), x, y, {
      width: options.width || 180,
      align: options.align || "left",
      lineGap: options.lineGap || 2,
    });
}

function labelValue(doc, label, value, x, y, w = 220) {
  doc
    .fillColor(BRAND.slate)
    .font("Helvetica")
    .fontSize(8)
    .text(label, x, y, { width: w });

  doc
    .fillColor(BRAND.text)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(safe(value), x, y + 11, { width: w });
}

// ================= HEADER =================

function drawHeader(doc, data, logoPath) {
  const x = 36;
  const y = 30;
  const w = 523;
  const h = 128;

  doc
  .save()
  .roundedRect(x, y, w, h, 18)
  .fill(BRAND.navy)
  .restore();

  doc.rect(x, y + h - 8, w, 8).fill(BRAND.orange);

  console.log("LOGO PATH =", logoPath);
  if (logoPath && fs.existsSync(logoPath)) {
    doc.image(
  logoPath,
  x + 22,
  y + 22,
  {
    fit: [180, 60],
    align: "left",
    valign: "center",
  }
);

  } else {

    doc
      .fillColor(BRAND.white)
      .font("Helvetica-Bold")
      .fontSize(24)
      .text("MECA", x + 22, y + 24, { continued: true })
      .fillColor(BRAND.orange)
      .text("PRINT", { continued: true })
      .fillColor(BRAND.white)
      .text("3D");
  }

  doc
    .fillColor("#cbd5e1")
    .font("Helvetica")
    .fontSize(9)
    .text(
      "Fabrication additive • Prototypage • Réparation • Scan 3D • CAO",
      x + 24,
      y + 77,
      { width: 300 }
    );

  doc
    .fillColor(BRAND.white)
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(COMPANY.tagline, x + 24, y + 95, {
      width: 330,
      lineGap: 2,
    });

  doc.roundedRect(x + 365, y + 22, 136, 75, 14).fill("#1f2937");

  doc
    .fillColor(BRAND.orange)
    .font("Helvetica-Bold")
    .fontSize(18)
    .text("DEVIS", x + 385, y + 35, {
      width: 96,
      align: "center",
    });

  doc
    .fillColor(BRAND.white)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(safe(data.number || data.quoteId), x + 378, y + 60, {
      width: 110,
      align: "center",
    });

  doc
    .fillColor("#cbd5e1")
    .font("Helvetica")
    .fontSize(8)
    .text(`Date : ${safe(data.date)}`, x + 378, y + 78, {
      width: 110,
      align: "center",
    });
}

// ================= IDENTITÉ =================

function drawIdentityCards(doc, data, startY) {
  const leftX = 36;
  const rightX = 310;
  const cardW = 249;
  const cardH = 110;

  drawRoundedCard(doc, leftX, startY, cardW, cardH);
  title(doc, "Client", leftX + 16, startY + 15, cardW - 32);

  small(doc, data.client?.name || data.name, leftX + 16, startY + 35, {
    width: cardW - 32,
    bold: true,
    size: 11,
    color: BRAND.text,
  });

  small(doc, data.client?.email || data.email, leftX + 16, startY + 52, {
    width: cardW - 32,
  });

  small(
    doc,
    data.client?.address || data.address || data.message || "",
    leftX + 16,
    startY + 69,
    {
      width: cardW - 32,
      lineGap: 2,
    }
  );

  drawRoundedCard(doc, rightX, startY, cardW, cardH);
  title(doc, "Émetteur", rightX + 16, startY + 15, cardW - 32);

  small(doc, COMPANY.name, rightX + 16, startY + 35, {
    width: cardW - 32,
    bold: true,
    size: 11,
    color: BRAND.text,
  });

  small(
    doc,
    `${COMPANY.legal}\nSIRET : ${COMPANY.siret} — APE : ${COMPANY.ape}\n${COMPANY.email}\n${COMPANY.website}`,
    rightX + 16,
    startY + 52,
    {
      width: cardW - 32,
      lineGap: 2,
    }
  );
}

// ================= PROJET =================

function drawProjectCard(doc, data, startY) {
  const x = 36;
  const w = 523;
  const h = 115;

  drawRoundedCard(doc, x, startY, w, h, { fill: BRAND.card });
  title(doc, "Projet", x + 16, startY + 15, w - 32);

  labelValue(
    doc,
    "Prestation",
    data.project?.service || data.service || "Impression 3D sur mesure",
    x + 16,
    startY + 37,
    160
  );

  labelValue(
    doc,
    "Technologie",
    data.project?.technology || data.technology || "FDM",
    x + 190,
    startY + 37,
    110
  );

  labelValue(
    doc,
    "Matière",
    data.project?.material || data.material || "À définir",
    x + 315,
    startY + 37,
    100
  );

  labelValue(
    doc,
    "Finition",
    data.project?.finish || data.finish || "Brut technique",
    x + 425,
    startY + 37,
    100
  );

  doc
    .fillColor(BRAND.slate)
    .font("Helvetica")
    .fontSize(8)
    .text("Description client", x + 16, startY + 75, { width: w - 32 });

  doc
    .fillColor(BRAND.text)
    .font("Helvetica")
    .fontSize(9)
    .text(
      safe(data.project?.description || data.description || data.message),
      x + 16,
      startY + 88,
      {
        width: w - 32,
        height: 20,
        ellipsis: true,
      }
    );
}

// ================= TABLEAU LIGNES =================

function drawItemsTable(doc, data, startY) {
  const x = 36;
  const w = 523;

  const rows =
    Array.isArray(data.items) && data.items.length
      ? data.items
      : Array.isArray(data.quoteLines) && data.quoteLines.length
      ? data.quoteLines
      : [
          {
            label: data.project?.service || data.service || "Impression 3D sur mesure",
            details: `${safe(data.project?.material || data.material, "Matière à définir")} — ${safe(
              data.project?.finish || data.finish,
              "Finition brut"
            )}`,
            quantity: data.quantity || 1,
            unitPrice: data.amount || data.total || 0,
          },
        ];

  const rowH = 28;
  const h = 45 + rows.length * rowH;

  drawRoundedCard(doc, x, startY, w, h);
  title(doc, "Proposition commerciale", x + 16, startY + 15, w - 32);

  const headerY = startY + 35;

  doc
    .fillColor(BRAND.navy)
    .roundedRect(x + 12, headerY, w - 24, 22, 8)
    .fill();

  doc.fillColor(BRAND.white).font("Helvetica-Bold").fontSize(8);
  doc.text("Désignation", x + 22, headerY + 7, { width: 230 });
  doc.text("Qté", x + 330, headerY + 7, { width: 35, align: "center" });
  doc.text("PU HT", x + 380, headerY + 7, { width: 60, align: "right" });
  doc.text("Total", x + 465, headerY + 7, { width: 60, align: "right" });

  let currentY = headerY + 30;

  rows.forEach((item, index) => {
    const qty = Number(item.quantity || item.qty || 1);
    const unit = Number(item.unitPrice ?? item.price ?? item.amount ?? 0);
    const lineTotal = Number(item.total ?? unit * qty);

    if (index > 0) {
      doc
        .moveTo(x + 18, currentY - 5)
        .lineTo(x + w - 18, currentY - 5)
        .strokeColor(BRAND.border)
        .lineWidth(0.5)
        .stroke();
    }

    doc
      .fillColor(BRAND.text)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(safe(item.label || item.name || "Prestation"), x + 22, currentY, {
        width: 230,
      });

    doc
      .fillColor(BRAND.slate)
      .font("Helvetica")
      .fontSize(8)
      .text(safe(item.details || item.description || ""), x + 22, currentY + 12, {
        width: 250,
      });

    doc.fillColor(BRAND.text).font("Helvetica").fontSize(9);
    doc.text(String(qty), x + 330, currentY + 5, {
      width: 35,
      align: "center",
    });

    doc.text(euro(unit), x + 380, currentY + 5, {
      width: 60,
      align: "right",
    });

    doc.font("Helvetica-Bold").text(euro(lineTotal), x + 465, currentY + 5, {
      width: 60,
      align: "right",
    });

    currentY += rowH;
  });

  return startY + h + 14;
}

// ================= TOTAL + DÉLAIS =================

function drawTotals(doc, data, startY) {
  const x = 332;
  const w = 227;

  const gross = Number(data.grossAmount ?? data.subtotal ?? data.total ?? data.amount ?? 0);
  const discount = Number(data.discountAmount ?? data.discount ?? data.remise ?? 0);
  const finalTotal = Number(
    data.finalAmount ?? data.totalAfterDiscount ?? Math.max(gross - discount, 0)
  );
  const deposit = Number(data.depositAmount ?? data.deposit ?? data.acompte ?? 0);

  const h = deposit > 0 ? 122 : 96;

  drawRoundedCard(doc, x, startY, w, h, {
    fill: BRAND.navy,
    stroke: BRAND.navy,
  });

  doc.fillColor("#cbd5e1").font("Helvetica").fontSize(9).text("Montant brut", x + 16, startY + 16);
  doc.fillColor(BRAND.white).font("Helvetica-Bold").fontSize(10).text(euro(gross), x + 120, startY + 16, {
    width: 88,
    align: "right",
  });

  doc.fillColor("#cbd5e1").font("Helvetica").fontSize(9).text("Remise", x + 16, startY + 36);
  doc.fillColor(BRAND.orange).font("Helvetica-Bold").fontSize(10).text(
    discount > 0 ? `- ${euro(discount)}` : euro(0),
    x + 120,
    startY + 36,
    {
      width: 88,
      align: "right",
    }
  );

  doc
    .moveTo(x + 16, startY + 60)
    .lineTo(x + w - 16, startY + 60)
    .strokeColor("#334155")
    .lineWidth(1)
    .stroke();

  doc.fillColor(BRAND.white).font("Helvetica-Bold").fontSize(12).text("TOTAL HT", x + 16, startY + 70);
  doc.fillColor(BRAND.orange).font("Helvetica-Bold").fontSize(18).text(euro(finalTotal), x + 105, startY + 66, {
    width: 105,
    align: "right",
  });

  if (deposit > 0) {
    doc.fillColor("#cbd5e1").font("Helvetica").fontSize(8).text("Acompte demandé", x + 16, startY + 101);
    doc.fillColor(BRAND.white).font("Helvetica-Bold").fontSize(9).text(euro(deposit), x + 120, startY + 101, {
      width: 88,
      align: "right",
    });
  }

  const leftX = 36;

  drawRoundedCard(doc, leftX, startY, 274, h, { fill: BRAND.card });
  title(doc, "Délai & prestations incluses", leftX + 16, startY + 15, 240);

  small(doc, `Délai estimé : ${safe(data.delay || data.delai || "À confirmer après validation technique")}`, leftX + 16, startY + 37, {
    width: 240,
    bold: true,
    color: BRAND.text,
  });

  small(
    doc,
    "• Analyse technique du besoin\n• Préparation fabrication\n• Contrôle visuel avant expédition\n• Conseils matière / finition",
    leftX + 16,
    startY + 58,
    {
      width: 240,
      lineGap: 3,
    }
  );

  return startY + h + 18;
}

// ================= SIGNATURE =================

function drawSignature(doc, startY) {
  const signaturePath = path.join(__dirname, "..", "assets", "signature.jpg");
  const exists = fs.existsSync(signaturePath);

console.log("SIGNATURE PATH =", signaturePath);
console.log("SIGNATURE EXISTS =", exists);

  const x = 360;
  const y = startY;

  drawRoundedCard(doc, x, y, 199, 95, {
    fill: BRAND.white,
  });

  title(doc, "Validation", x + 16, y + 14, 160);

  small(doc, "Signature MecaPrint3D", x + 16, y + 36, {
    bold: true,
    color: BRAND.text,
  });

  if (exists) {
    doc.image(signaturePath, x + 20, y + 48, {
      width: 120,
    });
  }

  small(doc, "Loïc Le Trocquer", x + 16, y + 76, {
    color: BRAND.slate,
  });
}

// ================= FICHIERS + FOOTER =================

function drawFilesAndFooter(doc, data, startY) {
  const x = 36;
  const w = 523;

  const files = Array.isArray(data.files) ? data.files : [];

  drawRoundedCard(doc, x, startY, w, 58, {
    fill: BRAND.white,
  });

  title(doc, "Fichiers transmis", x + 16, startY + 14, w - 32);

  const fileText = files.length
    ? files.map((f) => `• ${safe(f.name || f.originalname || f.filename)}`).join("\n")
    : "Aucun fichier transmis.";

  small(doc, fileText, x + 16, startY + 34, {
    width: w - 32,
    color: BRAND.text,
  });

  const footerY = 754;
// ================= FOOTER PREMIUM =================

doc
  .moveTo(36, footerY - 18)
  .lineTo(559, footerY - 18)
  .strokeColor(BRAND.orange)
  .lineWidth(1.2)
  .stroke();

doc
  .fillColor(BRAND.slate)
  .font("Helvetica")
  .fontSize(7)
  .text(
    "Ce devis est établi sous réserve de validation technique définitive après analyse complète des fichiers transmis.",
    36,
    footerY,
    {
      width: 523,
      align: "center",
    }
  );

doc
  .text(
    "Validité : 30 jours — Production après accord client",
    36,
    footerY + 10,
    {
      width: 523,
      align: "center",
    }
  );

doc
  .fillColor(BRAND.text)
  .font("Helvetica-Bold")
  .fontSize(7.5)
  .text(
    `${COMPANY.name} — SIRET ${COMPANY.siret} — APE ${COMPANY.ape} — ${COMPANY.website}`,
    36,
    footerY + 24,
    {
      width: 523,
      align: "center",
    }
  );
}

// ================= GÉNÉRATION PDF =================

function generateQuotePdf(data, filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 36,
    });

    const stream = fs.createWriteStream(filePath);

    stream.on("finish", resolve);
    stream.on("error", reject);
    doc.on("error", reject);

    doc.pipe(stream);

    // Chemins des images côté backend
    const logoPath =
      options.logoPath || path.join(__dirname, "..", "assets", "logo.jpg");

    const date = data.date || new Date().toLocaleDateString("fr-FR");

    const pdfData = {
      ...data,
      date,
    };

    // Construction du devis
    drawHeader(doc, pdfData, logoPath);
    drawIdentityCards(doc, pdfData, 178);
    drawProjectCard(doc, pdfData, 306);

    let y = drawItemsTable(doc, pdfData, 438);
    y = drawTotals(doc, pdfData, y);

    drawSignature(doc, y);
    drawFilesAndFooter(doc, pdfData, y + 110);

    doc.end();
  });
}

module.exports = generateQuotePdf;