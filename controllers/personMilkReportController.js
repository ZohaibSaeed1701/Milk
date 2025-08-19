
import PersonMilk from "../models/PersonMilk.js";
import PDFDocument from "pdfkit";

// Generate PDF report for pay=no entries
export const generatePersonMilkReport = async (req, res) => {
  try {
    const { startDate, endDate, name } = req.body;

    let query = { pay: "no" }; // only unpaid
    if (startDate && endDate) query.dateISO = { $gte: startDate, $lte: endDate };
    if (name && name !== "all") query.name = name;

    const entries = await PersonMilk.find(query).sort({ dateISO: 1 });

    // PDF generation
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=person_milk_report.pdf`,
          "Content-Length": pdfData.length,
        })
        .end(pdfData);
    });

    // Header
    doc.fontSize(18).text("M. Saeed Anwar", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text("Person Milk Report", { align: "center" });
    
    // Report period info
    if (startDate && endDate) {
      doc.moveDown(0.5);
      doc.fontSize(10).text(`Period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`, { align: "center" });
    }
    if (name && name !== "all") {
      doc.moveDown(0.5);
      doc.fontSize(10).text(`Person: ${name}`, { align: "center" });
    }
    doc.moveDown();

    // Define column positions and widths
    const colDate = 50;
    const colDay = 120;
    const colName = 190;
    const colPrice = 300;
    const colPay = 370;
    const colWidthDate = 60;
    const colWidthDay = 60;
    const colWidthName = 100;
    const colWidthPrice = 60;
    const colWidthPay = 50;

    // Table header
    doc.fontSize(12);
    doc.font("Helvetica-Bold");
    doc.text("Date", colDate, doc.y, { width: colWidthDate });
    doc.text("Day", colDay, doc.y, { width: colWidthDay });
    doc.text("Name", colName, doc.y, { width: colWidthName });
    doc.text("Price", colPrice, doc.y, { width: colWidthPrice });
    doc.text("Pay", colPay, doc.y, { width: colWidthPay });
    
    // Draw header underline
    const headerY = doc.y;
    doc.moveTo(30, headerY + 15).lineTo(570, headerY + 15).stroke();
    doc.y = headerY + 20;
    doc.font("Helvetica"); // Reset to normal font

    // Table entries
    let totalAmount = 0;
    entries.forEach((entry) => {
      // Check if we need a new page
      if (doc.y > 700) {
        doc.addPage();
        doc.y = 50;
      }

      doc.text(entry.dateISO, colDate, doc.y, { width: colWidthDate });
      doc.text(entry.day, colDay, doc.y, { width: colWidthDay });
      doc.text(entry.name, colName, doc.y, { width: colWidthName });
      doc.text(entry.price.toString(), colPrice, doc.y, { width: colWidthPrice, align: 'right' });
      doc.text(entry.pay, colPay, doc.y, { width: colWidthPay });
      
      totalAmount += entry.price;
      doc.moveDown();
    });

    // Draw total line
    doc.moveTo(30, doc.y).lineTo(570, doc.y).stroke();
    doc.moveDown();
    
    // Display total
    doc.font("Helvetica-Bold");
    doc.text("Total Amount:", colName, doc.y);
    doc.text(totalAmount.toString(), colPrice, doc.y, { align: 'right', width: colWidthPrice });
    doc.font("Helvetica");

    doc.end();
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark entries as pay=yes
export const markAsPay = async (req, res) => {
  try {
    const { startDate, endDate, name } = req.body;

    let query = { pay: "no" };
    if (startDate && endDate) query.dateISO = { $gte: startDate, $lte: endDate };
    if (name && name !== "all") query.name = name;

    await PersonMilk.updateMany(query, { $set: { pay: "yes" } });
    res.json({ success: true, message: "Entries marked as pay=yes" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
