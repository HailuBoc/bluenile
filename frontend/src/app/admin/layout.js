// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function AdminPage() {
//   const router = useRouter();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [toursOpen, setToursOpen] = useState(false);
//   const [propertiesOpen, setPropertiesOpen] = useState(false);
//   const [authorized, setAuthorized] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Login form state
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");

//   const baseUrl =
//     process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

//   // ✅ Check if token exists on page load
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) setAuthorized(true);
//   }, []);

//   // ✅ Handle Login using backend
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await axios.post(`${baseUrl}/admin/login`, {
//         email: form.email,
//         password: form.password,
//       });

//       // ✅ Save JWT token in localStorage
//       localStorage.setItem("token", res.data.token);
//       setAuthorized(true);
//     } catch (err) {
//       console.error("Login failed:", err);
//       setError(
//         err.response?.data?.message ||
//           "Invalid email or password. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Handle Logout
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setAuthorized(false);
//     setForm({ email: "", password: "" });
//   };

//   // ✅ If not logged in → show login form
//   if (!authorized) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <form
//           onSubmit={handleLogin}
//           className="bg-white shadow-lg p-8 rounded-lg w-80"
//         >
//           <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6">
//             Admin Login
//           </h2>

//           <div className="mb-4">
//             <label className="block text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               required
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               className="w-full p-2 border border-gray-300 rounded"
//               placeholder="Enter admin email"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 mb-1">Password</label>
//             <input
//               type="password"
//               required
//               value={form.password}
//               onChange={(e) => setForm({ ...form, password: e.target.value })}
//               className="w-full p-2 border border-gray-300 rounded"
//               placeholder="Enter admin password"
//             />
//           </div>

//           {error && (
//             <p className="text-red-500 text-sm text-center mb-3">{error}</p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 rounded text-white ${
//               loading ? "bg-blue-400" : "bg-blue-700 hover:bg-blue-800"
//             }`}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     );
//   }

//   // ✅ Logged-in dashboard view
//   const navItems = [
//     { label: "Properties" },
//     { label: "Property Rentals", href: "/admin/propertyrental" },
//     { label: "Transport", href: "/admin/transport" },
//     { label: "Sales", href: "/admin/sales" },
//     { label: "Tours" },
//     { label: "Users", href: "/admin/users" },
//     { label: "Payments", href: "/admin/payments" },
//     { label: "Cancellations", href: "/admin/cancellations" },
//     { label: "Settings", href: "/admin/settings" },
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside
//         className={`bg-blue-700 text-white w-64 flex-shrink-0 transition-transform ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-64"
//         }`}
//       >
//         <div className="p-6 font-bold text-xl border-b border-blue-600 flex justify-between items-center">
//           <span>Admin Panel</span>
//           <button
//             onClick={handleLogout}
//             className="text-sm bg-red-500 px-2 py-1 rounded hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </div>

//         <nav className="mt-6 flex flex-col gap-2">
//           {navItems.map((item) => {
//             if (item.label === "Tours") {
//               return (
//                 <div key="tours" className="flex flex-col">
//                   <button
//                     onClick={() => setToursOpen(!toursOpen)}
//                     className="px-4 py-2 hover:bg-blue-600 rounded text-left w-full"
//                   >
//                     {item.label}
//                   </button>
//                   {toursOpen && (
//                     <div className="flex flex-col ml-4 mt-1 gap-1">
//                       <Link
//                         href="/admin/tours/regulartour"
//                         className="px-4 py-2 hover:bg-blue-500 rounded"
//                       >
//                         Regular Tours
//                       </Link>
//                       <Link
//                         href="/admin/tours/viptour"
//                         className="px-4 py-2 hover:bg-blue-500 rounded"
//                       >
//                         VIP Tours
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               );
//             }

//             if (item.label === "Properties") {
//               return (
//                 <div key="properties" className="flex flex-col">
//                   <button
//                     onClick={() => setPropertiesOpen(!propertiesOpen)}
//                     className="px-4 py-2 hover:bg-blue-600 rounded text-left w-full"
//                   >
//                     {item.label}
//                   </button>
//                   {propertiesOpen && (
//                     <div className="flex flex-col ml-4 mt-1 gap-1">
//                       <Link
//                         href="/admin/properties"
//                         className="px-4 py-2 hover:bg-blue-500 rounded"
//                       >
//                         All Properties
//                       </Link>
//                       <Link
//                         href="/admin/properties/specialoffer"
//                         className="px-4 py-2 hover:bg-blue-500 rounded"
//                       >
//                         Special Offers
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               );
//             }

//             return (
//               <Link
//                 key={item.label}
//                 href={item.href}
//                 className="px-4 py-2 hover:bg-blue-600 rounded"
//               >
//                 {item.label}
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         <header className="bg-white shadow p-4 flex justify-between items-center">
//           <button
//             className="text-blue-700 font-bold md:hidden"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//           >
//             {sidebarOpen ? "Close" : "Menu"}
//           </button>
//           <h1 className="text-xl font-bold hidden md:block">Admin Dashboard</h1>
//         </header>

//         <main className="flex-1 p-6">
//           <h2 className="text-2xl font-semibold text-blue-700 mb-4">
//             Welcome to the Admin Dashboard
//           </h2>
//           <p className="text-gray-700">
//             Use the sidebar to manage Properties, Rentals, Sales, Tours, and
//             more.
//           </p>
//         </main>
//       </div>
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toursOpen, setToursOpen] = useState(false); // Toggle for nested Tours
  const [propertiesOpen, setPropertiesOpen] = useState(false); // Toggle for nested Properties

  const navItems = [
    { label: "Properties" }, // expandable
    { label: "Property Rentals", href: "/admin/propertyrental" },
    { label: "Transport", href: "/admin/transport" },
    { label: "Sales", href: "/admin/sales" },
    { label: "Tours" }, // expandable
    { label: "Users", href: "/admin/users" },
    { label: "Payments", href: "/admin/payments" },
    { label: "Cancellations", href: "/admin/cancellations" }, // ✅ new item
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
