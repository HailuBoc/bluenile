import express from "express";
import { createVipTourBooking } from "../controllers/vipTourController.js";

const router = express.Router();

// POST /vip-bookings
router.post("/", createVipTourBooking);

export default router;
