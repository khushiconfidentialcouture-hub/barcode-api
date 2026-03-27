const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());

/* ---------------- TEST API (FOR BROWSER) ---------------- */
app.get("/test", async (req, res) => {
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

  let html = `
  <html>
  <body style="margin:0;">
  <div style="
    width:210mm;
    height:297mm;
    display:grid;
    grid-template-columns:1fr 1fr;
    grid-template-rows:repeat(6,1fr);
  ">
  `;

  items.forEach((item) => {
    const data = item.presku; // ✅ ONLY PRESKU IN BARCODE

    html += `
    <div style="border:1px solid black; text-align:center; padding:5mm;">
      <img src="https://barcode.tec-it.com/barcode.ashx?data=${data}&code=Code128" style="width:90%;height:60px;">
      <br><b>${item.presku}</b><br>${item.vendor}
    </div>
    `;
  });

  html += `</div></body></html>`;

const browser = await puppeteer.launch({
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
  headless: true
});  const page = await browser.newPage();

  await page.setContent(html);

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();

  res.set({
    "Content-Type": "application/pdf"
  });

  res.send(pdf);
});

/* ---------------- MAIN API (FOR ZOHO) ---------------- */
app.post("/generate-labels", async (req, res) => {
  const items = req.body.items || [];

  let html = `
  <html>
  <body style="margin:0;">
  <div style="
    width:210mm;
    height:297mm;
    display:grid;
    grid-template-columns:1fr 1fr;
    grid-template-rows:repeat(6,1fr);
  ">
  `;

  items.forEach((item) => {
    const data = item.presku; // ✅ ONLY PRESKU IN BARCODE

    html += `
    <div style="border:1px solid black; text-align:center; padding:5mm;">
      <img src="https://barcode.tec-it.com/barcode.ashx?data=${data}&code=Code128" style="width:90%;height:60px;">
      <br><b>${item.presku}</b><br>${item.vendor}
    </div>
    `;
  });

  html += `</div></body></html>`;

const browser = await puppeteer.launch({
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
  headless: true
});  const page = await browser.newPage();

  await page.setContent(html);

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();

  res.set({
    "Content-Type": "application/pdf"
  });

  res.send(pdf);
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
