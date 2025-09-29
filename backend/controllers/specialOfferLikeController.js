import SpecialOfferlike from "../models/SpecialOfferModel.js";

// ✅ Get likes
export const getSpecialOfferLikes = async (req, res) => {
  try {
    const offer = await SpecialOfferlike.findById(req.params.id);
    if (!offer)
      return res.status(404).json({ message: "Special offer not found" });

    res.json({ likes: offer.likes || 0 });
  } catch (err) {
    console.error("❌ Failed to fetch likes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Toggle like
export const likeSpecialOffer = async (req, res) => {
  try {
    const offer = await SpecialOfferlike.findById(req.params.id);
    if (!offer)
      return res.status(404).json({ message: "Special offer not found" });

    const { liked } = req.body; // true = increment, false = decrement
    offer.likes = liked ? offer.likes + 1 : Math.max(offer.likes - 1, 0);

    await offer.save();
    res.json({ likes: offer.likes });
  } catch (err) {
    console.error("❌ Failed to toggle like:", err);
    res.status(500).json({ message: "Server error" });
  }
};
