import express from "express";
import multer from "multer";
import {
  createReservation,
  getReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
} from "../controllers/specialOfferReservationController.js";

const router = express.Router();

// ✅ File upload config (for payment evidence)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Routes
router.post("/", upload.single("paymentEvidence"), createReservation);
router.get("/", getReservations);
router.get("/:id", getReservationById);
router.put("/:id/status", updateReservationStatus);
router.delete("/:id", deleteReservation);

export default router;
