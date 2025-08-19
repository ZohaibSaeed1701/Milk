import MilkEntry from "../models/MilkEntry.js";

// Add new milk entry
export const addMilkEntry = async (req, res) => {
  try {
    const { dateISO, dayName, time, cow = 0, buffalo = 0 } = req.body;

    // Validate required fields
    if (!dateISO || !dayName || !time) {
      return res.status(400).json({ success: false, message: "Date, day, and time are required" });
    }

    const entry = new MilkEntry({
      dateISO,
      dayName,
      time,
      cow,
      buffalo
      // providedTo: default "milkman"
      // sold: default "no"
    });

    await entry.save();
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    console.error("Error saving milk entry:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all milk entries
export const getAllMilkEntries = async (req, res) => {
  try {
    const entries = await MilkEntry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: entries });
  } catch (err) {
    console.error("Error fetching milk entries:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
