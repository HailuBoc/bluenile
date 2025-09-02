import express from "express";
import {
  createBirthdayBooking,
  getBirthdayBookings,
} from "../controllers/birthdayController.js";
const router = express.Router();

router.post("/", createBirthdayBooking);
router.get("/", getBirthdayBookings);

export default router;
