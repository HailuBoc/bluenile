import ProductCard from "./ProductCard";
import listings from "./listingsData";

export default function ProductsSection() {
  const firstGroup = listings.slice(0, 6);
  const secondGroup = listings.slice(6, 12);

  return (
    <section className="px-3 sm:px-6 pt-4 sm:pt-6 pb-16 sm:pb-24 bg-gray-100 dark:bg-gray-900">
      {/* 🌟 Popular Stays */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-base sm:text-2xl font-semibold pb-3 sm:pb-4 text-blue-800 dark:text-blue-200">
          🌟 Popular Stays
        </h2>

        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {firstGroup.map((listing, index) => (
            <ProductCard key={index} {...listing} />
          ))}
        </div>

        {/* Mobile Scroll */}
        <div className="sm:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 -mx-3 px-3">
          {firstGroup.map((listing, index) => (
            <div key={index} className="snap-start flex-shrink-0 w-64">
              <ProductCard {...listing} />
            </div>
          ))}
        </div>
      </div>

      {/* 🔍 Cars for this week */}
      <div>
        <h2 className="text-base sm:text-2xl font-semibold pb-3 sm:pb-4 text-blue-800 dark:text-blue-200">
          🔍 Cars for this week
        </h2>

        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {secondGroup.map((listing, index) => (
            <ProductCard key={index + 6} {...listing} />
          ))}
        </div>

        {/* Mobile Scroll */}
        <div className="sm:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 -mx-3 px-3">
          {secondGroup.map((listing, index) => (
            <div key={index + 6} className="snap-start flex-shrink-0 w-64">
              <ProductCard {...listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
