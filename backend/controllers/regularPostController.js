import Regularpost from "../models/RegularPost.js";
// Get all tours
export const getTours = async (req, res) => {
  try {
    const tours = await Regularpost.find().sort({ createdAt: 1 });
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tours", error: err });
  }
};

// Create new tour
export const createTour = async (req, res) => {
  try {
    const { category, icon, destinations } = req.body;
    if (!category)
      return res.status(400).json({ message: "Category required" });

    const tour = new Regularpost({
      category,
      icon,
      destinations: destinations || [],
    });

    await tour.save();
    res.status(201).json(tour);
  } catch (err) {
    res.status(500).json({ message: "Failed to create tour", error: err });
  }
};

// Update tour
export const updateTour = async (req, res) => {
  try {
    const tour = await Regularpost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: "Failed to update tour", error: err });
  }
};

// Delete tour
export const deleteTour = async (req, res) => {
  try {
    const tour = await Regularpost.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.json({ message: "Tour deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete tour", error: err });
  }
};
