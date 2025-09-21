import House from "../models/HouseLike.js"; // your House model
import { Property } from "../models/propertyModel.js";

// Get total likes
export const getHouseLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const house = await Property.findById(id);
    if (!house) return res.status(404).json({ message: "House not found" });

    res.json({ likes: house.likes || 0 });
  } catch (err) {
    console.error("❌ Error fetching house likes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Increment or decrement likes
export const toggleHouseLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { liked } = req.body; // true = increment, false = decrement

    const house = await Property.findById(id);
    if (!house) return res.status(404).json({ message: "House not found" });

    house.likes = house.likes || 0;
    house.likes = liked ? house.likes + 1 : Math.max(house.likes - 1, 0);

    await house.save();

    res.json({ likes: house.likes });
  } catch (err) {
    console.error("❌ Error toggling house like:", err);
    res.status(500).json({ message: "Server error" });
  }
};
