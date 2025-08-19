"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import listings from "../../../components/listingsData";
import { Star, Heart } from "lucide-react";
import Link from "next/link";
import Footer from "../../../components/Footer";
import HousesCard from "../../../components/HousesCard";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get("id");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (idParam) {
      const product = listings.find((p) => p.id === parseInt(idParam));
      setSelectedProduct(product || null);
      setLiked(false);
    } else {
      setSelectedProduct(null);
    }
  }, [idParam]);

  // Single product detail page
  if (selectedProduct) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <main className="flex-grow p-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left side - Image */}
            <div className="md:w-1/2 relative rounded-xl overflow-hidden shadow-lg">
              <img
                src={selectedProduct.img}
                alt={selectedProduct.title}
                className="w-full h-full object-cover rounded-xl"
                style={{ minHeight: "400px" }}
              />
              <button
                onClick={() => setLiked(!liked)}
                className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow"
                aria-pressed={liked}
                aria-label={liked ? "Unlike product" : "Like product"}
              >
                <Heart
                  className={`w-6 h-6 ${
                    liked ? "text-red-500 fill-red-500" : "text-gray-500"
                  }`}
                />
              </button>
              {selectedProduct.guestFavorite && (
                <div className="absolute top-4 left-4 text-sm bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-white px-3 py-1 rounded-full shadow">
                  Guest Favorite
                </div>
              )}
            </div>

            {/* Right side - Details */}
            <div className="md:w-1/2 flex flex-col justify-start">
              <h1 className="text-3xl font-bold mb-2">
                {selectedProduct.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {selectedProduct.location}
              </p>
              <div className="flex items-center mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="ml-1">{selectedProduct.rating}</span>
              </div>
              <div className="text-xl font-semibold mb-4">
                {selectedProduct.price}
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              <Link
                href={`/sections/houses/reserveHouse?id=${selectedProduct.id}`}
              >
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
                >
                  Buy Now
                </button>
              </Link>
            </div>
          </div>
        </main>

        {/* Footer always visible */}
        <Footer />
      </div>
    );
  }

  // All products grid view
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <section className="flex-grow px-2 sm:px-6 pt-6 pb-24">
        <h2 className="text-base sm:text-2xl font-semibold pb-4 text-blue-800 dark:text-blue-200 max-w-6xl mx-auto">
          All Stays
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6 max-w-6xl mx-auto">
          {listings.map((listing) => (
            <div key={listing.id} className="transform scale-75 sm:scale-100">
              <HousesCard {...listing} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer always visible */}
      <Footer />
    </div>
  );
}
