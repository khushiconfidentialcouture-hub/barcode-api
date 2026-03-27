const express = require("express");
const bwipjs = require("bwip-js");

const app = express();
app.use(express.json());

/* -------- BARCODE GENERATOR -------- */
async function generateBarcodeBase64(text) {
  const png = await bwipjs.toBuffer({
    bcid: "code128",
    text: text,
    scale: 3,
    height: 10,
    includetext: false,
  });

  return "data:image/png;base64," + png.toString("base64");
}

/* -------- MAIN API -------- */
app.get("/generate-labels", async (req, res) => {
  try {
    const data = JSON.parse(req.query.data);
    const items = data.items || [];

    let html = `
    <html>
    <head>
      <style>
        body { margin: 0; }
        .page {
          width: 210mm;
          height: 297mm;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: repeat(6, 1fr);
          page-break-after: always;
        }
        .label {
          border: 1px solid black;
          text-align: center;
          padding: 5mm;
          font-family: Arial;
        }
        img {
          width: 90%;
          height: 60px;
        }
      </style>
    </head>
    <body>
    `;

    for (let i = 0; i < items.length; i++) {

      if (i % 12 === 0) {
        html += `<div class="page">`;
      }

      const item = items[i];
      const barcode = await generateBarcodeBase64(item.presku);

      html += `
        <div class="label">
          <img src="${barcode}">
          <br><b>${item.presku}</b><br>${item.vendor}
        </div>
      `;

      if (i % 12 === 11 || i === items.length - 1) {
        html += `</div>`;
      }
    }

    html += `
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
    `;

    res.send(html);

  } catch (e) {
    res.send("Error generating labels");
  }
});

/* -------- START SERVER -------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});