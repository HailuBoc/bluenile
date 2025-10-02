"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import HousesCard from "./HousesCard";
import CarsCard from "./CarsCard";
import CarSalecard from "./CarSalecard";
import TourismCard from "./TourismCard";
import SpecialOfferCard from "./SpecialOfferCard";

export default function ProductsSection() {
  const [properties, setProperties] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // ✅ Fetch all properties
  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${baseUrl}/admin/properties`);
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.properties || [];

      const formattedData = data.map((item) => {
        let firstImage =
          Array.isArray(item.imageUrl) && item.imageUrl.length > 0
            ? item.imageUrl[0]
            : typeof item.imageUrl === "string"
            ? item.imageUrl
            : null;

        const imageSrc = firstImage
          ? firstImage.startsWith("http")
            ? firstImage
            : `${baseUrl}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
          : null;

        return { ...item, imageUrl: imageSrc };
      });

      setProperties(formattedData);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching properties:", err);
      setProperties([]);
      setError("Unable to fetch properties. Please try again later.");
    }
  };

  // ✅ Fetch admin-posted special offers
  const fetchSpecialOffers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/special-offers`);
      const data = Array.isArray(res.data) ? res.data : [];

      const formattedData = data
        .filter((offer) => offer.status === "approved") // show only approved offers
        .map((item) => {
          let firstImage =
            Array.isArray(item.imageUrl) && item.imageUrl.length > 0
              ? item.imageUrl[0]
              : typeof item.imageUrl === "string"
              ? item.imageUrl
              : null;

          const imageSrc = firstImage
            ? firstImage.startsWith("http")
              ? firstImage
              : `${baseUrl}${
                  firstImage.startsWith("/") ? "" : "/"
                }${firstImage}`
            : null;

          return { ...item, imageUrl: imageSrc };
        })
        // ✅ Sort offers by rating (high → low)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));

      setSpecialOffers(formattedData);
    } catch (err) {
      console.error("❌ Error fetching special offers:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchProperties(), fetchSpecialOffers()]);
      setLoading(false);
    };
    fetchData();

    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return <p className="text-center mt-10">Loading properties...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  // ✅ Filters for other sections
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

  const renderHorizontalScroll = (items, CardComponent) => (
    <div className="relative overflow-hidden">
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar py-2">
        {items.map((listing) => (
          <div
            key={listing._id}
            className="snap-start flex-shrink-0 w-60 relative"
          >
            <CardComponent {...listing} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="px-4 sm:px-6 pt-6 pb-24 bg-gray-100 dark:bg-gray-900">
      {/* ✅ Special Offers Section (from admin) */}
      {specialOffers.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl sm:text-3xl font-bold pb-6 mt-12 sm:mt-6 text-center text-yellow-700 dark:text-yellow-300">
            ✨ Top Rated Offers
          </h2>

          {/* 📱 Mobile: scrollable | 💻 Desktop: stays grid */}
          <div className="block lg:hidden">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar py-2">
              {specialOffers.slice(0, 3).map((offer) => (
                <div
                  key={offer._id}
                  className="snap-start flex-shrink-0 w-72 sm:w-80 md:w-96"
                >
                  <SpecialOfferCard {...offer} />
                </div>
              ))}
            </div>
          </div>

          {/* 💻 Desktop grid view stays the same */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
            {specialOffers.slice(0, 3).map((offer) => (
              <SpecialOfferCard key={offer._id} {...offer} />
            ))}
          </div>
        </div>
      )}

      {/* Other sections unchanged */}
      {popularStays.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg sm:text-2xl font-semibold pb-4 text-blue-800 dark:text-blue-200">
            🏨 Hotel Rooms
          </h2>

          {renderHorizontalScroll(popularStays, ProductCard)}
        </div>
      )}

      {carsForRent.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg sm:text-2xl font-semibold pb-4 text-blue-800 dark:text-blue-200">
            🔍 Cars for Rental
          </h2>
          {renderHorizontalScroll(carsForRent, CarsCard)}
        </div>
      )}

      {tourismSites.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg sm:text-2xl font-semibold pb-4 text-blue-800 dark:text-blue-200">
            🏞️ Tourism Sites in Ethiopia
          </h2>
          {renderHorizontalScroll(tourismSites, TourismCard)}
        </div>
      )}

      {housesForSale.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg sm:text-2xl font-semibold pb-4 text-blue-800 dark:text-blue-200">
            🏠 Houses for Sale
          </h2>
          {renderHorizontalScroll(housesForSale, HousesCard)}
        </div>
      )}

      {carsForSale.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg sm:text-2xl font-semibold pb-4 text-blue-800 dark:text-blue-200">
            🚗 Cars for Sale
          </h2>
          {renderHorizontalScroll(carsForSale, CarSalecard)}
        </div>
      )}
    </section>
  );
}
