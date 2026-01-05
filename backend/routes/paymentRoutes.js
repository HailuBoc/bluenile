import express from "express";
import {
  createPayment,
  verifyPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

/**
 * @route POST /bookings/pay/:method
 * @desc Initialize payment (Chapa, Telebirr, M-Pesa)
 * @access Public
 */
router.post("/:method", createPayment);

/**
 * @route GET /bookings/pay/:method/verify/:bookingId
 * @desc Verify payment status (Chapa, Telebirr)
 * @access Public
 */
router.get("/:method/verify/:bookingId", verifyPayment);

/**
 * @route POST /bookings/pay/:method/verify/:bookingId
 * @desc Handle M-Pesa callback
 * @access Public
 */
router.post("/:method/verify/:bookingId", verifyPayment);

export default router;
