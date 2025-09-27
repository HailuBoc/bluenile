"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SaleCard from "./SaleCard";

export default function SaleSection() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get("http://localhost:10000/salepost");
        setSales(res.data);
      } catch (err) {
        console.error("❌ Error fetching sales", err);
      }
    };
    fetchSales();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-gray-800 text-center">
        Featured Listings
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {sales.length > 0 ? (
          sales.map((sale, index) => (
            <SaleCard key={sale._id} sale={sale} index={index} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No listings available.
          </p>
        )}
      </div>
    </section>
  );
}
