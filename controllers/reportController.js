import MilkEntry from "../models/MilkEntry.js";
import PDFDocument from "pdfkit";


// Generate report - Only include entries that are not sold
export const generateReport = async (req, res) => {
  try {
    const { startDate, endDate, animal, time } = req.body;
    let query = { sold: { $ne: "yes" } }; // Only include entries that are not sold

    if (startDate && endDate) query.dateISO = { $gte: startDate, $lte: endDate };
    if (animal === "cow") query.cow = { $gt: 0 };
    else if (animal === "buffalo") query.buffalo = { $gt: 0 };
    if (time && time !== "both") query.time = time;

    const entries = await MilkEntry.find(query).sort({ dateISO: 1, time: 1 });

    // Calculate totals
    let totalCow = 0;
    let totalBuffalo = 0;
    entries.forEach(entry => {
      totalCow += entry.cow || 0;
      totalBuffalo += entry.buffalo || 0;
    });

    // PDF generation
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=milk_report.pdf",
          "Content-Length": pdfData.length,
        })
        .end(pdfData);
    });

    // Title
    doc.fontSize(20).font("Helvetica-Bold").text("M. Saeed Anwar", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(16).text("Milk Production Report", { align: "center" });
    doc.moveDown(0.5);
    
    // Report details
    doc.fontSize(10).font("Helvetica");
    doc.text(`Date Range: ${startDate} to ${endDate}`, { align: "center" });
    doc.text(`Animal: ${animal === "both" ? "Cow & Buffalo" : animal}`, { align: "center" });
    doc.text(`Time: ${time === "both" ? "Morning & Evening" : time}`, { align: "center" });
    doc.moveDown(1);

    // Table Header
    const tableTop = doc.y;
    const leftMargin = 50;
    const col1 = leftMargin;
    const col2 = col1 + 80;
    const col3 = col2 + 60;
    const col4 = col3 + 80;
    const col5 = col4 + 80;

    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("Date", col1, tableTop);
    doc.text("Day", col2, tableTop);
    doc.text("Time", col3, tableTop);
    if (animal !== "buffalo") doc.text("Cow (L)", col4, tableTop);
    if (animal !== "cow") doc.text("Buffalo (L)", animal === "cow" ? col4 : col5, tableTop);
    
    // Horizontal line
    doc.moveTo(leftMargin, tableTop + 15).lineTo(animal === "both" ? col5 + 80 : col4 + 80, tableTop + 15).stroke();

    // Table Rows
    doc.font("Helvetica");
    let y = tableTop + 25;
    
    entries.forEach(entry => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
      
      doc.fontSize(10);
      doc.text(entry.dateISO, col1, y);
      doc.text(entry.dayName, col2, y);
      doc.text(entry.time.charAt(0).toUpperCase() + entry.time.slice(1), col3, y);
      
      if (animal !== "buffalo") {
        doc.text(entry.cow.toString(), col4, y);
      }
      
      if (animal !== "cow") {
        doc.text(entry.buffalo.toString(), animal === "cow" ? col4 : col5, y);
      }
      
      y += 20;
    });

    // Totals
    if (y > 650) {
      doc.addPage();
      y = 50;
    }
    
    doc.font("Helvetica-Bold");
    doc.text("TOTALS:", col1, y + 10);
    
    if (animal !== "buffalo") {
      doc.text(totalCow.toString(), col4, y + 10);
    }
    
    if (animal !== "cow") {
      doc.text(totalBuffalo.toString(), animal === "cow" ? col4 : col5, y + 10);
    }

    // Grand total if both animals
    if (animal === "both") {
      doc.text((totalCow + totalBuffalo).toString(), col5 + 40, y + 10);
      doc.text("Grand Total", col3, y + 30);
    }

    doc.end();
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark entries as sold - Only mark entries that are not already sold
export const markSold = async (req, res) => {
  try {
    const { startDate, endDate, animal, time } = req.body;
    let query = { sold: { $ne: "yes" } }; // Only update entries that are not already sold

    if (startDate && endDate) query.dateISO = { $gte: startDate, $lte: endDate };
    if (animal === "cow") query.cow = { $gt: 0 };
    else if (animal === "buffalo") query.buffalo = { $gt: 0 };
    if (time && time !== "both") query.time = time;

    const result = await MilkEntry.updateMany(query, { $set: { sold: "yes" } });
    
    res.json({ 
      success: true, 
      message: `${result.modifiedCount} entries marked as sold successfully` 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





// Fetch milk history based on filters
export const getMilkHistory = async (req, res) => {
  try {
    const { filter, animal, time } = req.query;

    let query = {};

    // Filter by sold status
    if (filter === "sold") query.sold = "yes";
    else if (filter === "not-sold") query.sold = { $ne: "yes" };

    // Filter by date ranges
    const today = new Date();
    if (filter === "last-10-days") {
      const start = new Date();
      start.setDate(today.getDate() - 10);
      query.dateISO = { $gte: start.toISOString().split("T")[0], $lte: today.toISOString().split("T")[0] };
    } else if (filter === "last-20-days") {
      const start = new Date();
      start.setDate(today.getDate() - 20);
      query.dateISO = { $gte: start.toISOString().split("T")[0], $lte: today.toISOString().split("T")[0] };
    } else if (filter === "custom") {
      const { startDate, endDate } = req.query;
      if (startDate && endDate) query.dateISO = { $gte: startDate, $lte: endDate };
    }

    // Filter by animal
    if (animal === "cow") query.cow = { $exists: true };
    else if (animal === "buffalo") query.buffalo = { $exists: true };

    // Filter by time
    if (time && time !== "both") query.time = time;

    const entries = await MilkEntry.find(query).sort({ dateISO: -1 });
    res.json({ success: true, entries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
