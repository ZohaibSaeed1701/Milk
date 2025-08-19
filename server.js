import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import milkRoutes from "./routes/milkRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import reportHistoryRoutes from "./routes/reportHistoryRoutes.js";
import personMilkRoutes from "./routes/personMilkRoutes.js";
import personMilkReportRoutes from "./routes/personMilkReportRoutes.js";


dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());



app.use("/api/milk", milkRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/history", reportHistoryRoutes);
app.use("/api/person-milk", personMilkRoutes);
// app.use("/api/person-milk-report", personMilkReportRoutes);
app.use("/api/person-milk-report", personMilkReportRoutes);




// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: "milkDB"
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));


// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
