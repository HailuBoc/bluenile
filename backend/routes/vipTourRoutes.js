import express from "express"; // ✅ Add this
import { createVipTourBooking } from "../controllers/vipTourController.js";

const router = express.Router();

// POST /vip-bookings
router.post("/", createVipTourBooking);

export default router;
