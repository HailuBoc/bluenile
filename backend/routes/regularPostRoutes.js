import express from "express";
import {
  getTours,
  createTour,
  updateTour,
  deleteTour,
} from "../controllers/regularPostController.js";

const router = express.Router();

router.get("/", getTours);
router.post("/", createTour);
router.put("/:id", updateTour);
router.delete("/:id", deleteTour);

export default router;
