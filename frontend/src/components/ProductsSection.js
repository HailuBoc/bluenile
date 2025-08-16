"use client";
import ProductCard from "./ProductCard";
import listings from "./listingsData";
import HousesCard from "./HousesCard";
import CarsCard from "./CarsCard";

export default function ProductsSection() {
  const firstGroup = listings.slice(0, 6); // Popular Stays
  const secondGroup = listings.slice(6, 12); // Cars for Rental
  const thirdGroup = listings.slice(12, 18); // Tourism Sites
  const fourthGroup = listings.slice(18, 24); // Houses for Sale
  const fifthGroup = listings.slice(24, 30); // Cars for Sale ✅ new

  return (
    <section className="px-4 sm:px-6 pt-6 pb-24 bg-gray-100 dark:bg-gray-900">
      {/* 🌟 Popular Stays */}
      <div className="mb-10">
        <h2 className="text-lg sm:text-2xl font-semibold pb-4 text-blue-800 dark:text-blue-200">
          🌟 Popular Stays
        </h2>
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {firstGroup.map((listing, index) => (
            <ProductCard key={index} {...listing} />
          ))}
        </div>
        <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 -mx-4 px-4 scrollbar-hide">
          {firstGroup.map((listing, index) => (
            <div key={index} className="snap-start flex-shrink-0 w-72">
              <ProductCard {...listing} />
            </div>
          ))}
        </div>
      </div>

      {/* 🔍 Cars for Rental */}
      <div className="mb-10">
        <h2 className="text-lg sm:text-2xl font-semibold pb-4 text-blue-800 dark:text-blue-200">
          🔍 Cars for Rental
        </h2>
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {secondGroup.map((listing, index) => (
            <ProductCard key={index + 6} {...listing} />
          ))}
        </div>
        <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 -mx-4 px-4 scrollbar-hide">
          {secondGroup.map((listing, index) => (
            <div key={index + 6} className="snap-start flex-shrink-0 w-72">
              <ProductCard {...listing} />
            </div>
          ))}
        </div>
      </div>

      {/* 🏞️ Tourism Sites */}
      <div className="mb-10">
        <h2 className="text-lg sm:text-2xl font-semibold pb-4 text-blue-800 dark:text-blue-200">
          🏞️ Tourism Sites in Ethiopia
        </h2>
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {thirdGroup.map((listing, index) => (
            <ProductCard key={index + 12} {...listing} />
          ))}
        </div>
        <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 -mx-4 px-4 scrollbar-hide">
          {thirdGroup.map((listing, index) => (
            <div key={index + 12} className="snap-start flex-shrink-0 w-72">
              <ProductCard {...listing} />
            </div>
          ))}
        </div>
      </div>

      {/* 🏠 Houses for Sale */}
      <div className="mb-10">
        <h2 className="text-lg sm:text-2xl font-semibold pb-4 text-blue-800 dark:text-blue-200">
          🏠 Houses for Sale
        </h2>
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {fourthGroup.map((listing, index) => (
            <HousesCard key={index + 18} {...listing} />
          ))}
        </div>
        <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 -mx-4 px-4 scrollbar-hide">
          {fourthGroup.map((listing, index) => (
            <div key={index + 18} className="snap-start flex-shrink-0 w-72">
              <HousesCard {...listing} />
            </div>
          ))}
        </div>
      </div>

      {/* 🚗 Cars for Sale */}
      <div>
        <h2 className="text-lg sm:text-2xl font-semibold pb-4 text-blue-800 dark:text-blue-200">
          🚗 Cars for Sale
        </h2>
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {fifthGroup.map((listing, index) => (
            <CarsCard key={index + 24} {...listing} />
          ))}
        </div>
        <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 -mx-4 px-4 scrollbar-hide">
          {fifthGroup.map((listing, index) => (
            <div key={index + 24} className="snap-start flex-shrink-0 w-72">
              <CarsCard {...listing} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
