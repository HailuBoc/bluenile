"use client";

import { useEffect, useState } from "react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:10000/bookings") // Your backend bookings API
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Property Bookings</h2>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-blue-700 text-white">
            <th className="p-3 text-left">Property</th>
            <th className="p-3 text-left">Guest</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Check-in</th>
            <th className="p-3 text-left">Check-out</th>
            <th className="p-3 text-left">Guests</th>
            <th className="p-3 text-left">Payment</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id} className="border-b hover:bg-gray-100">
              <td className="p-3">{b.propertyTitle}</td>
              <td className="p-3">{b.fullName}</td>
              <td className="p-3">{b.email}</td>
              <td className="p-3">{b.phone}</td>
              <td className="p-3">
                {new Date(b.checkInDate).toLocaleDateString()}
              </td>
              <td className="p-3">
                {new Date(b.checkOutDate).toLocaleDateString()}
              </td>
              <td className="p-3">{b.numberOfGuests}</td>
              <td className="p-3">{b.paymentMethod}</td>
              <td className="p-3 flex gap-2">
                <button className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
