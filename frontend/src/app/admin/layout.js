"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toursOpen, setToursOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://bluenile.onrender.com";

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthorized(false);
        setAuthChecking(false);
        // Redirect to login if not on login page
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
        return;
      }

      try {
        // Verify token with backend
        await axios.get(`${baseUrl}/admin/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthorized(true);
      } catch (err) {
        console.error("Token verification failed:", err);
        localStorage.removeItem("token");
        setAuthorized(false);
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, [pathname, router, baseUrl]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthorized(false);
    router.push("/admin/login");
  };

  // Show loading while checking auth
  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show layout for login page
  if (pathname === "/admin/login") {
    return children;
  }

  // If not authorized and not on login page, don't render (redirect will happen)
  if (!authorized) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Static Cards", href: "/admin/static-cards" },
    { label: "Properties" },
    { label: "Property Rentals", href: "/admin/propertyrental" },
    { label: "Transport", href: "/admin/transport" },
    { label: "Sales", href: "/admin/sales" },
    { label: "Tours" },
    { label: "Users", href: "/admin/users" },
    { label: "Payments", href: "/admin/payments" },
    { label: "Cancellations", href: "/admin/cancellations" },
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
        <div className="p-6 font-bold text-xl border-b border-blue-600 flex justify-between items-center">
          <span>Admin Panel</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 px-2 py-1 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
        <nav className="mt-6 flex flex-col gap-2">
          {navItems.map((item) => {
            if (item.label === "Tours") {
              return (
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
              );
            }

            if (item.label === "Properties") {
              return (
                <div key="properties" className="flex flex-col">
                  <button
                    onClick={() => setPropertiesOpen(!propertiesOpen)}
                    className="px-4 py-2 hover:bg-blue-600 rounded text-left w-full"
                  >
                    {item.label}
                  </button>
                  {propertiesOpen && (
                    <div className="flex flex-col ml-4 mt-1 gap-1">
                      <Link
                        href="/admin/properties"
                        className="px-4 py-2 hover:bg-blue-500 rounded"
                      >
                        All Properties
                      </Link>
                      <Link
                        href="/admin/properties/specialoffer"
                        className="px-4 py-2 hover:bg-blue-500 rounded"
                      >
                        Special Offers
                      </Link>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 hover:bg-blue-600 rounded"
              >
                {item.label}
              </Link>
            );
          })}
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
