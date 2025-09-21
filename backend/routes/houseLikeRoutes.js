import express from "express";
import {
  getHouseLikes,
  toggleHouseLike,
} from "../controllers/houseLikeController.js";

const router = express.Router();

// GET total likes
router.get("/:id", getHouseLikes);

// POST like/unlike
router.post("/:id/like", toggleHouseLike);

export default router;
