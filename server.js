const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const app = express();
app.use(cors());

// multer setup (file upload storage)
const upload = multer({ dest: "uploads/" });

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Server is running");
});

// SIMPLE UPLOAD PAGE (browser open panna)
app.get("/upload", (req, res) => {
    res.send(`
    <h2>Upload PDF</h2>
    <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="file" />
        <button type="submit">Upload</button>
    </form>
    `);
});
// UPLOAD API (PDF receive + read)
 app.post("/upload", upload.single("file"), async (req, res) => {
    console.log("🔥 ROUTE HIT");

    try {
        if (!req.file) {
            console.log("❌ No file");
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("FILE 👉", req.file);

        const buffer = fs.readFileSync(req.file.path);
        console.log("BUFFER LENGTH 👉", buffer.length);

        const data = await pdfParse(buffer);
        console.log("PAGES 👉", data.numpages);

        const pricePerPage = 2;
const total = data.numpages * pricePerPage;

res.json({
    message: "Success",
    pages: data.numpages,
    pricePerPage: pricePerPage,
    totalAmount: total
});

    } catch (error) {
        console.log("🔥 FULL ERROR 👉", error);

        res.status(500).json({
            error: "PDF read error",
            details: error.message
        });
    }
});
// START SERVER
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});