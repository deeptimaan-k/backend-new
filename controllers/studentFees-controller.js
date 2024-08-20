const Fees = require("../models/studentFeesSchema");
const Student = require("../models/studentSchema");
const Admin = require("../models/adminSchema");
const Sclass = require("../models/sclassSchema");

// Create a new fee entry with an invoice
exports.createFeeWithInvoice = async (req, res) => {
  try {
    const { studentId, classId, schoolId, amountDue, dueDate, paymentMethod, invoice } = req.body;

    const newFee = new Fees({
      student: studentId,
      class: classId,
      school: schoolId,
      amountDue,
      dueDate,
      paymentMethod,
      invoice
    });

    await newFee.save();
    res.status(201).json(newFee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all fees with invoices
exports.getFeesWithInvoices = async (req, res) => {
  try {
    const fees = await Fees.find()
      .populate("student")
      .populate("class")
      .populate("school");

    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update fee status (e.g., mark as paid)
exports.updateFeeStatus = async (req, res) => {
  try {
    const { feeId } = req.params;
    const { status, amountPaid, transactionId, receipt } = req.body;

    const fee = await Fees.findById(feeId);
    if (!fee) {
      return res.status(404).json({ message: "Fee entry not found" });
    }

    if (status) fee.status = status;
    if (amountPaid) fee.amountPaid = amountPaid;
    if (transactionId) fee.transactionId = transactionId;
    if (receipt) fee.receipt = receipt;

    await fee.save();
    res.status(200).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a fee entry
exports.deleteFee = async (req, res) => {
  try {
    const { feeId } = req.params;

    const fee = await Fees.findById(feeId);
    if (!fee) {
      return res.status(404).json({ message: "Fee entry not found" });
    }

    await fee.deleteOne();
    res.status(200).json({ message: "Fee entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all overdue fees
exports.getOverdueFees = async (req, res) => {
  try {
    const today = new Date();
    const overdueFees = await Fees.find({
      dueDate: { $lt: today },
      status: "Pending",
    }).populate("student").populate("class").populate("school");

    if (!overdueFees.length) {
      return res.status(404).json({ message: "No overdue fees found" });
    }

    res.status(200).json(overdueFees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate a new invoice number
exports.generateInvoiceNumber = async (req, res) => {
  try {
    const invoiceNumber = "INV" + Date.now(); // Simple invoice number generation
    res.status(200).json({ invoiceNumber });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getTotalPendingFees = async (req, res) => {
  try {
    // Fetch all students
    const students = await Student.find({});
    
    if (!students.length) {
      return res.status(404).json({ message: "No students found" });
    }

    let totalPendingFees = 0;
    let totalStudentsWithPendingFees = 0;

    for (let student of students) {
      // Fetch all pending fees for the current student
      const pendingFees = await Fees.find({
        student: student._id,
        status: "Pending",
      });

      // Sum the total pending amount for the student
      if (pendingFees.length > 0) {
        totalStudentsWithPendingFees++;
        for (let fee of pendingFees) {
          totalPendingFees += fee.amount;
        }
      }
    }

    res.status(200).json({
      totalStudents: students.length,
      totalStudentsWithPendingFees,
      totalPendingFees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getTotalInvoices = async (req, res) => {
  try {
    const invoices = await Fees.aggregate([
      {
        $group: {
          _id: "$invoice.status", // Group by invoice status
          totalInvoices: { $sum: 1 },
          totalAmountDue: { $sum: "$invoice.totalAmount" },
          totalAmountPaid: { $sum: "$amountPaid" }
        }
      },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: "$totalInvoices" },
          totalAmountDue: { $sum: "$totalAmountDue" },
          totalAmountPaid: { $sum: "$totalAmountPaid" },
          statuses: {
            $push: {
              status: "$_id",
              count: "$totalInvoices"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalInvoices: 1,
          totalAmountDue: 1,
          totalAmountPaid: 1,
          statuses: 1
        }
      }
    ]);

    if (!invoices.length) {
      return res.status(404).json({ message: "No invoices found" });
    }

    res.status(200).json(invoices[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
