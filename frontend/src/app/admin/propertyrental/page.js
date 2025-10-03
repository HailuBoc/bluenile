"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminPropertyRentalPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://bluenile.onrender.com";

  // ✅ Check authentication
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

  // ✅ Fetch properties
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/propertyrental`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) fetchProperties();
  }, [authorized]);

  // ✅ Search filter
  useEffect(() => {
    let temp = [...properties];
    if (search) {
      temp = temp.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(search.toLowerCase())) ||
          (p.location &&
            p.location.toLowerCase().includes(search.toLowerCase())) ||
          (p.type && p.type.toLowerCase().includes(search.toLowerCase()))
      );
    }
    setFiltered(temp);
  }, [search, properties]);

  // ✅ Delete property
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseUrl}/propertyrental/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProperties();
    } catch (err) {
      console.error("❌ Error deleting property:", err);
    }
  };

  // ✅ Approve / Reject
  const handleApprove = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/propertyrental/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProperties();
    } catch (err) {
      console.error(`❌ Error trying to ${action} property:`, err);
    }
  };

  if (!authorized)
    return (
      <p className="text-center mt-10 text-gray-700">
        Checking admin access...
      </p>
    );

  if (loading)
    return <p className="text-center mt-10 text-gray-700">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Manage Property Rentals
      </h1>

      {/* 🔍 Search bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search by title, type, or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded w-full"
        />
      </div>

      {/* 📋 Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Title",
                "Type",
                "Location",
                "Price",
                "Status",
                "Image",
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
            {filtered.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-2 font-semibold">{p.title}</td>
                <td className="px-4 py-2">{p.type}</td>
                <td className="px-4 py-2">{p.location}</td>
                <td className="px-4 py-2">{p.price}</td>
                <td className="px-4 py-2">
                  {p.status === "approved" ? (
                    <span className="text-green-600 font-semibold">
                      Approved
                    </span>
                  ) : p.status === "rejected" ? (
                    <span className="text-red-600 font-semibold">Rejected</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {p.img ? (
                    <img
                      src={`${baseUrl}/uploads/${p.img}`}
                      alt={p.title}
                      className="h-16 w-24 object-cover rounded"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2 flex-wrap">
                  {p.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(p._id, "approve")}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApprove(p._id, "reject")}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center py-4 text-gray-500">No properties found.</p>
        )}
      </div>
    </div>
  );
}
