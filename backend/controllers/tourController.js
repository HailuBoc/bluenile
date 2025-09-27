import Tour from "../models/Tour.js";

// GET all tours
export const getTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single tour by ID
export const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ error: "Tour not found" });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE new tour
export const createTour = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    await newTour.save();
    res.json({ message: "Tour created successfully", tour: newTour });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE tour by ID
export const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTour) return res.status(404).json({ error: "Tour not found" });
    res.json({ message: "Tour updated successfully", tour: updatedTour });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE tour by ID
export const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ error: "Tour not found" });
    res.json({ message: "Tour deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
