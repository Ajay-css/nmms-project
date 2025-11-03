import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  studentName: String,
  subject: String,
  score: Number,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Result", resultSchema);