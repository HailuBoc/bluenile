import Car from "../models/carModel.js";

// Get car by ID
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Increment likes
export const likeCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });

    car.likes = (car.likes || 0) + 1;
    await car.save();

    res.json({ likes: car.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
