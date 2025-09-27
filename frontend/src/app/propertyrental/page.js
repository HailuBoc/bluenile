"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Search } from "lucide-react";
import Link from "next/link";
import Footer from "../../components/Footer";

export default function PropertyRentalPage() {
  const [properties, setProperties] = useState([]);
  const [destination, setDestination] = useState("");
  const [propertyType, setPropertyType] = useState("");

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000";

  // ✅ Fetch approved rentals from backend
  const fetchProperties = async () => {
    try {
      const res = await fetch(`${backendUrl}/propertyrental`);
      const data = await res.json();

      // Filter only approved rentals and add full image URLs
      const approvedRentals = data
        .filter((p) => p.status === "approved")
        .map((item) => ({
          ...item,
          img: item.img ? `${backendUrl}/uploads/${item.img}` : null,
        }));

      setProperties(approvedRentals);
    } catch (err) {
      console.error("❌ Error fetching properties:", err);
      setProperties([]);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ✅ Filter properties by destination and type
  const filteredProperties = properties.filter(
    (property) =>
      (property.title.toLowerCase().includes(destination.toLowerCase()) ||
        property.location.toLowerCase().includes(destination.toLowerCase())) &&
      (propertyType
        ? property.type.toLowerCase() === propertyType.toLowerCase()
        : true)
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-10 sm:py-16 px-4 sm:px-8 text-center">
        <h1 className="text-2xl sm:text-5xl font-bold">
          Property Rentals & Bookings
        </h1>
        <p className="mt-2 sm:mt-4 text-sm sm:text-xl">
          Houses, apartments, guesthouses, hotel apartments — all in one place.
        </p>
      </header>

      <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        {/* Search Bar */}
        <h2 className="text-xl sm:text-3xl font-semibold mb-4 sm:mb-8 text-gray-800">
          Find Your Perfect Stay
        </h2>

        <div className="w-full max-w-5xl mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center border rounded-2xl shadow-lg px-4 sm:px-6 py-3 bg-white bg-opacity-90 gap-3 sm:gap-0">
            {/* Destination */}
            <div className="flex flex-col flex-1 sm:border-r border-gray-300 pr-0 sm:pr-4">
              <label className="text-xs text-gray-500 font-semibold">
                Where is your property?
              </label>
              <input
                type="text"
                placeholder="City, landmark, or address"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-transparent outline-none text-xs sm:text-sm text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Property Type */}
            <div className="flex flex-col flex-1 sm:border-r border-gray-300 pr-0 sm:pr-4">
              <label className="text-xs text-gray-500 font-semibold">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="bg-transparent outline-none text-xs sm:text-sm text-gray-700"
              >
                <option value="">Any</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Guesthouse">Guesthouse</option>
                <option value="Hotel Apartment">Hotel Apartment</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-center justify-center sm:pl-4">
              <button
                onClick={() =>
                  console.log("Searching:", { destination, propertyType })
                }
                className="flex items-center gap-1 bg-blue-600 text-white px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm hover:bg-blue-700 transition"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Property Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                {property.img ? (
                  <img
                    src={property.img}
                    alt={property.title}
                    className="w-full h-28 sm:h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-28 sm:h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <div className="p-3 sm:p-5">
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-800">
                    {property.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {property.type}
                  </p>

                  {/* Location with icon */}
                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                    {property.location}
                  </p>

                  <p className="text-blue-600 font-bold mt-1 sm:mt-2 text-sm sm:text-base">
                    {property.price}
                  </p>

                  {/* ✅ Navigate to booking page */}
                  <Link href={`/propertyrental/${property._id}`}>
                    <button className="mt-2 sm:mt-4 w-full bg-blue-600 text-white text-xs sm:text-sm py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition">
                      Book Now
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 mt-10">
              No rental properties found.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
