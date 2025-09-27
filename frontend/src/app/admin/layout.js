"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toursOpen, setToursOpen] = useState(false); // Toggle for nested Tours

  const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Bookings", href: "/admin/bookings" },
    { label: "Properties", href: "/admin/properties" },
    { label: "Property Rentals", href: "/admin/propertyrental" },
    { label: "Transport", href: "/admin/transport" },
    { label: "Sales", href: "/admin/sales" },
    { label: "Tours", href: null }, // will handle nested links separately
    { label: "Users", href: "/admin/users" },
    { label: "Payments", href: "/admin/payments" },
    { label: "Settings", href: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-blue-700 text-white w-64 flex-shrink-0 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <div className="p-6 font-bold text-xl border-b border-blue-600">
          Admin Panel
        </div>
        <nav className="mt-6 flex flex-col gap-2">
          {navItems.map((item) =>
            item.label === "Tours" ? (
              <div key="tours" className="flex flex-col">
                <button
                  onClick={() => setToursOpen(!toursOpen)}
                  className="px-4 py-2 hover:bg-blue-600 rounded text-left w-full"
                >
                  {item.label}
                </button>
                {toursOpen && (
                  <div className="flex flex-col ml-4 mt-1 gap-1">
                    <Link
                      href="/admin/tours/regulartour"
                      className="px-4 py-2 hover:bg-blue-500 rounded"
                    >
                      Regular Tours
                    </Link>
                    <Link
                      href="/admin/tours/viptour"
                      className="px-4 py-2 hover:bg-blue-500 rounded"
                    >
                      VIP Tours
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 hover:bg-blue-600 rounded"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <button
            className="text-blue-700 font-bold md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Close" : "Menu"}
          </button>
          <h1 className="text-xl font-bold hidden md:block">Admin Dashboard</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
