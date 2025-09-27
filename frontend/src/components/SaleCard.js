"use client";

import Link from "next/link";

export default function SaleCard({ sale }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition">
      {sale.image && (
        <div className="mb-4 flex justify-center">
          <img
            src={`http://localhost:10000/uploads/${sale.image}`}
            alt={sale.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 text-center">
        {sale.title}
      </h3>
      <p className="text-gray-500 text-center">{sale.category}</p>
      <p className="text-gray-500 text-sm text-center">{sale.location}</p>
      <p className="text-yellow-600 font-semibold text-center mt-3">
        {sale.price}
      </p>
      <Link href={`/sales/${sale._id}`}>
        <button className="mt-4 w-full bg-yellow-500 text-white py-2 sm:py-3 rounded-lg hover:bg-yellow-600 transition">
          Buy Now
        </button>
      </Link>
    </div>
  );
}
