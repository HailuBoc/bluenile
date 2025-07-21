"use client";
import { useState } from "react";
import Link from "next/link";

const ProductCard = ({ img, title, desc, rating, price }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-[#111111] border border-gray-700 rounded-lg shadow-lg p-4 flex flex-col justify-between text-white transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl hover:border-green-500">
      <img
        src={img}
        alt={title}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-400 mb-2">{desc}</p>
      <p className="text-sm text-gray-300 mb-2">Rating: {rating} ⭐</p>
      <p className="text-sm text-green-400 mb-4">{price}</p>

      {/* Toggle More Info */}
      {showMore && (
        <div className="text-sm text-gray-400 mb-4">
          This subject is available from Monday to Friday. Click register for
          more options.
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => setShowMore(!showMore)}
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded transition text-sm"
        >
          {showMore ? "Hide Info" : "Click for More"}
        </button>

        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded transition text-sm">
          <Link href={"/register"}>Find Tutor</Link>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
