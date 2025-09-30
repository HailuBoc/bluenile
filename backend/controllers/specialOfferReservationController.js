import SpecialOfferReservation from "../models/specialOfferReservation.js";

// ✅ Create a new reservation
export const createReservation = async (req, res) => {
  try {
    const {
      offerId,
      offerTitle,
      startDate,
      endDate,
      days,
      amount,
      name,
      email,
      phone,
      paymentMethod,
    } = req.body;

    const reservation = new SpecialOfferReservation({
      offerId,
      offerTitle,
      startDate,
      endDate,
      days,
      amount,
      name,
      email,
      phone,
      paymentMethod,
      paymentEvidence: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await reservation.save();

    res.status(201).json({ success: true, reservation });
  } catch (err) {
    console.error("❌ Reservation error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get all reservations (Admin)
export const getReservations = async (req, res) => {
  try {
    const reservations = await SpecialOfferReservation.find().sort({
      createdAt: -1,
    });
    res.json({ success: true, reservations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get reservation by ID
export const getReservationById = async (req, res) => {
  try {
    const reservation = await SpecialOfferReservation.findById(req.params.id);
    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    }
    res.json({ success: true, reservation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update reservation status (Admin)
export const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await SpecialOfferReservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    }

    res.json({ success: true, reservation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Delete reservation
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await SpecialOfferReservation.findByIdAndDelete(
      req.params.id
    );
    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    }
    res.json({ success: true, message: "Reservation deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
