const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

// Folder tempat ind.traineddata disimpan (root backend) - biar Tesseract
// baca dari lokal, gak perlu download dari internet tiap kali OCR jalan
const TESSDATA_PATH = path.join(__dirname, "../..");

router.post("/ocr", upload.single("image"), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Gambar tidak ditemukan",
    });
  }

  try {

    const result = await Tesseract.recognize(req.file.path, "ind", {
      langPath: TESSDATA_PATH,
      gzip: false,
    });

    res.json({
      success: true,
      text: result.data.text,
    });

  } catch (error) {

    console.log("OCR ERROR (Tesseract):", error);

    res.status(500).json({
      success: false,
      message: "OCR gagal",
    });

  } finally {

    // Hapus file foto sementara setelah diproses, gak perlu disimpan terus
    fs.unlink(req.file.path, (err) => {
      if (err) console.log("Gagal hapus file upload:", err);
    });

  }

});

module.exports = router;