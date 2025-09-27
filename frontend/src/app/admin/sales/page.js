"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminSalesPage() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    price: "",
    location: "",
    description: "",
  });
  const [imgFile, setImgFile] = useState(null);
  const [sales, setSales] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const baseUrl = "http://localhost:10000/salepost";

  // Fetch all sales
  const fetchSales = async () => {
    try {
      const res = await axios.get(baseUrl);
      setSales(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch sales", err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImgFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.category ||
      !form.price ||
      !form.location ||
      !form.description
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!imgFile && !editingId) {
      alert("Please upload an image for the sale.");
      return;
    }

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgFile) fd.append("img", imgFile);

      let res;
      if (editingId) {
        res = await axios.put(`${baseUrl}/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSales((prev) =>
          prev.map((s) => (s._id === editingId ? res.data : s))
        );
        setEditingId(null);
      } else {
        res = await axios.post(baseUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSales([...sales, res.data]);
      }

      setForm({
        title: "",
        category: "",
        price: "",
        location: "",
        description: "",
      });
      setImgFile(null);
    } catch (err) {
      console.error(
        "❌ Failed to submit sale",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleEdit = (s) => {
    setForm({
      title: s.title,
      category: s.category,
      price: s.price,
      location: s.location,
      description: s.description,
    });
    setEditingId(s._id);
  };

  const handleApprove = async (id) => {
    const res = await axios.put(`${baseUrl}/${id}/approve`);
    setSales((prev) => prev.map((s) => (s._id === id ? res.data : s)));
  };

  const handleReject = async (id) => {
    const res = await axios.put(`${baseUrl}/${id}/reject`);
    setSales((prev) => prev.map((s) => (s._id === id ? res.data : s)));
  };

  const handleDelete = async (id) => {
    await axios.delete(`${baseUrl}/${id}`);
    setSales(sales.filter((s) => s._id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin - Manage Sales</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Land">Land</option>
          <option value="Vehicle">Vehicle</option>
        </select>

        <input
          type="text"
          name="price"
          placeholder="Price (e.g., 100,000 birr)"
          value={form.price}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded col-span-1 md:col-span-2"
          required
        />

        <input
          type="file"
          name="img"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Sale" : "Add Sale"}
        </button>
      </form>

      {/* Sales List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Existing Sales</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sales.map((s) => (
            <li key={s._id} className="border p-4 bg-white rounded shadow">
              <p className="font-bold">{s.title}</p>
              <p>Category: {s.category}</p>
              <p>Price: {s.price}</p>
              <p>Location: {s.location}</p>
              <p>Description: {s.description}</p>
              {s.img && (
                <img
                  src={`http://localhost:10000/${s.img}`}
                  alt={s.title}
                  className="w-full h-32 object-cover mt-2"
                />
              )}
              <p className="mt-2 font-semibold">
                Status: {s.status || "pending"}
              </p>

              {/* Action Buttons BELOW the sale item */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {s.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(s._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(s._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleEdit(s)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="px-3 py-1 bg-gray-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
