"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

export default function AdminCancellationsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000";

  // Authenticate admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/admin/login");

    const verifyToken = async () => {
      try {
        await axios.get(`${backendUrl}/admin/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthorized(true);
      } catch {
        localStorage.removeItem("token");
        router.push("/admin/login");
      }
    };
    verifyToken();
  }, [router, backendUrl]);

  // Fetch all cancellations
  const fetchCancellations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${backendUrl}/cancellations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCancellations(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch cancellations:", err);
      setErrorMessage("❌ Unable to load cancellations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) fetchCancellations();
  }, [authorized]);

  // Approve
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${backendUrl}/cancellations/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSuccessMessage("✅ Cancellation approved!");
      fetchCancellations();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("❌ Failed to approve:", err);
      setErrorMessage("❌ Unable to approve.");
    }
  };

  // Reject
  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${backendUrl}/cancellations/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSuccessMessage("❌ Cancellation rejected!");
      fetchCancellations();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("❌ Failed to reject:", err);
      setErrorMessage("❌ Unable to reject.");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("⚠️ Delete this cancellation permanently?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/cancellations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("🗑️ Cancellation deleted!");
      fetchCancellations();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("❌ Failed to delete:", err);
      setErrorMessage("❌ Unable to delete cancellation.");
    }
  };

  if (!authorized)
    return (
      <p className="text-center mt-10 text-gray-600">
        Checking admin access...
      </p>
    );
  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl text-gray-800 font-bold mb-6">
        📋 Admin: Cancellation Requests
      </h1>

      {successMessage && (
        <p className="mb-4 text-green-600 font-semibold bg-green-50 p-3 rounded">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="mb-4 text-red-600 font-semibold bg-red-50 p-3 rounded">
          {errorMessage}
        </p>
      )}

      {cancellations.length === 0 ? (
        <p className="text-gray-700 bg-white p-4 rounded shadow">
          No cancellation requests found.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Booking Type
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Phone
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Reason
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cancellations.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{c.bookingType}</td>
                  <td className="py-3 px-4 text-gray-700">{c.phoneNumber}</td>
                  <td className="py-3 px-4 text-gray-700">{c.userEmail}</td>
                  <td className="py-3 px-4 text-gray-700">{c.reason}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        c.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : c.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    {c.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(c._id)}
                          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(c._id)}
                          className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
