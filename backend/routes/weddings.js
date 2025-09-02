// routes/weddings.js
import express from "express";
import {
  createWedding,
  getWeddingBookings,
  initChapaPayment,
} from "../controllers/weddingBookingController.js";

const router = express.Router();

router.post("/", createWedding);
router.get("/", getWeddingBookings);
router.post("/pay/chapa", initChapaPayment);

export default router;
