"use client";

import { useState, useMemo } from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { useAdminBookings, useVerifyBooking } from "../../lib/api";
import { StatsSkeleton, TableSkeleton } from "../../components/skeletons";

export default function AdminDashboard() {
  const { authorized } = useAdminAuth();
  const { data, error, isLoading, mutate } = useAdminBookings();
  const { trigger: verifyBooking } = useVerifyBooking();

  const [filters, setFilters] = useState({
    search: "",
    paymentMethod: "",
    date: "",
  });

  // Calculate stats from bookings data
  const stats = useMemo(() => {
    const bookings = data?.bookings || [];
    const total = bookings.length;
    const verified = bookings.filter((b) => b.verified).length;
    const pending = total - verified;
    const revenue = bookings
      .filter((b) => b.verified)
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    return { total, verified, pending, revenue };
  }, [data]);

  // Filter bookings
  const filtered = useMemo(() => {
    let temp = [...(data?.bookings || [])];

    if (filters.search) {
      temp = temp.filter(
        (b) =>
          (b.fullName || "")
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          (b.email || "").toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    if (filters.paymentMethod) {
      temp = temp.filter((b) => b.paymentMethod === filters.paymentMethod);
    }

    if (filters.date) {
      temp = temp.filter(
        (b) =>
          new Date(b.tourDate).toDateString() ===
          new Date(filters.date).toDateString(),
      );
    }

    return temp;
  }, [data, filters]);

  const handleVerify = async (id, approved) => {
    try {
      await verifyBooking({ id, verified: approved });
      mutate(); // Refresh data
    } catch (err) {
      console.error("Failed to verify booking:", err);
    }
  };

  if (!authorized) {
    return (
      <p className="text-center mt-10 text-gray-700">Checking access...</p>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
        Admin Dashboard
      </h1>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-600 font-medium">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-600 font-medium">Verified</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.verified}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-600 font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-600 font-medium">Revenue (ETB)</p>
            <p className="text-2xl font-bold text-blue-600">{stats.revenue}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search by name or email"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/3 text-gray-900 placeholder-gray-500"
        />
        <select
          value={filters.paymentMethod}
          onChange={(e) =>
            setFilters({ ...filters, paymentMethod: e.target.value })
          }
          className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4 text-gray-900"
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
          className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4 text-gray-900"
        />
      </div>

      {/* Booking Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded">
          Error loading bookings. Please try again.
        </div>
      ) : (
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
                    className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-900 font-medium">
                    {b.fullName}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{b.email}</td>
                  <td className="px-4 py-2 text-gray-700">{b.phone}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {new Date(b.tourDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{b.paymentMethod}</td>
                  <td className="px-4 py-2 text-gray-900 font-semibold">
                    {b.totalAmount} ETB
                  </td>
                  <td className="px-4 py-2">
                    {b.verified ? (
                      <span className="text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
                        Verified
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold bg-yellow-50 px-2 py-1 rounded">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {b.document ? (
                      <a
                        href={`${baseUrl}/${b.document}`}
                        target="_blank"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    {!b.verified && (
                      <>
                        <button
                          onClick={() => handleVerify(b._id, true)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerify(b._id, false)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-medium"
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

          {filtered.length === 0 && (
            <p className="text-center py-8 text-gray-500">
              No bookings found matching your filters.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
