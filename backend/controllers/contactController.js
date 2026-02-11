import Contact from "../models/Contact.js";

export const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Simple validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save to database
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    res.status(201).json({
      message: "Message sent successfully!",
      contact: newMessage,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
