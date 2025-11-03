import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import scanRoutes from "./routes/omrRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection (optional)
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/nmms", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err.message));

app.use("/api/scan", scanRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
