import express from "express";
import { getCarById, toggleLikeCar } from "../controllers/carController.js";

const router = express.Router();

// Fetch car details
router.get("/:id", getCarById);

// ✅ Toggle like/unlike (frontend sends { liked: true/false })
router.post("/:id/like", toggleLikeCar);

export default router;
