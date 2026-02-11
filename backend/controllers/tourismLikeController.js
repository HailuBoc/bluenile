import { Property } from "../models/propertyModel.js";

// Get current likes for a tourism item
export const getTourismLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;
    
    const tourismItem = await Property.findById(id);

    if (!tourismItem) {
      return res.status(404).json({ message: "Tourism item not found" });
    }

    const userLiked = userId ? tourismItem.likedBy?.includes(userId) : false;

    res.json({
      likes: tourismItem.likes || 0,
      userLiked
    });
  } catch (err) {
    console.error("Error fetching tourism likes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle like for a tourism item
export const likeTourism = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const tourismItem = await Property.findById(id);
    if (!tourismItem) {
      return res.status(404).json({ message: "Tourism item not found" });
    }

    // Initialize likedBy
    if (!tourismItem.likedBy) tourismItem.likedBy = [];

    const alreadyLiked = tourismItem.likedBy.includes(userId);

    if (alreadyLiked) {
      tourismItem.likedBy = tourismItem.likedBy.filter(uid => uid.toString() !== userId);
      tourismItem.likes = Math.max((tourismItem.likes || 1) - 1, 0);
    } else {
      tourismItem.likedBy.push(userId);
      tourismItem.likes = (tourismItem.likes || 0) + 1;
    }

    await tourismItem.save();

    res.json({ likes: tourismItem.likes, userLiked: !alreadyLiked });
  } catch (err) {
    console.error("Error toggling tourism like:", err);
    res.status(500).json({ message: "Server error" });
  }
};
