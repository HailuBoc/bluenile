import express from "express";
import { submitHouseInterest } from "../controllers/houseController.js";

const router = express.Router();

// POST /houses/reservations
router.post("/", submitHouseInterest);

export default router;
