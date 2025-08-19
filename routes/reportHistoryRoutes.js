import express from "express";
import { getMilkHistory } from "../controllers/reportController.js";

const router = express.Router();

// GET /api/history?filter=sold&animal=cow&time=morning
router.get("/", getMilkHistory);

export default router;
