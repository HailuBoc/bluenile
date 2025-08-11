import ProductCard from "./ProductCard";
import listings from "./listingsData";

export default function ProductsSection() {
  const firstGroup = listings.slice(0, 6);
  const secondGroup = listings.slice(6, 12);

  return (
    <section className="px-4 sm:px-6 pt-6 pb-24 bg-gray-100 dark:bg-gray-900">
      {/* 🌟 Popular Stays */}
      <div className="mb-10">
        <h2 className="text-lg sm:text-2xl font-semibold pb-4 text-blue-800 dark:text-blue-200">
          🌟 Popular Stays
        </h2>

        {/* Responsive Grid for Desktop */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {firstGroup.map((listing, index) => (
            <ProductCard key={index} {...listing} />
          ))}
        </div>

        {/* Horizontal Scroll for Mobile */}
        <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 -mx-4 px-4">
          {firstGroup.map((listing, index) => (
            <div key={index} className="snap-start flex-shrink-0 w-72">
              <ProductCard {...listing} />
            </div>
          ))}
        </div>
      </div>

      {/* 🔍 Homes for the next week */}
      <div>
        <h2 className="text-lg sm:text-2xl font-semibold pb-4 text-blue-800 dark:text-blue-200">
          🔍 Cars for the this week
        </h2>

        {/* Responsive Grid for Desktop */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {secondGroup.map((listing, index) => (
            <ProductCard key={index + 6} {...listing} />
          ))}
        </div>

        {/* Horizontal Scroll for Mobile */}
        <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 -mx-4 px-4">
          {secondGroup.map((listing, index) => (
            <div key={index + 6} className="snap-start flex-shrink-0 w-72">
              <ProductCard {...listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
