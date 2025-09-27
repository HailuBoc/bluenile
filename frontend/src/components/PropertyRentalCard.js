"use client";

import React from "react";

export default function PropertyRentalCard({
  _id,
  title,
  type,
  location,
  price,
  img,
  status,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col">
      {img ? (
        <img
          src={img}
          alt={title}
          className="w-full h-40 object-cover rounded-2xl mb-3"
        />
      ) : (
        <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-2xl mb-3 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{type}</p>
      <p className="text-gray-600 dark:text-gray-300">{location}</p>
      <p className="font-semibold text-blue-700 dark:text-blue-400 mt-2">
        {price}
      </p>

      {status && (
        <span
          className={`mt-2 text-sm font-medium px-2 py-1 rounded-full ${
            status === "approved"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : status === "pending"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
          }`}
        >
          {status.toUpperCase()}
        </span>
      )}
    </div>
  );
}
