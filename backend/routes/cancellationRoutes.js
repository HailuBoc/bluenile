import express from "express";
import {
  createCancellation,
  getCancellations,
  approveCancellation,
  rejectCancellation,
  deleteCancellation,
} from "../controllers/cancellationController.js";

const router = express.Router();

// Public route to submit cancellation
router.post("/", createCancellation);

// Admin routes to manage cancellations
router.get("/", getCancellations);
router.put("/:id/approve", approveCancellation);
router.put("/:id/reject", rejectCancellation);
router.delete("/:id", deleteCancellation);

export default router;
