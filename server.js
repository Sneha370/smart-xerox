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
    res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Smart Xerox</title>
<style>
body{
    margin:0;
    font-family:Arial;
    background:linear-gradient(135deg,#0f172a,#1e293b);
    color:white;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
}
.box{
    background:#111827;
    padding:30px;
    border-radius:15px;
    text-align:center;
    width:360px;
    box-shadow:0 0 20px rgba(0,0,0,0.5);
}
h1{color:#38bdf8;}
a{
    display:inline-block;
    margin-top:15px;
    padding:10px;
    width:100%;
    background:#38bdf8;
    color:black;
    text-decoration:none;
    border-radius:8px;
    font-weight:bold;
}
a:hover{background:#0ea5e9;}
</style>
</head>

<body>
<div class="box">
<h1>🖨 Smart Xerox</h1>
<p>PDF Upload & Price Calculator</p>

<a href="/upload">Go to Upload Page</a>
</div>
</body>
</html>
`);
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