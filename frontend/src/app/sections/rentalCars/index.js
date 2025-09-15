"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CarCard from "../../../components/CarCard";
import Footer from "../../../components/Footer";

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = "http://localhost:10000";

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/admin/properties`); // fetch all cars
        setCars(res.data);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching cars:", err);
        setError("Failed to load cars.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-lg">Loading cars...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard
            key={car._id}
            _id={car._id}
            propertyName={car.carName}
            address={car.location}
            imageUrl={car.imageUrl}
            price={car.price}
            likes={car.likes || 0}
            guestFavorite={car.guestFavorite}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
}
