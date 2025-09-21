import { Property } from "../models/propertyModel.js";

// Get current likes for a tourism item
export const getTourismLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const tourismItem = await Property.findById(id);

    if (!tourismItem) {
      return res.status(404).json({ message: "Tourism item not found" });
    }

    res.json({
      likes: tourismItem.likes || 0,
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
    const { liked } = req.body;

    const tourismItem = await Property.findById(id);
    if (!tourismItem) {
      return res.status(404).json({ message: "Tourism item not found" });
    }

    // Increase or decrease like
    tourismItem.likes = liked
      ? (tourismItem.likes || 0) + 1
      : Math.max((tourismItem.likes || 0) - 1, 0);

    await tourismItem.save();

    res.json({ likes: tourismItem.likes });
  } catch (err) {
    console.error("Error toggling tourism like:", err);
    res.status(500).json({ message: "Server error" });
  }
};
