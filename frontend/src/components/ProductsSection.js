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

      {/* Other sections */}
      {popularStays.length > 0 && (
        <div className="mb-12 xs:mb-16">
          <div className="mb-6 xs:mb-8 px-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              🏨 Hotel Rooms
            </h2>
            <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
          </div>
          {renderHorizontalScroll(popularStays, ProductCard)}
        </div>
      )}

      {carsForRent.length > 0 && (
        <div className="mb-12 xs:mb-16">
          <div className="mb-6 xs:mb-8 px-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              🔍 Cars for Rental
            </h2>
            <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
          </div>
          {renderHorizontalScroll(carsForRent, CarsCard)}
        </div>
      )}

      {tourismSites.length > 0 && (
        <div className="mb-12 xs:mb-16">
          <div className="mb-6 xs:mb-8 px-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              🏞️ Tourism Sites in Ethiopia
            </h2>
            <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
          </div>
          {renderHorizontalScroll(tourismSites, TourismCard)}
        </div>
      )}

      {housesForSale.length > 0 && (
        <div className="mb-12 xs:mb-16">
          <div className="mb-6 xs:mb-8 px-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              🏠 Houses for Sale
            </h2>
            <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
          </div>
          {renderHorizontalScroll(housesForSale, HousesCard)}
        </div>
      )}

      {carsForSale.length > 0 && (
        <div className="mb-12 xs:mb-16">
          <div className="mb-6 xs:mb-8 px-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              🚗 Cars for Sale
            </h2>
            <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"></div>
          </div>
          {renderHorizontalScroll(carsForSale, CarSalecard)}
        </div>
      )}
    </section>
  );
}
