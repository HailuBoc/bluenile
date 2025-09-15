import express from "express";
import { getCarById, likeCar } from "../controllers/carController.js";

const router = express.Router();

router.get("/:id", getCarById); // Fetch car details
router.post("/like/:id", likeCar); // Increment likes

export default router;
