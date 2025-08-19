import mongoose from "mongoose";

const milkEntrySchema = new mongoose.Schema({
  dateISO: {
    type: String,   // e.g. 2025-08-19
    required: true
  },
  dayName: {
    type: String,   // e.g. "Tuesday"
    required: true
  },
  time: {
    type: String,
    enum: ["morning", "evening"], // only morning or evening
    required: true
  },
  cow: {
    type: Number,
    default: 0,
    min: 0
  },
  buffalo: {
    type: Number,
    default: 0,
    min: 0
  },
  providedTo: {
    type: String,
    default: "milkman"
  },
  sold: {
    type: String,
    enum: ["yes", "no"],
    default: "no"
  }
}, { timestamps: true });

export default mongoose.model("MilkEntry", milkEntrySchema);
