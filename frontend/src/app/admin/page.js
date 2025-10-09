// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// export default function AdminPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [authorized, setAuthorized] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [toursOpen, setToursOpen] = useState(false);
//   const [propertiesOpen, setPropertiesOpen] = useState(false);

//   const [bookings, setBookings] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [stats, setStats] = useState({
//     total: 0,
//     verified: 0,
//     pending: 0,
//     revenue: 0,
//   });

//   const [filters, setFilters] = useState({
//     search: "",
//     paymentMethod: "",
//     date: "",
//   });

//   const [loginForm, setLoginForm] = useState({ email: "", password: "" });
//   const [loginError, setLoginError] = useState("");

//   const router = useRouter();
//   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

//   // ----------------------------
//   // Check if already logged in
//   // ----------------------------
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       verifyToken(token);
//     }
//   }, []);

//   const verifyToken = async (token) => {
//     try {
//       await axios.get(`${baseUrl}/admin/verify-token`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAuthorized(true);
//     } catch (err) {
//       localStorage.removeItem("token");
//       setAuthorized(false);
//     }
//   };

//   // ----------------------------
//   // Login handler
//   // ----------------------------
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setLoginError("");
//     try {
//       const res = await axios.post(`${baseUrl}/admin/login`, loginForm);
//       localStorage.setItem("token", res.data.token);
//       setAuthorized(true);
//     } catch (err) {
//       setLoginError(
//         err.response?.data?.message || "Invalid credentials. Try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ----------------------------
//   // Fetch all bookings
//   // ----------------------------
//   const fetchBookings = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${baseUrl}/admin`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const allBookings = res.data.bookings || [];
//       setBookings(allBookings);
//       setFiltered(allBookings);

//       const total = allBookings.length;
//       const verified = allBookings.filter((b) => b.verified).length;
//       const pending = total - verified;
//       const revenue = allBookings
//         .filter((b) => b.verified)
//         .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

//       setStats({ total, verified, pending, revenue });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (authorized) fetchBookings();
//   }, [authorized]);

//   // ----------------------------
//   // Filter bookings
//   // ----------------------------
//   useEffect(() => {
//     let temp = [...bookings];
//     if (filters.search) {
//       temp = temp.filter(
//         (b) =>
//           (b.fullName || "")
//             .toLowerCase()
//             .includes(filters.search.toLowerCase()) ||
//           (b.email || "").toLowerCase().includes(filters.search.toLowerCase())
//       );
//     }
//     if (filters.paymentMethod) {
//       temp = temp.filter((b) => b.paymentMethod === filters.paymentMethod);
//     }
//     if (filters.date) {
//       temp = temp.filter(
//         (b) =>
//           new Date(b.tourDate).toDateString() ===
//           new Date(filters.date).toDateString()
//       );
//     }
//     setFiltered(temp);
//   }, [filters, bookings]);

//   // ----------------------------
//   // Verify bookings
//   // ----------------------------
//   const handleVerify = async (id, approved) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `${baseUrl}/admin/verify/${id}`,
//         { verified: approved },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchBookings();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ----------------------------
//   // Logout
//   // ----------------------------
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setAuthorized(false);
//   };

//   // ----------------------------
//   // LOGIN PAGE
//   // ----------------------------
//   if (!authorized) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <form
//           onSubmit={handleLogin}
//           className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
//         >
//           <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
//             Admin Login
//           </h2>

//           <input
//             type="email"
//             placeholder="Email"
//             value={loginForm.email}
//             onChange={(e) =>
//               setLoginForm({ ...loginForm, email: e.target.value })
//             }
//             className="w-full px-4 py-2 border rounded mb-4"
//             required
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={loginForm.password}
//             onChange={(e) =>
//               setLoginForm({ ...loginForm, password: e.target.value })
//             }
//             className="w-full px-4 py-2 border rounded mb-4"
//             required
//           />

//           {loginError && (
//             <p className="text-red-600 text-sm mb-4 text-center">
//               {loginError}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     );
//   }

