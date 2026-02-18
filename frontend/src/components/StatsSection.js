"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Building2, Users, CalendarCheck, Wallet, TrendingUp, Star } from "lucide-react";

export default function StatsSection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/api/stats/quick`);
        setStats(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [baseUrl]);

  if (loading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/20 rounded-lg p-4 h-20" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !stats) return null;

  const statItems = [
    {
      icon: Building2,
      label: "Properties",
      value: stats.properties || 0,
      suffix: "+",
    },
    {
      icon: CalendarCheck,
      label: "Bookings",
      value: stats.bookings || 0,
      suffix: "+",
    },
    {
      icon: Users,
      label: "Happy Users",
      value: stats.users || 0,
      suffix: "+",
    },
    {
      icon: Wallet,
      label: "Revenue",
      value: stats.formattedRevenue || "ETB 0",
      suffix: "",
    },
  ];

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Platform at a Glance</h2>
          <p className="text-blue-100">Trusted by thousands across Ethiopia</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="flex justify-center mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <item.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold mb-1">
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                {item.suffix}
              </div>
              <div className="text-sm text-blue-100">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Additional metrics row */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <TrendingUp className="w-4 h-4" />
            <span>Growing daily</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <Star className="w-4 h-4" />
            <span>Top rated platform</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <CalendarCheck className="w-4 h-4" />
            <span>24/7 Service</span>
          </div>
        </div>
      </div>
    </section>
  );
}
