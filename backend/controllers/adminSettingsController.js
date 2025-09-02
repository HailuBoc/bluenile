import AdminSettings from "../models/AdminSettings.js";

// Get settings
export const getSettings = async (req, res) => {
  try {
    const settings = await AdminSettings.findOne({});
    res.json({ settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const { basePrice, vipFee, chapaKey, telebirrKey, cbeKey } = req.body;
    let settings = await AdminSettings.findOne({});
    if (!settings) {
      settings = new AdminSettings({
        basePrice,
        vipFee,
        chapaKey,
        telebirrKey,
        cbeKey,
      });
    } else {
      settings.basePrice = basePrice;
      settings.vipFee = vipFee;
      settings.chapaKey = chapaKey;
      settings.telebirrKey = telebirrKey;
      settings.cbeKey = cbeKey;
    }
    await settings.save();
    res.json({ status: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