//   // ----------------------------
//   // DASHBOARD + LAYOUT
//   // ----------------------------
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

//       {/* Main content */}
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

//         {/* Dashboard Content */}
//         <main className="flex-1 p-6">
//           {loading ? (
//             <p className="text-center mt-10 text-gray-700">Loading...</p>
//           ) : (
//             <>
//               {/* Stats */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                 <div className="bg-white rounded-lg shadow p-4 text-center">
//                   <p className="text-gray-500">Total Bookings</p>
//                   <p className="text-2xl font-bold">{stats.total}</p>
//                 </div>
//                 <div className="bg-white rounded-lg shadow p-4 text-center">
//                   <p className="text-gray-500">Verified</p>
//                   <p className="text-2xl font-bold text-green-600">
//                     {stats.verified}
//                   </p>
//                 </div>
//                 <div className="bg-white rounded-lg shadow p-4 text-center">
//                   <p className="text-gray-500">Pending</p>
//                   <p className="text-2xl font-bold text-yellow-600">
//                     {stats.pending}
//                   </p>
//                 </div>
//                 <div className="bg-white rounded-lg shadow p-4 text-center">
//                   <p className="text-gray-500">Revenue (ETB)</p>
//                   <p className="text-2xl font-bold text-blue-600">
//                     {stats.revenue}
//                   </p>
//                 </div>
//               </div>

//               {/* Filters */}
//               <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
//                 <input
//                   type="text"
//                   placeholder="Search by name or email"
//                   value={filters.search}
//                   onChange={(e) =>
//                     setFilters({ ...filters, search: e.target.value })
//                   }
//                   className="px-4 py-2 border rounded w-full md:w-1/3"
//                 />
//                 <select
//                   value={filters.paymentMethod}
//                   onChange={(e) =>
//                     setFilters({ ...filters, paymentMethod: e.target.value })
//                   }
//                   className="px-4 py-2 border rounded w-full md:w-1/4"
//                 >
//                   <option value="">All Payment Methods</option>
//                   <option value="Chapa">Chapa</option>
//                   <option value="Telebirr">Telebirr</option>
//                   <option value="CBE Birr">CBE Birr</option>
//                 </select>
//                 <input
//                   type="date"
//                   value={filters.date}
//                   onChange={(e) =>
//                     setFilters({ ...filters, date: e.target.value })
//                   }
//                   className="px-4 py-2 border rounded w-full md:w-1/4"
//                 />
//               </div>

