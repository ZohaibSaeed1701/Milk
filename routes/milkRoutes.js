import express from "express";
import { addMilkEntry, getAllMilkEntries } from "../controllers/milkController.js";

const router = express.Router();

router.post("/add", addMilkEntry);
router.get("/all", getAllMilkEntries);

export default router;
