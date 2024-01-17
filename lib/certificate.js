const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs").promises;

const generatePDF = async () => {
  const pdfDoc = await PDFDocument.create();
  const names = ["John Doe", "Jane Doe", "John Smith"];
  for (const name of names) {
    const page = pdfDoc.addPage();
    const PAGE_WIDTH = 792;
    const PAGE_HEIGHT = 612;
    page.setSize(PAGE_WIDTH, PAGE_HEIGHT);

    // set background image
    page.drawImage(await pdfDoc.embedPng(await fs.readFile("template.png")), {
      x: 0,
      y: 0,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    });

    page.drawText(name, {
      x: 350,
      y: PAGE_HEIGHT - 230,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
      size: 22,
    });

    page.drawText("Best in Mathematics", {
      x: 300,
      y: PAGE_HEIGHT - 330,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
      size: 22,
    });
  }
  const pdfBytes = await pdfDoc.save();
  await fs.writeFile("output.pdf", pdfBytes);
};

generatePDF();
