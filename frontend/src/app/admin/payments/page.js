"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

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
        await axios.get("https://bluenile.onrender.com/admin/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthorized(true);
      } catch (err) {
        localStorage.removeItem("token");
        router.push("/admin/login");
      }
    };

    verifyToken();
  }, [router]);

  // ----------------------------
  // Fetch payments
  // ----------------------------
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:10000/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data.bookings || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) fetchPayments();
  }, [authorized]);

  if (!authorized)
    return <p className="text-center mt-10">Checking admin access...</p>;
  if (loading) return <p className="text-center mt-10">Loading payments...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-center">Payments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="p-3 text-left">Guest</th>
              <th className="p-3 text-left">Property</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-100">
                <td className="p-3">{p.fullName}</td>
                <td className="p-3">{p.propertyTitle}</td>
                <td className="p-3">{p.totalAmount || p.propertyPrice} ETB</td>
                <td className="p-3">{p.paymentMethod}</td>
                <td className="p-3 text-green-600 font-semibold">Completed</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
