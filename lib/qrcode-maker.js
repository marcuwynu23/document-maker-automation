const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs").promises;
const QRCode = require("qrcode");

const generateQRCode = async (name) => {
  const qrData = `Name: ${name}`;
  const qrCodeDataURL = await QRCode.toDataURL(qrData, {
    errorCorrectionLevel: "H",
    type: "image/png",
    quality: 4,
    margin: 0.5,
  });
  await fs.writeFile(
    `output/qrcodes/${name}.png`,
    qrCodeDataURL.replace(/^data:image\/png;base64,/, ""),
    "base64"
  );
};

const readDatabase = async function (fileName) {
  try {
    const database = await fs.readFile(fileName, "utf8");
    return database.trim().split("\n");
  } catch (error) {
    console.error(error);
  }
};

const qrCodeMaker = async () => {
  const pdfDoc = await PDFDocument.create();
  let database = await readDatabase("database.txt");
  for (const data of database) {
    const info = data.split(".");
    const ownerName = info[0];
    const churchName = info[1];
    const ticketNumber = info[3];

    const page = pdfDoc.addPage();
    // set page template
    page.drawImage(
      await pdfDoc.embedPng(await fs.readFile("templates/qrcode-template.png")),
      {
        x: 0,
        y: 0,
        width: 612,
        height: 792,
      }
    );

    page.setSize(612, 792);
    const { width, height } = page.getSize();
    const qrCodePath = `output/qrcodes/${ownerName}.png`;

    await fs.mkdir("output/qrcodes", { recursive: true });
    await generateQRCode(ownerName);
    const qrCodeImage = await pdfDoc.embedPng(await fs.readFile(qrCodePath));
    //insert qr code to the pdf page
    page.drawImage(qrCodeImage, {
      x: 110,
      y: height - 510,
      width: 400,
      height: 400,
    });

    //insert name to the pdf page
    page.drawText(`${ownerName}.`, {
      x: 190,
      y: height - 620,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
      size: 35,
    });

    // insert church name to pdf page
    //insert name to the pdf page
    page.drawText(churchName, {
      x: 230,
      y: height - 645,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont(StandardFonts.Helvetica),
      size: 20,
    });
  }
  const pdfBytes = await pdfDoc.save();
  await fs.writeFile("output/output.pdf", pdfBytes);
};

module.exports = qrCodeMaker;
