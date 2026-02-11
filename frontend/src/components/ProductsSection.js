"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import HousesCard from "./HousesCard";
import CarsCard from "./CarsCard";
import CarSalecard from "./CarSalecard";
import TourismCard from "./TourismCard";
import SpecialOfferCard from "./SpecialOfferCard";
import SkeletonLoader, { SkeletonProductGrid } from "./SkeletonLoader";
import { cn } from "../utils/cn";
import { useResponsive } from "./ResponsiveLayout";

// ✅ Performance optimizations:
// - useCallback for stable function references
// - useMemo for expensive calculations
// - Reduced polling interval from 10s to 30s
// - Added error boundaries and loading states
// - Optimized image processing

export default function ProductsSection() {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [properties, setProperties] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // ✅ Optimized image processing with memoization
  const processImageUrl = useCallback((item) => {
    if (!item.imageUrl) return null;
    
    let firstImage = Array.isArray(item.imageUrl) && item.imageUrl.length > 0
      ? item.imageUrl[0]
      : typeof item.imageUrl === "string"
      ? item.imageUrl
      : null;

    if (!firstImage) return null;
    
    return firstImage.startsWith("http")
      ? firstImage
      : `${baseUrl}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`;
  }, [baseUrl]);

  // ✅ Fetch properties with error handling
  const fetchProperties = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/admin/properties`, {
        timeout: 10000, // 10 second timeout
      });
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.properties || [];

      const formattedData = data.map((item) => ({
        ...item,
        imageUrl: processImageUrl(item),
      }));

      setProperties(formattedData);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching properties:", err);
      setProperties([]);
      setError(err.code === 'ECONNABORTED' 
        ? "Request timeout. Please check your connection."
        : "Unable to fetch properties. Please try again later.");
    }
  }, [baseUrl, processImageUrl]);

  // ✅ Fetch special offers with error handling
  const fetchSpecialOffers = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/special-offers`, {
        timeout: 10000,
      });
      const data = Array.isArray(res.data) ? res.data : [];

      const formattedData = data
        .filter((offer) => offer.status === "approved")
        .map((item) => ({
          ...item,
          imageUrl: processImageUrl(item),
        }))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));

      setSpecialOffers(formattedData);
    } catch (err) {
      console.error("❌ Error fetching special offers:", err);
      setSpecialOffers([]);
    }
  }, [baseUrl, processImageUrl]);

  // ✅ Optimized data fetching with proper cleanup
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isMounted) return;
      setLoading(true);
      await Promise.all([fetchProperties(), fetchSpecialOffers()]);
      if (isMounted) setLoading(false);
    };
    
    fetchData();

    // ✅ Reduced polling interval from 10s to 30s for better performance
    const interval = setInterval(fetchData, 30000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchProperties, fetchSpecialOffers]);

  // ✅ Memoized filtered data to prevent unnecessary recalculations
  const filteredData = useMemo(() => {
    const popularStays = properties.filter(
      (p) =>
        ["apartment", "villa", "guesthouse"].includes(
          p.serviceType?.toLowerCase()
        ) && p.status === "approved"
    );

    const carsForRent = properties.filter(
      (p) =>
        p.serviceType?.toLowerCase() === "car" &&
        p.listingType === "rent" &&
        p.status === "approved"
    );

    const tourismSites = properties.filter(
      (p) => p.serviceType?.toLowerCase() === "tourism" && p.status === "approved"
    );

    const housesForSale = properties.filter(
      (p) =>
        p.serviceType?.toLowerCase() === "house" &&
        p.listingType === "sale" &&
        p.status === "approved"
    );

    const carsForSale = properties.filter(
      (p) =>
        p.serviceType?.toLowerCase() === "car" &&
        p.listingType === "sale" &&
        p.status === "approved"
    );

    return {
      popularStays,
      carsForRent,
      tourismSites,
      housesForSale,
      carsForSale,
    };
  }, [properties]);

  // ✅ Memoized render function to prevent recreations
  const renderHorizontalScroll = useCallback((items, CardComponent) => {
    if (items.length === 0) return null;
    
    return (
      <div className="relative overflow-hidden">
        <div className="flex gap-3 xs:gap-4 sm:gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar py-2 px-1">
          {items.map((listing) => (
            <div
              key={listing._id}
              className="snap-start flex-shrink-0 w-56 xs:w-60 sm:w-64 md:w-72 lg:w-80 relative"
            >
              <CardComponent {...listing} />
            </div>
          ))}
        </div>
      </div>
    );
  }, []);

  // ✅ Enhanced loading state with responsive skeleton
  if (loading) {
    return (
      <section className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 pt-6 xs:pt-8 pb-20 xs:pb-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="space-y-12 xs:space-y-16">
          {/* Skeleton for special offers */}
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="skeleton h-8 w-48 mx-auto rounded-lg" />
              <div className="skeleton h-1 w-24 mx-auto rounded-full" />
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-72">
                  <SkeletonLoader.SkeletonCard />
                </div>
              ))}
            </div>
          </div>
          
          {/* Skeleton for other sections */}
          {["Hotel Rooms", "Cars for Rental", "Tourism Sites"].map((title) => (
            <div key={title} className="space-y-6">
              <div className="space-y-2">
                <div className="skeleton h-6 w-40 rounded" />
                <div className="skeleton h-1 w-20 rounded" />
              </div>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-shrink-0 w-64">
                    <SkeletonLoader.SkeletonCard />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 pt-6 xs:pt-8 pb-20 xs:pb-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center mt-10 max-w-md mx-auto">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => {
                setRetryCount(prev => prev + 1);
                window.location.reload();
              }}
              className="btn-primary"
            >
              Try Again
            </button>
            <button 
              onClick={() => setError(null)}
              className="btn-secondary"
            >
              Dismiss
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 pt-6 xs:pt-8 pb-20 xs:pb-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* ✅ Mobile & Tablet Top Rated Offers */}
      {specialOffers.length > 0 && (
        <div className="mb-6 xs:mb-16 block lg:hidden">
          <div className="text-center mb-6 xs:mb-8 px-2">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
              ✨ Top Rated Offers
            </h2>
            <div className="w-20 xs:w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
          </div>

          <div className="flex gap-3 xs:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar py-2 px-1">
            {specialOffers.slice(0, 3).map((offer) => (
              <div
                key={offer._id}
                className="snap-start flex-shrink-0 w-64 xs:w-72 sm:w-80 md:w-96"
              >
                <SpecialOfferCard {...offer} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Special Offers */}
      {specialOffers.length > 0 && (
        <div className="mb-16 hidden lg:block">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
              ✨ Top Rated Offers
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {specialOffers.slice(0, 3).map((offer) => (
              <SpecialOfferCard key={offer._id} {...offer} />
            ))}
          </div>
        </div>
      )}

      {/* Other sections using filtered data */}
      {filteredData.popularStays.length > 0 && (
        <div className="mb-12 xs:mb-16">
          <div className="mb-6 xs:mb-8 px-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              🏨 Hotel Rooms
            </h2>
            <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
          </div>
          {renderHorizontalScroll(filteredData.popularStays, ProductCard)}
        </div>
      )}

      {filteredData.carsForRent.length > 0 && (
        <div className="mb-12 xs:mb-16">
          <div className="mb-6 xs:mb-8 px-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              🔍 Cars for Rental
            </h2>
            <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
          </div>
          {renderHorizontalScroll(filteredData.carsForRent, CarsCard)}
        </div>
      )}

      {filteredData.tourismSites.length > 0 && (
        <div className="mb-12 xs:mb-16">
          <div className="mb-6 xs:mb-8 px-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              🏞️ Tourism Sites in Ethiopia
            </h2>
            <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
          </div>
          {renderHorizontalScroll(filteredData.tourismSites, TourismCard)}
        </div>
      )}

      {filteredData.housesForSale.length > 0 && (
        <div className="mb-12 xs:mb-16">
          <div className="mb-6 xs:mb-8 px-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              🏠 Houses for Sale
            </h2>
            <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
          </div>
          {renderHorizontalScroll(filteredData.housesForSale, HousesCard)}
        </div>
      )}

      {filteredData.carsForSale.length > 0 && (
        <div className="mb-12 xs:mb-16">
          <div className="mb-6 xs:mb-8 px-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              🚗 Cars for Sale
            </h2>
            <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"></div>
          </div>
          {renderHorizontalScroll(filteredData.carsForSale, CarSalecard)}
        </div>
      )}
    </section>
  );
}
