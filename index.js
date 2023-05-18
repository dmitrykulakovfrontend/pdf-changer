const { PDFDocument, rgb } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const fs = require("fs");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const filepath = "./template.pdf";
const stream = require("stream");

app.get("/", async (req, res) => {
  try {
    console.log(req.query);
    // const pdfValues = {
    //   industry: "Промышленная отрасль",
    //   organizationType: "Индивидуальный предприниматель",
    //   staff: "200 чел.",
    //   region: "Очень длинный текст района",
    //   totalCost: "От 100 до 300 млн. руб.",
    //   costPerStaff: "6 000 000Р (30 000Р/чел.)",
    //   pensionInsurance: "20 000 000Р",
    //   medicalInsurance: "20 000 000Р",
    //   rentOfRealEstate: "30 000 000Р",
    //   taxes: "3 000 000Р",
    //   services: "15 000 000Р",
    // };

    const pdf = await createPdf(req.query);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="detailedCalculations.pdf"'
    );
    console.log("/download-file: Buffer length:", pdf.length);

    const readStream = new stream.PassThrough();
    readStream.end(pdf);
    readStream.pipe(res);
    // res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function createPdf(options) {
  const templateBytes = fs.readFileSync(filepath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);
  const pages = pdfDoc.getPages();
  const fontBytes = fs.readFileSync("./Exo2-Regular.ttf");
  const customFont = await pdfDoc.embedFont(fontBytes);
  pages[2].drawText(options.industry, {
    x: 258,
    y: 665,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });
  pages[2].drawText(options.organizationType, {
    x: 258,
    y: 600,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });
  pages[2].drawText(options.staff, {
    x: 258,
    y: 525,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });
  pages[2].drawText(options.region, {
    x: 258,
    y: 460,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  pages[2].drawText(options.totalCost, {
    x: 270,
    y: 367,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  pages[2].drawText(options.costPerStaff, {
    x: 200,
    y: 272,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  pages[2].drawText(options.rentOfRealEstate, {
    x: 258,
    y: 220,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  pages[2].drawText(options.taxes, {
    x: 200,
    y: 172,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  pages[2].drawText(options.services, {
    x: 200,
    y: 125,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  pages[3].drawText(options.costPerStaff, {
    x: 330,
    y: 345,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });
  pages[3].drawText(options.staff, {
    x: 330,
    y: 275,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });
  pages[3].drawText(options.pensionInsurance, {
    x: 330,
    y: 215,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });
  pages[3].drawText(options.medicalInsurance, {
    x: 330,
    y: 150,
    size: 12,
    font: customFont,
    color: rgb(0, 0, 0),
  });
  const modifiedPdfBytes = await pdfDoc.save();
  return modifiedPdfBytes;
  // fs.writeFileSync("./output.pdf", modifiedPdfBytes);
}
async function createMarkupPdf(filepath, outputpath = "./markup.pdf") {
  const templateBytes = fs.readFileSync(filepath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();

  pages.forEach((page, pageIndex) => {
    const { width, height } = page.getSize();
    const squareSize = Math.min(width, height) / 10;
    const margin = 20;

    const redColor = rgb(1, 1, 0);

    const drawSquare = (x, y) => {
      page.drawRectangle({
        x,
        y,
        width: squareSize,
        height: squareSize,
        borderWidth: 1,
        borderColor: redColor,
        color: undefined,
        opacity: 0.5,
      });
      const coordinatesText = `(${x.toFixed(0)}, ${y.toFixed(0)})`;
      page.drawText(coordinatesText, {
        x: x,
        y: y,
        size: 7,
        // font: "n",
        color: rgb(0, 0, 0),
      });
      page.drawText(`(${x.toFixed(0)}, ${(y + squareSize - 10).toFixed(0)})`, {
        x: x,
        y: y + squareSize - 10,
        size: 7,
        // font: "n",
        color: rgb(0, 0, 0),
      });
      // page.drawText(coordinatesText, {
      //   x: x,
      //   y: y,
      //   size: 7,
      //   // font: "n",
      //   color: rgb(0, 0, 0),
      // });
    };

    const numSquaresHorizontally = Math.floor(
      (width - 2 * margin) / squareSize
    );
    const numSquaresVertically = Math.floor((height - 2 * margin) / squareSize);

    for (let i = 0; i < numSquaresHorizontally; i++) {
      for (let j = 0; j < numSquaresVertically; j++) {
        const x = margin + i * squareSize;
        const y = margin + j * squareSize;

        drawSquare(x, y);
      }
    }
  });

  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputpath, modifiedPdfBytes);
}
