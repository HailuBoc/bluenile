import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// Routes
import transportRoutes from "./routes/transportRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import weddingRoutes from "./routes/weddingRoutes.js";
import birthdayRoutes from "./routes/birthdays.js";
import graduationRoutes from "./routes/graduations.js";
import generalEventRoutes from "./routes/generalEvents.js";
import quoteRoutes from "./routes/quotes.js";
import saleRoutes from "./routes/saleRoutes.js";
import vipTourRoutes from "./routes/vipTourRoutes.js";
import tourBookingRoutes from "./routes/tourBookingRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";
import houseRoutes from "./routes/houseRoutes.js";
import testEmailRoutes from "./routes/testEmail.js";
import CarSaleRoutes from "./routes/CarSaleRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import tourismReservations from "./routes/tourismReservations.js";
import saleRoutesReserve from "./routes/saleRoutesReserve.js";
import houseLikeRoutes from "./routes/houseLikeRoutes.js";
import productLikeRoutes from "./routes/productLikeRoutes.js";
import tourismLikeRoutes from "./routes/tourismLikeRoutes.js";
import PropertyRentalRoutes from "./routes/propertyRentalRoutes.js";
import transportRoute from "./routes/transportRoute.js";
import salePostRoutes from "./routes/salePostRoutes.js";
import tours from "./routes/tours.js";
import vipPostRoutes from "./routes/vipPostRoutes.js";
import regularPostRoutes from "./routes/regularPostRoutes.js";
import specialOfferRoutes from "./routes/specialOfferRoutes.js";
import specialOfferReservationRoutes from "./routes/specialOfferReservationRoutes.js";
import cancellationRoutes from "./routes/cancellationRoutes.js";
import vipBirthdayRoutes from "./routes/vipBirthdayRoutes.js";
import vipGraduationRoutes from "./routes/vipGraduationRoutes.js";
import vipGeneralEventRoutes from "./routes/vipGeneralEventRoutes.js";
import vipWeddingRoutes from "./routes/vipWeddingRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 10000;

const app = express();

// --------------------
// Middleware
// --------------------

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/test", testEmailRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/propertyrentals", rentalRoutes);
app.use("/bookings/pay", paymentRoutes);
app.use("/general-events/pay", paymentRoutes);
app.use("/houses", houseRoutes);
app.use("/carsale/reservations", CarSaleRoutes);
app.use("/weddings", weddingRoutes);
app.use("/birthdays", birthdayRoutes);
app.use("/graduations", graduationRoutes);
app.use("/general-events", generalEventRoutes);
app.use("/quotes", quoteRoutes);
app.use("/products/reservations", productRoutes);
app.use("/rentalCars/reservations", rentalRoutes);
app.use("/tourism/reservations", tourismReservations);
app.use("/tour-bookings", tourBookingRoutes);
app.use("/transports", transportRoutes);
app.use("/sales", saleRoutes);
app.use("/vip-bookings", vipTourRoutes);
app.use("/properties", propertyRoutes);
app.use("/cars", carRoutes);
app.use("/sale", saleRoutesReserve);
app.use("/houselike", houseLikeRoutes);
app.use("/productlike", productLikeRoutes);
app.use("/tourismlike", tourismLikeRoutes);
app.use("/propertyrental", PropertyRentalRoutes);
app.use("/transportpost", transportRoute);
app.use("/salepost", salePostRoutes);
app.use("/api/tours", tours);
app.use("/vip-post", vipPostRoutes);
app.use("/regular-post", regularPostRoutes);
app.use("/api/special-offers", specialOfferRoutes);
app.use("/specialreservations", specialOfferReservationRoutes);
app.use("/cancellations", cancellationRoutes);
app.use("/vip/birthday", vipBirthdayRoutes);
app.use("/vip/graduation", vipGraduationRoutes);
app.use("/vip/generalevents", vipGeneralEventRoutes);
app.use("/vip/weddings", vipWeddingRoutes);

console.log("Mounted route: /specialreservations");

// Global error handler (JSON)
app.use((req, res, next) => {
  if (req.is("application/json")) {
    return express.json()(req, res, next);
  }
  next();
});

// --------- -----------
// MongoDB Connection with Retry
// --------------------
const connectWithRetry = async (retries = 5, delay = 5000) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(`❌ DB connection error: ${err.message}`);
    if (retries > 0) {
      console.log(
        `⏳ Retrying in ${delay / 1000}s... (${retries} retries left)`
      );
      setTimeout(() => connectWithRetry(retries - 1, delay), delay);
    } else {
      console.error(
        "💥 Failed to connect to MongoDB after multiple attempts. Exiting."
      );
      process.exit(1);
    }
  }
};

// Start connection
connectWithRetry();
