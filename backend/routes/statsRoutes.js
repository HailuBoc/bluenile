import express from "express";
import { getOverallStats, getQuickStats } from "../controllers/statsController.js";
import { adminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public endpoint for home page stats (no auth required)
router.get("/quick", getQuickStats);

// Admin dashboard stats (requires auth)
router.get("/dashboard", adminAuth, getOverallStats);

export default router;
