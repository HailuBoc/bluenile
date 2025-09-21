import express from "express";
import {
  getTourismLikes,
  likeTourism,
} from "../controllers/tourismLikeController.js";

const router = express.Router();

// GET likes
router.get("/:id", getTourismLikes);

// POST toggle like
router.post("/:id/like", likeTourism);

export default router;
