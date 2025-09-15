import express from "express";
import { submitTourismReservation } from "../controllers/tourismReservationController.js";

const router = express.Router();
// save files locally temporarily

router.post("/", submitTourismReservation);

export default router;
