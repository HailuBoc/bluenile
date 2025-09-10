"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false); // <-- Only render if authorized
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
        await axios.get("http://localhost:10000/admin/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthorized(true); // token valid, allow rendering
      } catch (err) {
        localStorage.removeItem("token");
        router.push("/admin/login");
      }
    };

    verifyToken();
  }, [router]);

  // ----------------------------
  // Fetch all bookings
  // ----------------------------
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:10000/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.bookings);
      setFiltered(res.data.bookings);

      // Stats calculation
      const total = res.data.bookings.length;
      const verified = res.data.bookings.filter((b) => b.verified).length;
      const pending = total - verified;
      const revenue = res.data.bookings
        .filter((b) => b.verified)
        .reduce((sum, b) => sum + b.totalAmount, 0);
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
          b.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
          b.email.toLowerCase().includes(filters.search.toLowerCase())
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
        `http://localhost:10000/admin/verify/${id}`,
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
                      href={`http://localhost:10000/${b.document}`}
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
