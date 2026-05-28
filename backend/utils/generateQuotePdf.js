const PDFDocument = require("pdfkit");

// =====================================================
// FORMAT €
// =====================================================
function formatEuro(value) {
  return `${Number(value || 0).toFixed(2)} €`;
}

// =====================================================
// DATE FR
// =====================================================
function formatDate(date = new Date()) {
  return new Date(date).toLocaleDateString("fr-FR");
}

// =====================================================
// GENERATE QUOTE PDF
// =====================================================
module.exports = function generateQuotePdf(res, quote) {
  const doc = new PDFDocument({
    margin: 42,
    size: "A4",
  });

  const pageWidth = doc.page.width;
  const contentWidth = pageWidth - 84;

  const quoteNumber = `DEVIS-${new Date().getFullYear()}-${String(
    quote._id
  ).slice(-6).toUpperCase()}`;

  const lines = quote.quoteLines || [];

  const totalTTC =
    quote.quoteAmount ||
    lines.reduce(
      (sum, line) =>
        sum +
        (Number(line.quantity) || 0) *
          (Number(line.unitPrice) || 0),
      0
    );

  // ================= HEADERS =================
  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${quoteNumber}.pdf`
  );

  doc.pipe(res);

  // =====================================================
  // HEADER SIMPLE / ECONOMIQUE
  // =====================================================
  doc
    .fontSize(24)
    .fillColor("#111111")
    .text("MecaPrint3D", 42, 42);

  doc
    .fontSize(9)
    .fillColor("#555555")
    .text("Fabrication additive • Pièces techniques • Covering • Sur-mesure", 42, 70);

  doc
    .moveTo(42, 92)
    .lineTo(pageWidth - 42, 92)
    .strokeColor("#f97316")
    .lineWidth(1.2)
    .stroke();

  // =====================================================
  // TITRE + INFOS DEVIS
  // =====================================================
  doc
    .fontSize(20)
    .fillColor("#111111")
    .text("DEVIS", 42, 120);

  doc
    .fontSize(10)
    .fillColor("#444444")
    .text(`N° : ${quoteNumber}`, 360, 120, {
      width: 190,
      align: "right",
    });

  doc.text(`Date : ${formatDate(quote.createdAt || new Date())}`, 360, 138, {
    width: 190,
    align: "right",
  });

  // =====================================================
  // BLOCS ENTREPRISE / CLIENT
  // =====================================================
  const blockY = 170;

  doc
    .fontSize(9)
    .fillColor("#f97316")
    .text("ÉMETTEUR", 42, blockY);

  doc
    .fontSize(10)
    .fillColor("#111111")
    .text("MecaPrint3D", 42, blockY + 18)
    .fillColor("#555555")
    .text("www.mecaprint3d.fr", 42, blockY + 34)
    .text("Contact : via le formulaire du site", 42, blockY + 50);

  doc
    .fontSize(9)
    .fillColor("#f97316")
    .text("CLIENT", 315, blockY);

  doc
    .fontSize(10)
    .fillColor("#111111")
    .text(quote.name || "Client non renseigné", 315, blockY + 18)
    .fillColor("#555555")
    .text(quote.email || "-", 315, blockY + 34)
    .text(quote.phone || "-", 315, blockY + 50);

  // =====================================================
  // PROJET
  // =====================================================
  const projectY = 250;

  doc
    .roundedRect(42, projectY, contentWidth, 54, 6)
    .strokeColor("#dddddd")
    .lineWidth(1)
    .stroke();

  doc
    .fontSize(9)
    .fillColor("#f97316")
    .text("PROJET", 56, projectY + 12);

  doc
    .fontSize(11)
    .fillColor("#111111")
    .text(quote.project || "-", 56, projectY + 28, {
      width: contentWidth - 28,
    });

  // =====================================================
  // TABLEAU
  // =====================================================
  let y = 335;

  doc
    .fontSize(10)
    .fillColor("#111111")
    .text("Désignation", 42, y);

  doc.text("Qté", 315, y, {
    width: 40,
    align: "right",
  });

  doc.text("PU", 375, y, {
    width: 70,
    align: "right",
  });

  doc.text("Total", 475, y, {
    width: 75,
    align: "right",
  });

  y += 18;

  doc
    .moveTo(42, y)
    .lineTo(pageWidth - 42, y)
    .strokeColor("#f97316")
    .lineWidth(1)
    .stroke();

  y += 14;

  if (!lines.length) {
    doc
      .fontSize(10)
      .fillColor("#777777")
      .text("Aucune ligne de devis renseignée.", 42, y);

    y += 30;
  }

  lines.forEach((line) => {
    const quantity = Number(line.quantity) || 0;
    const unitPrice = Number(line.unitPrice) || 0;
    const lineTotal = quantity * unitPrice;

    const labelHeight = doc.heightOfString(line.label || "-", {
      width: 250,
    });

    doc
      .fontSize(10)
      .fillColor("#111111")
      .text(line.label || "-", 42, y, {
        width: 250,
      });

    doc.text(String(quantity), 315, y, {
      width: 40,
      align: "right",
    });

    doc.text(formatEuro(unitPrice), 375, y, {
      width: 70,
      align: "right",
    });

    doc.text(formatEuro(lineTotal), 475, y, {
      width: 75,
      align: "right",
    });

    y += Math.max(labelHeight, 16) + 12;

    doc
      .moveTo(42, y)
      .lineTo(pageWidth - 42, y)
      .strokeColor("#eeeeee")
      .lineWidth(1)
      .stroke();

    y += 10;
  });

  // =====================================================
  // TOTAL
  // =====================================================
  y += 10;

  doc
    .fontSize(11)
    .fillColor("#111111")
    .text("Total TTC", 375, y, {
      width: 85,
      align: "right",
    });

  doc
    .fontSize(18)
    .fillColor("#f97316")
    .text(formatEuro(totalTTC), 465, y - 4, {
      width: 85,
      align: "right",
    });

  y += 42;

  // =====================================================
  // DELAI / COMMENTAIRE
  // =====================================================
  if (quote.quoteDelay || quote.quoteComment) {
    doc
      .roundedRect(42, y, contentWidth, 82, 6)
      .strokeColor("#dddddd")
      .lineWidth(1)
      .stroke();

    doc
      .fontSize(9)
      .fillColor("#f97316")
      .text("INFORMATIONS COMPLÉMENTAIRES", 56, y + 12);

    if (quote.quoteDelay) {
      doc
        .fontSize(10)
        .fillColor("#111111")
        .text(`Délai estimé : ${quote.quoteDelay}`, 56, y + 32);
    }

    if (quote.quoteComment) {
      doc
        .fontSize(10)
        .fillColor("#555555")
        .text(quote.quoteComment, 56, y + 50, {
          width: contentWidth - 28,
        });
    }

    y += 100;
  }

  // =====================================================
  // CONDITIONS
  // =====================================================
  doc
    .fontSize(9)
    .fillColor("#555555")
    .text(
      "TVA non applicable — art. 293 B du CGI. Devis valable 30 jours sauf indication contraire. Les délais sont donnés à titre indicatif et peuvent varier selon validation client, disponibilité matière et complexité technique.",
      42,
      y,
      {
        width: contentWidth,
        align: "left",
      }
    );
// =====================================================
// CONDITIONS GÉNÉRALES DE VENTE
// =====================================================
y += 25;

doc
  .fontSize(9)
  .fillColor("#111111")
  .text("Conditions générales de vente", 42, y);

y += 18;

doc
  .fontSize(8)
  .fillColor("#555555")
  .text(
    "La validation du devis vaut acceptation des conditions générales de vente. Toute commande est lancée après validation écrite du client et, le cas échéant, règlement de l’acompte ou du paiement demandé. Les délais sont indicatifs et peuvent varier selon la complexité technique, la disponibilité des matériaux et la charge atelier. Les pièces sur mesure ne sont ni reprises ni échangées après validation client, sauf défaut avéré.",
    42,
    y,
    {
      width: contentWidth,
      align: "left",
    }
  );

y += 55;

// =====================================================
// LIEN DE COMMANDE STRIPE
// =====================================================
const orderUrl = `https://mecaprint3d.fr/commande/${quote._id}`;

doc
  .fontSize(9)
  .fillColor("#f97316")
  .text("Passer commande / régler en ligne :", 42, y);

y += 15;

doc
  .fontSize(9)
  .fillColor("#111111")
  .text(orderUrl, 42, y, {
    link: orderUrl,
    underline: true,
  });

y += 35;

  // =====================================================
  // SIGNATURE
  // =====================================================
  y += 55;

  doc
    .fontSize(10)
    .fillColor("#111111")
    .text("Bon pour accord :", 42, y);

  doc
    .roundedRect(42, y + 20, 220, 70, 6)
    .strokeColor("#dddddd")
    .stroke();

  doc
    .fontSize(8)
    .fillColor("#777777")
    .text("Date, signature et mention « Bon pour accord »", 52, y + 78);

  // =====================================================
  // FOOTER
  // =====================================================
  doc
    .fontSize(8)
    .fillColor("#777777")
    .text(
      "MecaPrint3D — Fabrication additive, conception, rénovation et covering sur mesure — www.mecaprint3d.fr",
      42,
      805,
      {
        width: contentWidth,
        align: "center",
      }
    );

  doc.end();
};