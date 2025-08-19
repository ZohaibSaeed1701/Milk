import express from "express";
import { generateReport, markSold } from "../controllers/reportController.js";

const router = express.Router();

router.post("/generate", generateReport);
router.post("/mark-sold", markSold);

export default router;
