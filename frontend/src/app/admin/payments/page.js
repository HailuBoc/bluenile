"use client";

import { useEffect, useState } from "react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:10000/bookings") // Assuming payments are stored with bookings
      .then((res) => res.json())
      .then((data) => setPayments(data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Payments</h2>
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
              <td className="p-3">{p.propertyPrice}</td>
              <td className="p-3">{p.paymentMethod}</td>
              <td className="p-3">Completed</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
