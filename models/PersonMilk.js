// models/PersonMilk.js
import mongoose from "mongoose";

const PersonMilkSchema = new mongoose.Schema({
    name: { type: String, required: true },      // Kashif, Mohsin, Qamar
    price: { type: Number, required: true },
    dateISO: { type: String, required: true },   // YYYY-MM-DD
    day: { type: String, required: true },       // Monday, Tuesday...
    pay: { type: String, enum: ["yes", "no"], default: "no" }
}, { timestamps: true });

export default mongoose.model("PersonMilk", PersonMilkSchema);


