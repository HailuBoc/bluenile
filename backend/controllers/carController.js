import Car from "../models/carModel.js";
import { Property } from "../models/propertyModel.js";
// Get car by ID
export const getCarById = async (req, res) => {
  try {
    const userId = req.query.userId;
    const car = await Property.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    
    const userLiked = userId ? car.likedBy?.includes(userId) : false;
    
    // Return Mongoose document + userLiked
    const carObj = car.toObject();
    res.json({ ...carObj, likes: car.likes || 0, userLiked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleLikeCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const car = await Property.findById(id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    // Initialize likedBy
    if (!car.likedBy) car.likedBy = [];

    const alreadyLiked = car.likedBy.includes(userId);

    if (alreadyLiked) {
      // Unlike
      car.likedBy = car.likedBy.filter(uid => uid.toString() !== userId);
      car.likes = Math.max((car.likes || 1) - 1, 0);
    } else {
      // Like
      car.likedBy.push(userId);
      car.likes = (car.likes || 0) + 1;
    }

    await car.save();

    res.json({ likes: car.likes, userLiked: !alreadyLiked });
  } catch (error) {
    console.error("Error liking car:", error);
    res.status(500).json({ message: "Failed to like car" });
  }
};
