import { StaticCard } from "../models/StaticCard.js";

// Helper to process uploaded files and create image URLs
const processUploadedFiles = (files) => {
  if (!files || files.length === 0) return [];
  return files.map((file) => `/uploads/${file.filename}`);
};

// Create new static card with file upload support
export const createStaticCard = async (req, res) => {
  try {
    // Process uploaded images
    const uploadedImages = processUploadedFiles(req.files);

    // Parse JSON fields from form data
    const body = { ...req.body };

    // Parse arrays if they come as strings
    if (body.tags && typeof body.tags === "string") {
      body.tags = body.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    if (body.amenities && typeof body.amenities === "string") {
      body.amenities = body.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
    }
    if (body.features && typeof body.features === "string") {
      body.features = body.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
    }

    // Parse numbers
    const numericFields = [
      "price",
      "originalPrice",
      "rating",
      "reviewCount",
      "bedrooms",
      "bathrooms",
      "guests",
      "year",
      "mileage",
      "groupSize",
      "discount",
      "offerPrice",
      "priority",
      "displayOrder",
    ];
    numericFields.forEach((field) => {
      if (body[field] !== undefined && body[field] !== "") {
        body[field] = Number(body[field]);
      }
    });

    // Parse booleans
    body.isActive = body.isActive === "true" || body.isActive === true;

    const card = new StaticCard({
      ...body,
      imageUrl: uploadedImages,
      isApproved: false, // Requires admin approval
    });

    await card.save();
    res.status(201).json({ success: true, card });
  } catch (err) {
    console.error("Error creating static card:", err);
    res.status(500).json({
      success: false,
      message: "Error creating static card",
      error: err.message,
    });
  }
};

// Get all static cards (with filtering)
export const getStaticCards = async (req, res) => {
  try {
    const { cardType, isActive, isApproved } = req.query;
    const filter = {};

    if (cardType) filter.cardType = cardType;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (isApproved !== undefined) filter.isApproved = isApproved === "true";

    const cards = await StaticCard.find(filter).sort({
      displayOrder: 1,
      createdAt: -1,
    });
    res.json({ success: true, cards });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching static cards",
      error: err.message,
    });
  }
};

// Get public static cards (only approved and active)
export const getPublicStaticCards = async (req, res) => {
  try {
    const { cardType } = req.query;
    const filter = { isActive: true, isApproved: true };

    if (cardType) filter.cardType = cardType;

    const cards = await StaticCard.find(filter).sort({
      priority: -1,
      displayOrder: 1,
    });
    res.json({ success: true, cards });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching public static cards",
      error: err.message,
    });
  }
};

// Get single static card
export const getStaticCardById = async (req, res) => {
  try {
    const card = await StaticCard.findById(req.params.id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }
    res.json({ success: true, card });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching static card",
      error: err.message,
    });
  }
};

// Update static card with file upload support
export const updateStaticCard = async (req, res) => {
  try {
    // Process uploaded images
    const uploadedImages = processUploadedFiles(req.files);

    // Parse JSON fields from form data
    const body = { ...req.body };

    // Parse arrays if they come as strings
    if (body.tags && typeof body.tags === "string") {
      body.tags = body.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    if (body.amenities && typeof body.amenities === "string") {
      body.amenities = body.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
    }
    if (body.features && typeof body.features === "string") {
      body.features = body.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
    }

    // Parse numbers
    const numericFields = [
      "price",
      "originalPrice",
      "rating",
      "reviewCount",
      "bedrooms",
      "bathrooms",
      "guests",
      "year",
      "mileage",
      "groupSize",
      "discount",
      "offerPrice",
      "priority",
      "displayOrder",
    ];
    numericFields.forEach((field) => {
      if (body[field] !== undefined && body[field] !== "") {
        body[field] = Number(body[field]);
      }
    });

    // Parse booleans
    if (body.isActive !== undefined) {
      body.isActive = body.isActive === "true" || body.isActive === true;
    }

    // Build update data
    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    // Only update imageUrl if new files were uploaded
    if (uploadedImages.length > 0) {
      updateData.imageUrl = uploadedImages;
    }

    const card = await StaticCard.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    res.json({ success: true, card });
  } catch (err) {
    console.error("Error updating static card:", err);
    res.status(500).json({
      success: false,
      message: "Error updating static card",
      error: err.message,
    });
  }
};

// Delete static card
export const deleteStaticCard = async (req, res) => {
  try {
    const card = await StaticCard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }
    res.json({ success: true, message: "Card deleted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting static card",
      error: err.message,
    });
  }
};

// Approve static card
export const approveStaticCard = async (req, res) => {
  try {
    const card = await StaticCard.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, updatedAt: new Date() },
      { new: true },
    );
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }
    res.json({ success: true, card });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error approving static card",
      error: err.message,
    });
  }
};

// Toggle active status
export const toggleStaticCardStatus = async (req, res) => {
  try {
    const card = await StaticCard.findById(req.params.id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    card.isActive = !card.isActive;
    card.updatedAt = new Date();
    await card.save();

    res.json({ success: true, card });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error toggling card status",
      error: err.message,
    });
  }
};

// Get static cards by type (for public API with offline support)
export const getStaticCardsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const cards = await StaticCard.find({
      cardType: type,
      isActive: true,
      isApproved: true,
    }).sort({ priority: -1, displayOrder: 1 });

    res.json({ success: true, cards });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching static cards",
      error: err.message,
    });
  }
};

// Bulk update display order
export const updateDisplayOrder = async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, displayOrder }

    const updates = orders.map(({ id, displayOrder }) =>
      StaticCard.findByIdAndUpdate(id, { displayOrder }, { new: true }),
    );

    await Promise.all(updates);
    res.json({ success: true, message: "Display order updated" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating display order",
      error: err.message,
    });
  }
};
