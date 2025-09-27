import PropertyRental from "../models/PropertyRental.js";

// ✅ Get all properties
export const getProperties = async (req, res) => {
  try {
    const properties = await PropertyRental.find({});
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch properties", error });
  }
};

// ✅ Create property
export const createProperty = async (req, res) => {
  try {
    const { title, type, location, price } = req.body;
    const img = req.file ? req.file.filename : null;

    const property = new PropertyRental({
      title,
      type,
      location,
      price,
      img,
      status: "pending", // default status
    });

    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update property
export const updateProperty = async (req, res) => {
  try {
    const { title, type, location, price } = req.body;

    // Build update object
    const updateData = { title, type, location, price };
    if (req.file) updateData.img = req.file.filename;

    const updatedProperty = await PropertyRental.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(updatedProperty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete property
export const deleteProperty = async (req, res) => {
  try {
    const property = await PropertyRental.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete property", error });
  }
};

// ✅ Approve property
export const approveProperty = async (req, res) => {
  try {
    const property = await PropertyRental.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Reject property
export const rejectProperty = async (req, res) => {
  try {
    const property = await PropertyRental.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await PropertyRental.findById(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(200).json(property);
  } catch (err) {
    console.error("❌ Failed to fetch property:", err);
    res.status(500).json({ error: "Server error" });
  }
};
