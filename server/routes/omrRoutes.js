import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import Result from "../models/Result.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Scan OMR and store result
router.post("/scan", upload.single("file"), async (req, res) => {
  try {
    const { studentName, subject, answer_key } = req.body;

    // Prepare FormData to send to Flask API
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));
    formData.append("answer_key", answer_key || "");

    // ✅ Flask endpoint (Python API)
    const pythonRes = await axios.post("https://your-flask-api-url.onrender.com/scan", formData, {
      headers: formData.getHeaders(),
    });

    const result = await Result.create({
      studentName,
      subject,
      score: pythonRes.data.scores?.TOTAL || pythonRes.data.score || 0,
    });

    // Cleanup
    fs.unlinkSync(req.file.path);

    res.json({ message: "Scanned successfully", data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error scanning OMR" });
  }
});

export default router;