//               {/* Bookings Table */}
//               <div className="bg-white rounded-lg shadow overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       {[
//                         "Name",
//                         "Email",
//                         "Phone",
//                         "Tour Date",
//                         "Payment",
//                         "Amount",
//                         "Verified",
//                         "Document",
//                         "Actions",
//                       ].map((header) => (
//                         <th
//                           key={header}
//                           className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                         >
//                           {header}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filtered.map((b) => (
//                       <tr key={b._id}>
//                         <td className="px-4 py-2">{b.fullName}</td>
//                         <td className="px-4 py-2">{b.email}</td>
//                         <td className="px-4 py-2">{b.phone}</td>
//                         <td className="px-4 py-2">
//                           {new Date(b.tourDate).toLocaleDateString()}
//                         </td>
//                         <td className="px-4 py-2">{b.paymentMethod}</td>
//                         <td className="px-4 py-2">{b.totalAmount} ETB</td>
//                         <td className="px-4 py-2">
//                           {b.verified ? (
//                             <span className="text-green-600 font-semibold">
//                               Verified
//                             </span>
//                           ) : (
//                             <span className="text-yellow-600 font-semibold">
//                               Pending
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-4 py-2">
//                           {b.document ? (
//                             <a
//                               href={`${baseUrl}/${b.document}`}
//                               target="_blank"
//                               className="text-blue-500 underline"
//                             >
//                               View
//                             </a>
//                           ) : (
//                             "-"
//                           )}
//                         </td>
//                         <td className="px-4 py-2 flex gap-2">
//                           {!b.verified && (
//                             <>
//                               <button
//                                 onClick={() => handleVerify(b._id, true)}
//                                 className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                               >
//                                 Approve
//                               </button>
//                               <button
//                                 onClick={() => handleVerify(b._id, false)}
//                                 className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                               >
//                                 Reject
//                               </button>
//                             </>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    revenue: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    paymentMethod: "",
    date: "",
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // ----------------------------
  // Check authentication
  // ----------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const verifyToken = async () => {
      try {
        await axios.get(`${baseUrl}/admin/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthorized(true);
      } catch (err) {
        localStorage.removeItem("token");
        router.push("/admin/login");
      }
    };

    verifyToken();
  }, [router, baseUrl]);

  // ----------------------------
  // Fetch all bookings
  // ----------------------------
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allBookings = res.data.bookings || [];
      setBookings(allBookings);
      setFiltered(allBookings);

      // Stats calculation
      const total = allBookings.length;
      const verified = allBookings.filter((b) => b.verified).length;
      const pending = total - verified;
      const revenue = allBookings
        .filter((b) => b.verified)
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      setStats({ total, verified, pending, revenue });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        router.push("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) fetchBookings();
  }, [authorized]);

  // ----------------------------
  // Filter bookings
  // ----------------------------
  useEffect(() => {
    let temp = [...bookings];

    if (filters.search) {
      temp = temp.filter(
        (b) =>
          (b.fullName || "")
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          (b.email || "").toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.paymentMethod) {
      temp = temp.filter((b) => b.paymentMethod === filters.paymentMethod);
    }

    if (filters.date) {
      temp = temp.filter(
        (b) =>
          new Date(b.tourDate).toDateString() ===
          new Date(filters.date).toDateString()
      );
    }

    setFiltered(temp);
  }, [filters, bookings]);

  // ----------------------------
  // Verify bookings
  // ----------------------------
  const handleVerify = async (id, approved) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseUrl}/admin/verify/${id}`,
        { verified: approved },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  if (!authorized)
    return (
      <p className="text-center mt-10 text-gray-700">Checking access...</p>
    );

  if (loading)
    return <p className="text-center mt-10 text-gray-700">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-500">Verified</p>
          <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-500">Revenue (ETB)</p>
          <p className="text-2xl font-bold text-blue-600">{stats.revenue}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search by name or email"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="px-4 py-2 border rounded w-full md:w-1/3"
        />
        <select
          value={filters.paymentMethod}
          onChange={(e) =>
            setFilters({ ...filters, paymentMethod: e.target.value })
          }
          className="px-4 py-2 border rounded w-full md:w-1/4"
        >
          <option value="">All Payment Methods</option>
          <option value="Chapa">Chapa</option>
          <option value="Telebirr">Telebirr</option>
          <option value="CBE Birr">CBE Birr</option>
        </select>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="px-4 py-2 border rounded w-full md:w-1/4"
        />
      </div>

      {/* Booking Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Name",
                "Email",
                "Phone",
                "Tour Date",
                "Payment",
                "Amount",
                "Verified",
                "Document",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((b) => (
              <tr key={b._id}>
                <td className="px-4 py-2">{b.fullName}</td>
                <td className="px-4 py-2">{b.email}</td>
                <td className="px-4 py-2">{b.phone}</td>
                <td className="px-4 py-2">
                  {new Date(b.tourDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{b.paymentMethod}</td>
                <td className="px-4 py-2">{b.totalAmount} ETB</td>
                <td className="px-4 py-2">
                  {b.verified ? (
                    <span className="text-green-600 font-semibold">
                      Verified
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {b.document ? (
                    <a
                      href={`${baseUrl}/${b.document}`}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  {!b.verified && (
                    <>
                      <button
                        onClick={() => handleVerify(b._id, true)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerify(b._id, false)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
