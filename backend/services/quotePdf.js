const PDFDocument = require("pdfkit");

function generateQuotePdf(res, quote) {
  const doc = new PDFDocument({ size: "A4", margin: 0 });

  const quoteNumber = `DEV-${new Date().getFullYear()}-${String(quote._id)
    .slice(-6)
    .toUpperCase()}`;

  const quoteDate = new Date().toLocaleDateString("fr-FR");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${quoteNumber}.pdf`);

  doc.pipe(res);

  const orange = "#f97316";
  const dark = "#18181b";
  const black = "#09090b";
  const grey = "#71717a";
  const lightGrey = "#f4f4f5";

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const margin = 42;

  const box = (x, y, w, h, color = "#ffffff") => {
    doc.roundedRect(x, y, w, h, 12).fillColor(color).fill();
  };

  const sectionTitle = (title, y) => {
    doc.fontSize(13).fillColor(orange).text(title.toUpperCase(), margin, y);
    doc.moveTo(margin, y + 20).lineTo(pageWidth - margin, y + 20).strokeColor("#e5e7eb").stroke();
  };

  const lines = quote.quoteLines?.length
    ? quote.quoteLines
    : [{ label: quote.project || "Prestation", quantity: 1, unitPrice: Number(quote.quoteAmount || 0) }];

  const subtotal = lines.reduce(
    (sum, line) => sum + (Number(line.quantity) || 0) * (Number(line.unitPrice) || 0),
    0
  );

  doc.rect(0, 0, pageWidth, pageHeight).fillColor(lightGrey).fill();

  doc.rect(0, 0, pageWidth, 145).fillColor(dark).fill();
  doc.rect(0, 0, 12, 145).fillColor(orange).fill();

  doc.fontSize(28).fillColor("#ffffff").text("MECAPRINT3D", margin, 34);
  doc.fontSize(10).fillColor("#d4d4d8").text("Fabrication additive • Prototypage • Réparation • Conception", margin, 70);

  doc.fontSize(24).fillColor(orange).text("DEVIS", pageWidth - 190, 34, { width: 145, align: "right" });
  doc.fontSize(10).fillColor("#d4d4d8").text(quoteNumber, pageWidth - 190, 68, { width: 145, align: "right" });
  doc.text(`Date : ${quoteDate}`, pageWidth - 190, 86, { width: 145, align: "right" });

  box(margin, 175, 245, 118);
  box(pageWidth - margin - 245, 175, 245, 118);

  doc.fontSize(11).fillColor(orange).text("ÉMETTEUR", margin + 18, 193);
  doc.fontSize(10).fillColor("#111827")
    .text("MECAPRINT3D", margin + 18, 216)
    .text("Entrepreneur individuel", margin + 18, 232)
    .text("SIRET : 52539319500041", margin + 18, 248)
    .text("APE : 7410Z", margin + 18, 264)
    .text("mecaprint3d.fr", margin + 18, 280);

  doc.fontSize(11).fillColor(orange).text("CLIENT", pageWidth - margin - 227, 193);
  doc.fontSize(10).fillColor("#111827")
    .text(quote.name || "-", pageWidth - margin - 227, 216)
    .text(quote.email || "-", pageWidth - margin - 227, 232)
    .text(quote.phone || "-", pageWidth - margin - 227, 248);

  sectionTitle("Projet", 325);
  box(margin, 360, pageWidth - margin * 2, 105);

  doc.fontSize(10).fillColor(grey).text("Projet", margin + 18, 382);
  doc.fontSize(12).fillColor("#111827").text(quote.project || "-", margin + 18, 400);

  doc.fontSize(10).fillColor(grey).text("Quantité", margin + 260, 382);
  doc.fontSize(12).fillColor("#111827").text(String(quote.quantity || "-"), margin + 260, 400);

  doc.fontSize(10).fillColor(grey).text("Matière", margin + 390, 382);
  doc.fontSize(12).fillColor("#111827").text(quote.material || "À définir", margin + 390, 400);

  if (quote.message) {
    doc.fontSize(10).fillColor(grey).text("Message client", margin + 18, 430);
    doc.fontSize(10).fillColor("#111827").text(quote.message, margin + 115, 430, {
      width: pageWidth - margin * 2 - 135,
    });
  }

  sectionTitle("Détail du devis", 500);
  box(margin, 535, pageWidth - margin * 2, 165);

  doc.fontSize(9).fillColor(grey)
    .text("Désignation", margin + 18, 555)
    .text("Qté", margin + 310, 555)
    .text("PU", margin + 365, 555)
    .text("Total", margin + 445, 555);

  doc.moveTo(margin + 18, 572).lineTo(pageWidth - margin - 18, 572).strokeColor("#e5e7eb").stroke();

  let y = 585;

  lines.slice(0, 5).forEach((line) => {
    const qty = Number(line.quantity) || 0;
    const unitPrice = Number(line.unitPrice) || 0;
    const total = qty * unitPrice;

    doc.fontSize(10).fillColor("#111827")
      .text(line.label || "Prestation", margin + 18, y, { width: 270 })
      .text(String(qty), margin + 310, y)
      .text(`${unitPrice.toFixed(2)} €`, margin + 365, y)
      .text(`${total.toFixed(2)} €`, margin + 445, y);

    y += 20;
  });

  doc.moveTo(margin + 300, 650).lineTo(pageWidth - margin - 18, 650).strokeColor("#e5e7eb").stroke();

  doc.fontSize(10).fillColor(grey).text("Sous-total", margin + 330, 662);
  doc.fontSize(10).fillColor("#111827").text(`${subtotal.toFixed(2)} €`, margin + 445, 662);

  doc.fontSize(10).fillColor(grey).text("TVA", margin + 330, 680);
  doc.fontSize(10).fillColor("#111827").text("Non applicable", margin + 445, 680);

  doc.fontSize(13).fillColor(orange).text("Total TTC", margin + 330, 700);
  doc.fontSize(16).fillColor(orange).text(`${subtotal.toFixed(2)} €`, margin + 445, 697);

  doc.fontSize(8).fillColor(grey).text("TVA non applicable — art. 293 B du CGI", margin + 330, 720);

  if (quote.quoteDelay) {
    doc.fontSize(10).fillColor(grey).text("Délai estimé :", margin + 18, 662);
    doc.fontSize(10).fillColor("#111827").text(quote.quoteDelay, margin + 95, 662);
  }

  if (quote.quoteComment) {
    doc.fontSize(9).fillColor(grey).text("Commentaire :", margin + 18, 690);
    doc.fontSize(9).fillColor("#111827").text(quote.quoteComment, margin + 18, 705, { width: 260 });
  }

  doc.rect(0, pageHeight - 70, pageWidth, 70).fillColor(black).fill();

  doc.fontSize(8).fillColor("#d4d4d8").text(
    "Ce devis est établi sous réserve de validation technique définitive après analyse complète des fichiers transmis.",
    margin,
    pageHeight - 52,
    { width: pageWidth - margin * 2 }
  );

  doc.fontSize(8).fillColor("#a1a1aa").text(
    "MECAPRINT3D — SIRET 52539319500041 — APE 7410Z — mecaprint3d.fr",
    margin,
    pageHeight - 28,
    { width: pageWidth - margin * 2, align: "center" }
  );

  doc.end();
}

module.exports = generateQuotePdf;