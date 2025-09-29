import SpecialOffer from "../models/SpecialOffer.js";
import path from "path";

// ✅ Create new special offer
export const createSpecialOffer = async (req, res) => {
  try {
    const data = req.body;

    // If file uploaded, store path
    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }

    const offer = new SpecialOffer(data);
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to create special offer", details: err.message });
  }
};

// ✅ Get all special offers
export const getSpecialOffers = async (req, res) => {
  try {
    const offers = await SpecialOffer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch special offers" });
  }
};

// ✅ Get single special offer
export const getSpecialOfferById = async (req, res) => {
  try {
    const offer = await SpecialOffer.findById(req.params.id);
    if (!offer)
      return res.status(404).json({ error: "Special offer not found" });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch special offer" });
  }
};

// ✅ Update special offer
export const updateSpecialOffer = async (req, res) => {
  try {
    const data = req.body;

    // If new file uploaded, update image
    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await SpecialOffer.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ error: "Special offer not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update special offer" });
  }
};

// ✅ Delete special offer
export const deleteSpecialOffer = async (req, res) => {
  try {
    const deleted = await SpecialOffer.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Special offer not found" });
    res.json({ message: "Special offer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete special offer" });
  }
};
