import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import compression from "compression";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
    
 
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
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 10001;

const app = express();

// --------------------
// ✅ Performance & Security Middleware
// --------------------

// Compression middleware for gzip
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  threshold: 1024,
}));

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS with performance optimization
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploads statically with caching headers
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"), {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.png') || path.endsWith('.jpeg')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
}));

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
app.use("/api/contact", contactRoutes);

console.log("Mounted route: /specialreservations");

// Global error handler (JSON)
app.use((req, res, next) => {
  if (req.is("application/json")) {
    return express.json()(req, res, next);
  }
  next();
});

// Optimized MongoDB Connection with Performance Settings
const connectWithRetry = async (retries = 5, delay = 5000) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Performance optimizations
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    console.log("Database connected successfully");
    
    // Enable performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error(`DB connection error: ${err.message}`);
    if (retries > 0) {
      console.log(
        `Retrying in ${delay / 1000}s... (${retries} retries left)`
      );
      setTimeout(() => connectWithRetry(retries - 1, delay), delay);
    } else {
      console.error(
        "Failed to connect to MongoDB after multiple attempts. Exiting."
      );
      process.exit(1);
    }
  }
};

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

// Start connection
connectWithRetry();
