import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileUpload from "express-fileupload"; // ✅ ADD THIS

// Routes
import transportRoutes from "./routes/transportRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import weddingRoutes from "./routes/weddings.js";
import birthdayRoutes from "./routes/birthdays.js";
import graduationRoutes from "./routes/graduations.js";
import generalEventRoutes from "./routes/generalEvents.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import quoteRoutes from "./routes/quotes.js";
import saleRoutes from "./routes/saleRoutes.js";
import vipTourRoutes from "./routes/vipTourRoutes.js";
import tourBookingRoutes from "./routes/tourBookingRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";
import houseRoutes from "./routes/houseRoutes.js";
import testEmailRoutes from "./routes/testEmail.js";
import CarSaleRoutes from "./routes/CarSaleRoutes.js";

dotenv.config();
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "****" : "MISSING");
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// ✅ JSON + URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ File Upload Middleware (fix for Unexpected end of form)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    abortOnLimit: true,
  })
);

// Static folder for uploads
app.use("/uploads", express.static("uploads"));
app.use("/test", testEmailRoutes);
// Routes
app.use("/auth", authRoutes);
app.use("/properties", propertyRoutes);
app.use("/bookings", rentalRoutes);
app.use("/bookings/pay", paymentRoutes);
app.use("/general-events/pay", paymentRoutes);
app.use("/houses/reservations", houseRoutes);
app.use("/carsale/reservations", CarSaleRoutes);
// Event-specific routes
app.use("/weddings", weddingRoutes);
app.use("/birthdays", birthdayRoutes);
app.use("/graduations", graduationRoutes);
app.use("/general-events", generalEventRoutes);
app.use("/quotes", quoteRoutes);
app.use("/products/reservations", productRoutes);
app.use("/rentalCars/reservations", rentalRoutes);
app.use("/tour-bookings", tourBookingRoutes);
app.use("/transports", transportRoutes);

app.use("/sale", saleRoutes);
app.use("/vip-bookings", vipTourRoutes);
// MongoDB connection + start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  });
