import Transportpost from "../models/Transports.js";

// CREATE
export const createTransport = async (req, res) => {
  try {
    const { vehicleName, vehicleType, description, price } = req.body;
    const img = req.file ? req.file.filename : null;

    if (!vehicleName || !vehicleType || !description || !price) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    const newTransport = new Transportpost({
      vehicleName,
      vehicleType,
      description,
      price,
      img,
      status: "pending",
    });

    await newTransport.save();
    res.status(201).json(newTransport);
  } catch (err) {
    console.error("❌ Error creating transport:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// UPDATE TRANSPORT
export const updateTransport = async (req, res) => {
  try {
    const { vehicleName, vehicleType, description, price } = req.body;

    const transport = await Transportpost.findById(req.params.id);
    if (!transport)
      return res.status(404).json({ message: "Transport not found" });

    transport.vehicleName = vehicleName || transport.vehicleName;
    transport.vehicleType = vehicleType || transport.vehicleType;
    transport.description = description || transport.description;
    transport.price = price || transport.price;

    if (req.file) transport.img = req.file.filename;

    const updated = await transport.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Error updating transport:", error.message);
    res.status(500).json({ message: "Failed to update transport" });
  }
};

// GET ALL
export const getTransports = async (req, res) => {
  try {
    const transports = await Transportpost.find().sort({ createdAt: -1 });
    res.status(200).json(transports);
  } catch (err) {
    console.error("❌ Error fetching transports:", err.message);
    res.status(500).json({ message: "Failed to load transports" });
  }
};

// GET BY ID
export const getTransportById = async (req, res) => {
  try {
    const transport = await Transportpost.findById(req.params.id);
    if (!transport)
      return res.status(404).json({ message: "Transport not found" });
    res.status(200).json(transport);
  } catch (err) {
    console.error("❌ Error fetching transport:", err.message);
    res.status(500).json({ message: "Failed to fetch transport" });
  }
};

// UPDATE

// APPROVE
export const approveTransport = async (req, res) => {
  try {
    const transport = await Transportpost.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!transport)
      return res.status(404).json({ message: "Transport not found" });
    res.status(200).json(transport);
  } catch (err) {
    res.status(500).json({ message: "Failed to approve transport" });
  }
};

// REJECT
export const rejectTransport = async (req, res) => {
  try {
    const transport = await Transportpost.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!transport)
      return res.status(404).json({ message: "Transport not found" });
    res.status(200).json(transport);
  } catch (err) {
    res.status(500).json({ message: "Failed to reject transport" });
  }
};

// DELETE
export const deleteTransport = async (req, res) => {
  try {
    const deleted = await Transportpost.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Transport not found" });

    res.status(200).json({ message: "Transport deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting transport:", error.message);
    res.status(500).json({ message: "Failed to delete transport" });
  }
};
