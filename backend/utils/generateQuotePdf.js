const PDFDocument = require("pdfkit");

module.exports = function generateQuotePdf(res, quote) {
  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
  });

  // ================= HEADERS =================
  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=devis-${quote._id}.pdf`
  );

  doc.pipe(res);

  // =====================================================
  // HEADER
  // =====================================================
  doc
    .fontSize(28)
    .fillColor("#f97316")
    .text("MecaPrint3D", {
      align: "left",
    });

  doc
    .moveDown(0.2)
    .fontSize(12)
    .fillColor("#666")
    .text("Fabrication additive & pièces techniques");

  doc.moveDown(2);

  // =====================================================
  // CLIENT
  // =====================================================
  doc
    .fontSize(22)
    .fillColor("#111")
    .text("DEVIS COMMERCIAL");

  doc.moveDown();

  doc
    .fontSize(12)
    .fillColor("#000")
    .text(`Client : ${quote.name}`);

  doc.text(`Email : ${quote.email || "-"}`);

  doc.text(`Téléphone : ${quote.phone || "-"}`);

  doc.text(`Projet : ${quote.project || "-"}`);

  doc.moveDown(2);

  // =====================================================
  // TABLE HEADER
  // =====================================================
  const tableTop = doc.y;

  doc
    .rect(40, tableTop, 515, 30)
    .fill("#f97316");

  doc
    .fillColor("#fff")
    .fontSize(11)
    .text("Désignation", 50, tableTop + 10);

  doc.text("Qté", 300, tableTop + 10);

  doc.text("PU", 360, tableTop + 10);

  doc.text("Total", 470, tableTop + 10);

  let y = tableTop + 40;

  // =====================================================
  // LINES
  // =====================================================
  const lines = quote.quoteLines || [];

  lines.forEach((line) => {
    doc
      .fillColor("#000")
      .fontSize(11)
      .text(line.label || "-", 50, y, {
        width: 220,
      });

    doc.text(
      String(line.quantity || 1),
      300,
      y
    );

    doc.text(
      `${Number(line.unitPrice || 0).toFixed(2)} €`,
      360,
      y
    );

    doc.text(
      `${Number(line.total || 0).toFixed(2)} €`,
      470,
      y
    );

    y += 30;

    doc
      .moveTo(40, y - 5)
      .lineTo(555, y - 5)
      .strokeColor("#e5e5e5")
      .stroke();
  });

  // =====================================================
  // TOTAL
  // =====================================================
  doc.moveDown(3);

  doc
    .fontSize(20)
    .fillColor("#f97316")
    .text(
      `Total TTC : ${Number(
        quote.quoteAmount || 0
      ).toFixed(2)} €`,
      {
        align: "right",
      }
    );

  doc.moveDown();

  // =====================================================
  // DELAY
  // =====================================================
  if (quote.quoteDelay) {
    doc
      .fontSize(12)
      .fillColor("#000")
      .text(`Délai estimé : ${quote.quoteDelay}`);
  }

  // =====================================================
  // COMMENT
  // =====================================================
  if (quote.quoteComment) {
    doc.moveDown();

    doc
      .fontSize(12)
      .fillColor("#444")
      .text(quote.quoteComment);
  }

  // =====================================================
  // FOOTER
  // =====================================================
  doc.moveDown(4);

  doc
    .fontSize(10)
    .fillColor("#777")
    .text(
      "TVA non applicable — art. 293 B du CGI",
      {
        align: "center",
      }
    );

  doc.moveDown();

  doc.text(
    "MecaPrint3D — www.mecaprint3d.fr",
    {
      align: "center",
    }
  );

  doc.end();
};