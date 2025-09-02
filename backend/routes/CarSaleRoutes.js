import express from "express";
import { submitCarReservation } from "../controllers/CarSaleController.js";

const router = express.Router();

router.post("/", submitCarReservation);

export default router;
