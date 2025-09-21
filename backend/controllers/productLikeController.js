import Product from "../models/Product.js";
import { Property } from "../models/propertyModel.js";

// Get total likes
export const getProductLikes = async (req, res) => {
  try {
    const product = await Property.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ likes: product.likes || 0 });
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

    const { liked } = req.body; // true = increment, false = decrement
    product.likes = liked ? product.likes + 1 : Math.max(product.likes - 1, 0);

    await product.save();
    res.json({ likes: product.likes });
  } catch (err) {
    console.error("❌ Failed to toggle product like:", err);
    res.status(500).json({ message: "Server error" });
  }
};
