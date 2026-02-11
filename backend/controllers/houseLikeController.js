import House from "../models/HouseLike.js"; // your House model
import { Property } from "../models/propertyModel.js";

// Get total likes
export const getHouseLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId; // Optional: check if specific user liked it

    const house = await Property.findById(id);
    if (!house) return res.status(404).json({ message: "House not found" });

    // Initialize likes if it doesn't exist
    const likes = house.likes || 0;
    const likedBy = house.likedBy || [];
    
    const userLiked = userId ? likedBy.includes(userId) : false;

    res.json({ likes, userLiked });
  } catch (err) {
    console.error("❌ Error fetching house likes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Increment or decrement likes
export const toggleHouseLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // Expect userId from frontend

    // Validate userId
    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    const house = await Property.findById(id);
    if (!house) return res.status(404).json({ message: "House not found" });

    // Initialize likedBy and likes if they don't exist
    if (!house.likedBy) {
      house.likedBy = [];
    }
    if (!house.likes) {
      house.likes = 0;
    }

    const alreadyLiked = house.likedBy.includes(userId);
    
    if (alreadyLiked) {
      // Unlike
      house.likedBy = house.likedBy.filter(uid => uid.toString() !== userId);
      house.likes = Math.max(house.likes - 1, 0);
    } else {
      // Like
      house.likedBy.push(userId);
      house.likes = house.likes + 1;
    }

    await house.save();

    res.json({ likes: house.likes, userLiked: !alreadyLiked });
  } catch (err) {
    console.error("❌ Error toggling house like:", err);
    res.status(500).json({ message: "Server error" });
  }
};
