// controllers/personMilkController.js
import PersonMilk from "../models/PersonMilk.js";

// Add new entry
export const addPersonMilk = async (req, res) => {
    try {
        const { name, price, dateISO, day, pay } = req.body;
        const entry = new PersonMilk({ name, price, dateISO, day, pay });
        await entry.save();
        res.json({ success: true, message: "Entry added successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all entries
export const getPersonMilk = async (req, res) => {
    try {
        const entries = await PersonMilk.find().sort({ dateISO: -1 });
        res.json({ success: true, data: entries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



