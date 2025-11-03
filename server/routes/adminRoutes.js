import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Result from "../models/Result.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// register (run once to create admin)
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ username, password: hashed });
  res.json(admin);
});

// login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

// get all results
router.get("/results", protect, async (req, res) => {
  const results = await Result.find().sort({ date: -1 });
  res.json(results);
});

// clear all results
router.delete("/clear", protect, async (req, res) => {
  await Result.deleteMany({});
  res.json({ message: "All results cleared" });
});

export default router;