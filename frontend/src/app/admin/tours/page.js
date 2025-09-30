"use client";

import Link from "next/link";

export default function ToursPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Tours Management</h1>
      <p className="text-gray-600 mb-8">
        Choose which type of tours you want to manage:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* VIP Tours */}
        <Link
          href="/admin/Tours/viptour"
          className="block bg-blue-600 text-white text-center py-6 rounded-xl shadow hover:bg-blue-700 transition"
        >
          Manage VIP Tours
        </Link>

        {/* Regular Tours */}
        <Link
          href="/admin/Tours/regulartour"
          className="block bg-green-600 text-white text-center py-6 rounded-xl shadow hover:bg-green-700 transition"
        >
          Manage Regular Tours
        </Link>
      </div>
    </div>
  );
}
