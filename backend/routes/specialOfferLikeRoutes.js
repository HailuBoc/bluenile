import express from "express";
import {
  getSpecialOfferLikes,
  likeSpecialOffer,
} from "../controllers/specialOfferLikeController.js";

const router = express.Router();

// ✅ /api/special-offers/like/:id
router.get("/:id", getSpecialOfferLikes);
router.post("/:id", likeSpecialOffer);

export default router;
