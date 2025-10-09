import BirthdayBooking from "../models/Vipbirthday.js";

// POST /vip/birthday
export const createBirthdayBooking = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      date,
      guests,
      selectedServices,
      specialRequests,
      paymentMethod,
      totalAmount,
    } = req.body;

    if (
      !name ||
      !phone ||
      !email ||
      !date ||
      !guests ||
      !selectedServices ||
      !paymentMethod
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Parse selectedServices if it's stringified
    const services =
      typeof selectedServices === "string"
        ? JSON.parse(selectedServices)
        : selectedServices;

    const booking = new BirthdayBooking({
      name,
      phone,
      email,
      date,
      guests,
      selectedServices: services,
      specialRequests,
      paymentMethod,
      totalAmount,
    });

    await booking.save();

    return res.status(201).json({
      message: "🎉 Birthday booking created successfully",
      booking,
    });
  } catch (err) {
    console.error("Create booking error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// GET /vip/birthday
export const getAllBirthdayBookings = async (req, res) => {
  try {
    const bookings = await BirthdayBooking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /vip/birthday/:id
export const getBirthdayBookingById = async (req, res) => {
  try {
    const booking = await BirthdayBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH /vip/birthday/:id/status
export const updateBirthdayBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await BirthdayBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Status updated", booking });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
