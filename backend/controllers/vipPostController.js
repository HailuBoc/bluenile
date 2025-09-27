import VipPost from "../models/VipPost.js";
import fs from "fs";
import path from "path";

// Get all VIP tours
export const getVipTours = async (req, res) => {
  try {
    const tours = await VipPost.find({});
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create VIP tour
// Create VIP tour
// Create VIP tour
export const createVipTour = async (req, res) => {
  try {
    const { name, description, date, highlights } = req.body;

    const newTour = await VipPost.create({
      name,
      description,
      date,
      image: req.file ? req.file.filename : null, // just store filename
      highlights: highlights
        ? Array.isArray(highlights)
          ? highlights
          : JSON.parse(highlights)
        : [],
    });

    res.status(201).json(newTour);
  } catch (err) {
    console.error("❌ Error creating VIP tour:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update VIP tour
export const updateVipTour = async (req, res) => {
  try {
    const tour = await VipPost.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour not found" });

    const { name, description, date, highlights } = req.body;

    if (req.file) {
      // Delete old image if exists
      if (tour.image) {
        const oldPath = path.join("uploads", tour.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      tour.image = req.file.filename; // store only filename
    }

    tour.name = name || tour.name;
    tour.description = description || tour.description;
    tour.date = date || tour.date;
    tour.highlights = highlights ? JSON.parse(highlights) : tour.highlights;

    await tour.save();
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete VIP tour
export const deleteVipTour = async (req, res) => {
  try {
    const tour = await VipPost.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour not found" });

    if (tour.image) {
      const oldPath = path.join("uploads", tour.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await tour.remove();
    res.json({ message: "Tour deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve VIP tour
export const approveVipTour = async (req, res) => {
  try {
    const tour = await VipPost.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour not found" });

    tour.status = "approved";
    await tour.save();
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject VIP tour
export const rejectVipTour = async (req, res) => {
  try {
    const tour = await VipPost.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour not found" });

    tour.status = "rejected";
    await tour.save();
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
