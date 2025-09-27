import express from "express";
import {
  getTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} from "../controllers/tourController.js";

const router = express.Router();

// Public routes
router.get("/", getTours);
router.get("/:id", getTourById);

// Admin routes (protect with auth middleware if needed)
router.post("/", createTour);
router.put("/:id", updateTour);
router.delete("/:id", deleteTour);

export default router;
