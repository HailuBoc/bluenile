import express from "express";
import { submitHouseInterest } from "../controllers/houseController.js";
import { HouseInterest } from "../models/HouseInterest.js";

const router = express.Router();

// POST /api/houses -> submit interest
router.post("/", submitHouseInterest);

// GET /api/houses -> all houses
router.get("/", async (req, res) => {
  try {
    const houses = await HouseInterest.find();
    res.json(houses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/houses/:id -> single house
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const house = await HouseInterest.findById(id);
    if (!house) return res.status(404).json({ error: "House not found" });
    res.json(house);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
