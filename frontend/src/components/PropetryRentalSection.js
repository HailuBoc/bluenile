"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import PropertyRentalCard from "./PropertyRentalCard"; // create similar to HousesCard/ProductCard

export default function PropertyRentalSection() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

  const fetchRentals = async () => {
    try {
      const res = await axios.get(`${baseUrl}/propertyrental`);
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.properties || [];

      // Only approved rental properties
      const approvedRentals = data
        .filter(
          (p) =>
            p.status === "approved" &&
            [
              "apartment",
              "house",
              "villa",
              "guesthouse",
              "hotel apartment",
            ].includes(p.type?.toLowerCase())
        )
        .map((item) => {
          let imgSrc = null;
          if (item.img) {
            imgSrc = item.img.startsWith("http")
              ? item.img
              : `${baseUrl}/uploads/${item.img}`;
          }
          return { ...item, img: imgSrc };
        });

      setRentals(approvedRentals);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching rentals:", err);
      setRentals([]);
      setError("Unable to fetch rental properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
    const interval = setInterval(fetchRentals, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center mt-10">Loading rentals...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

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
      {rentals.length > 0 ? (
        <div className="mb-10">
          <h2 className="text-lg sm:text-2xl font-semibold pb-4 text-blue-800 dark:text-blue-200">
            🏠 Property Rentals
          </h2>
          {renderHorizontalScroll(rentals, PropertyRentalCard)}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No approved rental properties found.
        </p>
      )}
    </section>
  );
}
