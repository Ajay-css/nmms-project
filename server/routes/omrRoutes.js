import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import Result from "../models/Result.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// 📸 Scan OMR and store result
router.post("/scan", upload.single("file"), async (req, res) => {
  try {
    const { studentName, subject, answer_key } = req.body;

    // Prepare form data for Flask API
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));
    formData.append("answer_key", answer_key || "");

    // ✅ Send to Flask backend (your deployed URL)
    const pythonRes = await axios.post("https://nmms-project-python.onrender.com/scan", formData, {
      headers: formData.getHeaders(),
    });

    const totalScore =
      pythonRes.data?.scores?.TOTAL || pythonRes.data?.score || 0;

    // Save to DB (optional)
    const result = await Result.create({
      studentName,
      subject,
      score: totalScore,
    });

    // Delete temp file
    fs.unlinkSync(req.file.path);

    res.json({ message: "Scanned successfully ✅", data: result });
  } catch (err) {
    console.error("❌ OMR Scan Error:", err.message);
    res.status(500).json({ message: "Error scanning OMR" });
  }
});

export default router;
