import express from "express";
import {
  getProductLikes,
  likeProduct,
} from "../controllers/productLikeController.js";

const router = express.Router();

// Get likes
router.get("/:id", getProductLikes);

// Toggle like
router.post("/:id/like", likeProduct);

export default router;
