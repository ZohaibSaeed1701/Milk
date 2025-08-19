// routes/personMilkRoutes.js
import express from "express";
import { addPersonMilk, getPersonMilk } from "../controllers/personMilkController.js";

const router = express.Router();

// Add milk entry
router.post("/add", addPersonMilk);

// Get all entries (History / Report will use frontend filters)
router.get("/all", getPersonMilk);

export default router;
