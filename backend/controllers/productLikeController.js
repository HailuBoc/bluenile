import Product from "../models/Product.js";
import { Property } from "../models/propertyModel.js";

// Get total likes
export const getProductLikes = async (req, res) => {
  try {
    const userId = req.query.userId;
    const product = await Property.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const userLiked = userId ? product.likedBy?.includes(userId) : false;

    res.json({ likes: product.likes || 0, userLiked });
  } catch (err) {
    console.error("❌ Failed to fetch product likes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Increment or decrement like count
export const likeProduct = async (req, res) => {
  try {
    const product = await Property.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Initialize likedBy if it doesn't exist
    if (!product.likedBy) {
      product.likedBy = [];
    }

    const alreadyLiked = product.likedBy.includes(userId);

    if (alreadyLiked) {
      // Unlike
      product.likedBy = product.likedBy.filter(uid => uid.toString() !== userId);
      product.likes = Math.max((product.likes || 1) - 1, 0);
    } else {
      // Like
      product.likedBy.push(userId);
      product.likes = (product.likes || 0) + 1;
    }

    await product.save();
    res.json({ likes: product.likes, userLiked: !alreadyLiked });
  } catch (err) {
    console.error("❌ Failed to toggle product like:", err);
    res.status(500).json({ message: "Server error" });
  }
};
