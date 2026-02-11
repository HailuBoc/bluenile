"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, MapPin, Home, BadgeDollarSign } from "lucide-react";
import { cn } from "../utils/cn";

export default function SaleCard({ sale, index }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <div className="card-interactive h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-2xl">
          {sale.image ? (
            <img
              src={`http://localhost:10000/uploads/${sale.image}`}
              alt={sale.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <Home className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          
          {/* Like Button */}
          <motion.button
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart 
              className={cn(
                "w-4 h-4 transition-colors duration-300",
                isLiked ? "text-red-500 fill-current" : "text-gray-600 dark:text-gray-400"
              )} 
            />
          </motion.button>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-lg">
              {sale.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {sale.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{sale.location}</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BadgeDollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
              <span className="text-xl font-bold text-yellow-600 dark:text-yellow-500">
                {sale.price}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <Link href={`/sales/${sale._id}`}>
            <motion.button
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Details
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
