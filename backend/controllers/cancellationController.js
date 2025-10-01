import Cancellation from "../models/Cancellation.js";

// Create a new cancellation request
export const createCancellation = async (req, res) => {
  try {
    const { bookingType, phoneNumber, userEmail, reason } = req.body;

    const newCancellation = await Cancellation.create({
      bookingType,
      phoneNumber,
      userEmail,
      reason,
    });

    res.status(201).json(newCancellation);
  } catch (err) {
    console.error("❌ Failed to create cancellation:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all cancellation requests (for admin panel)
export const getCancellations = async (req, res) => {
  try {
    const cancellations = await Cancellation.find().sort({ createdAt: -1 });
    res.json(cancellations);
  } catch (err) {
    console.error("❌ Failed to fetch cancellations:", err);
    res.status(500).json({ message: err.message });
  }
};

// Approve a cancellation
export const approveCancellation = async (req, res) => {
  try {
    const cancellation = await Cancellation.findById(req.params.id);
    if (!cancellation)
      return res.status(404).json({ message: "Cancellation not found" });

    cancellation.status = "approved";
    await cancellation.save();

    res.json({ message: "Cancellation approved", cancellation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject a cancellation
export const rejectCancellation = async (req, res) => {
  try {
    const cancellation = await Cancellation.findById(req.params.id);
    if (!cancellation)
      return res.status(404).json({ message: "Cancellation not found" });

    cancellation.status = "rejected";
    await cancellation.save();

    res.json({ message: "Cancellation rejected", cancellation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a cancellation request
export const deleteCancellation = async (req, res) => {
  try {
    const cancellation = await Cancellation.findById(req.params.id);
    if (!cancellation)
      return res.status(404).json({ message: "Cancellation not found" });

    await Cancellation.deleteOne({ _id: req.params.id });
    res.json({ message: "Cancellation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
