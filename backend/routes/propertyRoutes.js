import express from "express";
import {
  createProperty,
  getProperties,
} from "../controllers/propertyController.js";

const router = express.Router();

// POST new property
router.post("/", createProperty);

// GET all properties
router.get("/", getProperties);

export default router;
