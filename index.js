const express = require("express");

const app = express();
app.use(express.json());

/* -------- TEST API (optional - for checking) -------- */
app.get("/test", (req, res) => {
  const items = [
    { presku: "SKU001", vendor: "Nike" },
    { presku: "SKU002", vendor: "Puma" },
    { presku: "SKU003", vendor: "Adidas" },
    { presku: "SKU004", vendor: "Reebok" },
    { presku: "SKU005", vendor: "Fila" },
    { presku: "SKU006", vendor: "Zara" },
    { presku: "SKU007", vendor: "H&M" },
    { presku: "SKU008", vendor: "Levis" },
    { presku: "SKU009", vendor: "Uniqlo" },
    { presku: "SKU010", vendor: "Gucci" },
    { presku: "SKU011", vendor: "Prada" },
    { presku: "SKU012", vendor: "Armani" }
  ];

  res.send(generateHTML(items));
});

/* -------- MAIN API (ZOHO - GET) -------- */
app.get("/generate-labels", (req, res) => {
  try {
    const data = JSON.parse(req.query.data);
    const items = data.items || [];
    res.send(generateHTML(items));
  } catch (e) {
    res.send("Invalid data");
  }
});

/* -------- MAIN API (ZOHO - POST optional) -------- */
app.post("/generate-labels", (req, res) => {
  const items = req.body.items || [];
  res.send(generateHTML(items));
});

/* -------- HTML GENERATOR -------- */
function generateHTML(items) {
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

    <div class="page">
  `;

  items.forEach((item) => {
    const data = item.presku; // ✅ barcode only presku

    html += `
      <div class="label">
        <img src="https://barcode.tec-it.com/barcode.ashx?data=${data}&code=Code128">
        <br><b>${item.presku}</b><br>${item.vendor}
      </div>
    `;
  });

  html += `
    </div>

    <script>
      // Auto open print dialog
      window.onload = function() {
        window.print();
      };
    </script>

  </body>
  </html>
  `;

  return html;
}

/* -------- START SERVER -------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
