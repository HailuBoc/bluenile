// routes/specialReservationRoutes.js
import express from "express";
import multer from "multer";
import {
  createSpecialReservation,
  listSpecialReservations,
} from "../controllers/specialOfferReservationController.js";

const router = express.Router();

// multer saves to uploads/ by default - keep it simple
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

router.post("/", upload.single("paymentEvidence"), createSpecialReservation);

// helpful GET for quick test
router.get("/", listSpecialReservations);

export default router;
