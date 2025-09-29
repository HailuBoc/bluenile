"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminSpecialOffers() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const [form, setForm] = useState({
    propertyName: "",
    address: "",
    price: "",
    rating: 0,
    imageUrl: "",
    status: "pending", // for approve/reject
  });
  const [imgFile, setImgFile] = useState(null);
  const [offers, setOffers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  // ✅ Fetch existing special offers
  const fetchOffers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/special-offers`);
      setOffers(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch special offers:", err);
      setMessage({ type: "error", text: "Failed to load offers" });
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => setImgFile(e.target.files[0]);

  // ✅ Submit form (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("propertyName", form.propertyName);
      fd.append("address", form.address);
      fd.append("price", form.price);
      fd.append("rating", form.rating);
      fd.append("status", form.status);
      if (imgFile) fd.append("image", imgFile);

      let res;
      if (editingId) {
        res = await axios.put(
          `${BASE_URL}/api/special-offers/${editingId}`,
          fd,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setOffers((prev) =>
          prev.map((o) => (o._id === editingId ? res.data : o))
        );
        setEditingId(null);
      } else {
        res = await axios.post(`${BASE_URL}/api/special-offers`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setOffers((prev) => [res.data, ...prev]);
      }

      setForm({
        propertyName: "",
        address: "",
        price: "",
        rating: 0,
        imageUrl: "",
        status: "pending",
      });
      setImgFile(null);
      setMessage({
        type: "success",
        text: "Special offer saved successfully!",
      });
    } catch (err) {
      console.error("❌ Failed to submit special offer", err);
      setMessage({ type: "error", text: "Failed to save special offer" });
    }
  };

  // ✅ Edit offer
  const handleEdit = (offer) => {
    setForm({
      propertyName: offer.propertyName,
      address: offer.address,
      price: offer.price,
      rating: offer.rating,
      imageUrl: offer.imageUrl,
      status: offer.status,
    });
    setEditingId(offer._id);
    setImgFile(null);
  };

  // ✅ Delete offer
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this special offer?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/special-offers/${id}`);
      setOffers(offers.filter((o) => o._id !== id));
      setMessage({ type: "success", text: "Offer deleted successfully" });
    } catch (err) {
      console.error("❌ Failed to delete offer", err);
      setMessage({ type: "error", text: "Delete failed" });
    }
  };

  // ✅ Approve offer
  const handleApprove = async (id) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/special-offers/${id}`, {
        status: "approved",
      });
      setOffers((prev) => prev.map((o) => (o._id === id ? res.data : o)));
    } catch (err) {
      console.error("❌ Failed to approve offer", err);
    }
  };

  // ✅ Reject offer
  const handleReject = async (id) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/special-offers/${id}`, {
        status: "rejected",
      });
      setOffers((prev) => prev.map((o) => (o._id === id ? res.data : o)));
    } catch (err) {
      console.error("❌ Failed to reject offer", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-yellow-700">
        Admin - Special Offers
      </h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6"
      >
        <input
          type="text"
          name="propertyName"
          placeholder="Property Name"
          value={form.propertyName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price (Br)"
          value={form.price}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (0-5)"
          step="0.1"
          value={form.rating}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          className="border p-2 rounded md:col-span-2"
        />
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
        >
          {editingId ? "Update Offer" : "Add Offer"}
        </button>
      </form>

      {/* List of offers */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Existing Special Offers</h2>
        {offers.length === 0 ? (
          <p className="text-gray-500">No special offers yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((o) => (
              <li
                key={o._id}
                className="border p-4 bg-white rounded shadow relative"
              >
                <p className="font-bold">{o.propertyName}</p>
                <p>{o.address}</p>
                <p>Price: {o.price} Br</p>
                <p>Rating: {o.rating}</p>
                <p>Status: {o.status}</p>
                {o.imageUrl && (
                  <img
                    src={
                      o.imageUrl.startsWith("http")
                        ? o.imageUrl
                        : `${BASE_URL}${o.imageUrl}`
                    }
                    alt={o.propertyName}
                    className="w-full h-32 object-cover mt-2"
                  />
                )}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button
                    onClick={() => handleEdit(o)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(o._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                  {o.status !== "approved" && (
                    <button
                      onClick={() => handleApprove(o._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      Approve
                    </button>
                  )}
                  {o.status !== "rejected" && (
                    <button
                      onClick={() => handleReject(o._id)}
                      className="px-3 py-1 bg-gray-500 text-white rounded"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
