"use client";
import Link from "next/link";

export default function TransportCard({ vehicle }) {
  return (
    <Link
      href={`/transport/${vehicle._id}`}
      className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition block"
    >
      {vehicle.img && (
        <img
          src={`http://localhost:10000/uploads/${vehicle.img}`}
          alt={vehicle.title}
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
      )}
      <h3 className="text-lg font-bold text-gray-800 text-center">
        {vehicle.title}
      </h3>
      <p className="text-gray-600 text-center">{vehicle.description}</p>
      <p className="text-blue-600 font-semibold text-center mt-2">
        {vehicle.price}
      </p>
      <p className="text-sm text-gray-500 text-center">
        Capacity: {vehicle.capacity} passengers
      </p>
    </Link>
  );
}
