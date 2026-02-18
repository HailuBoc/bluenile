import { Property } from "../models/propertyModel.js";
import Booking from "../models/AdminDashBooking.js";
import User from "../models/User.js";
import Transport from "../models/Transport.js";
import Tour from "../models/Tour.js";
import Sale from "../models/Sale.js";
import Cancellation from "../models/Cancellation.js";

export const getOverallStats = async (req, res) => {
  try {
    // Get property stats
    const totalProperties = await Property.countDocuments();
    const approvedProperties = await Property.countDocuments({
      status: "approved",
    });
    const pendingProperties = await Property.countDocuments({
      status: "pending",
    });

    // Get property breakdown by type
    const propertiesByType = await Property.aggregate([
      { $group: { _id: "$serviceType", count: { $sum: 1 } } },
    ]);

    // Get booking stats
    const totalBookings = await Booking.countDocuments();
    const verifiedBookings = await Booking.countDocuments({ verified: true });
    const pendingBookings = await Booking.countDocuments({ verified: false });

    // Calculate total revenue from verified bookings
    const revenueStats = await Booking.aggregate([
      { $match: { verified: true } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue =
      revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    // Get recent bookings (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentBookings = await Booking.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get user stats
    const totalUsers = await User.countDocuments();
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get transport count
    const totalTransports = await Transport.countDocuments();

    // Get tours count
    const totalTours = await Tour.countDocuments();

    // Get sales count
    const totalSales = await Sale.countDocuments();

    // Get cancellation stats
    const totalCancellations = await Cancellation.countDocuments();
    const pendingCancellations = await Cancellation.countDocuments({
      status: "pending",
    });

    // Calculate average rating
    const ratingStats = await Property.aggregate([
      { $match: { rating: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    const averageRating = ratingStats.length > 0 ? ratingStats[0].avgRating : 0;

    // Get booking trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const bookingTrends = await Booking.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      overview: {
        totalProperties,
        approvedProperties,
        pendingProperties,
        totalBookings,
        verifiedBookings,
        pendingBookings,
        totalUsers,
        totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10,
      },
      breakdown: {
        propertiesByType: propertiesByType.reduce((acc, item) => {
          acc[item._id || "other"] = item.count;
          return acc;
        }, {}),
        totalTransports,
        totalTours,
        totalSales,
        totalCancellations,
        pendingCancellations,
      },
      activity: {
        recentBookings,
        recentUsers,
        bookingTrends,
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error fetching overall stats:", err);
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: err.message,
    });
  }
};

// Get quick stats for public display (home page)
export const getQuickStats = async (req, res) => {
  try {
    const [approvedProperties, verifiedBookings, totalUsers, totalRevenue] =
      await Promise.all([
        Property.countDocuments({ status: "approved" }),
        Booking.countDocuments({ verified: true }),
        User.countDocuments(),
        Booking.aggregate([
          { $match: { verified: true } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
      ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    res.json({
      properties: approvedProperties,
      bookings: verifiedBookings,
      users: totalUsers,
      revenue,
      formattedRevenue: `ETB ${(revenue / 1000000).toFixed(1)}M+`,
    });
  } catch (err) {
    console.error("Error fetching quick stats:", err);
    res
      .status(500)
      .json({ message: "Error fetching stats", error: err.message });
  }
};
