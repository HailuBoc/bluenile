import Car from "../models/carModel.js";
import { Property } from "../models/propertyModel.js";
// Get car by ID
export const getCarById = async (req, res) => {
  try {
    const car = await Property.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleLikeCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { liked } = req.body;

    const car = await Property.findById(id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    // Update likes count
    car.likes = liked ? (car.likes || 0) + 1 : (car.likes || 0) - 1;
    await car.save();

    res.json({ likes: car.likes });
  } catch (error) {
    console.error("Error liking car:", error);
    res.status(500).json({ message: "Failed to like car" });
  }
};
