import express from "express";
import { generatePersonMilkReport, markAsPay } from "../controllers/personMilkReportController.js";

const router = express.Router();

// Generate PDF report
router.post("/generate", generatePersonMilkReport);

// Mark as pay
router.post("/mark-pay", markAsPay);

export default router;
