// routes/houseRoutes.js
import express from "express";
import {
  createHouseReservation,
  getHouseReservations,
} from "../controllers/houseController.js";

const router = express.Router();

// POST: new reservation
router.post("/reservations", createHouseReservation);

// GET: all reservations
router.get("/reservations", getHouseReservations);

export default router;
