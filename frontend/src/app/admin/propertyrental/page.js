"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminPropertyRentalPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "",
    location: "",
    price: "",
  });
  const [imgFile, setImgFile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [approveLoadingId, setApproveLoadingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const baseUrl = "http://localhost:10000/propertyrental";

  // ✅ Admin authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/admin/login");

    const verifyToken = async () => {
      try {
        await axios.get(`${baseUrl}/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthorized(true);
      } catch {
        localStorage.removeItem("token");
        router.push("/admin/login");
      }
    };

    verifyToken();
  }, [router]);

  // ✅ Fetch properties
  const fetchProperties = async () => {
    if (!authorized) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(baseUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch properties:", err);
      setErrorMessage("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) fetchProperties();
  }, [authorized]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImgFile(e.target.files[0]);
  };

  // ✅ Add / Update property
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("type", form.type);
      data.append("location", form.location);
      data.append("price", form.price);
      if (imgFile) data.append("img", imgFile);

      const token = localStorage.getItem("token");
      let res;
      if (editingId) {
        res = await axios.put(`${baseUrl}/${editingId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        setProperties((prev) =>
          prev.map((p) => (p._id === editingId ? res.data : p))
        );
        setEditingId(null);
        setSuccessMessage("Property updated successfully!");
      } else {
        res = await axios.post(baseUrl, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        setProperties([...properties, res.data]);
        setSuccessMessage("Property added successfully!");
      }

      setForm({ title: "", type: "", location: "", price: "" });
      setImgFile(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("❌ Failed to save property:", err);
      setErrorMessage("Failed to save property");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleEdit = (property) => {
    setForm({
      title: property.title,
      type: property.type,
      location: property.location,
      price: property.price,
    });
    setImgFile(null);
    setEditingId(property._id);
  };

  const handleApprove = async (id) => {
    try {
      setApproveLoadingId(id);
      const token = localStorage.getItem("token");
      await axios.put(`${baseUrl}/${id}/approve`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: "approved" } : p))
      );
      setApproveLoadingId(null);
    } catch (err) {
      console.error("❌ Failed to approve property:", err);
      setApproveLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setApproveLoadingId(id);
      const token = localStorage.getItem("token");
      await axios.put(`${baseUrl}/${id}/reject`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: "rejected" } : p))
      );
      setApproveLoadingId(null);
    } catch (err) {
      console.error("❌ Failed to reject property:", err);
      setApproveLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(properties.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete property:", err);
    }
  };

  if (!authorized)
    return (
      <p className="text-center mt-10 text-gray-700">
        Checking admin access...
      </p>
    );
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Admin - Manage Property Rentals
      </h1>

      {successMessage && (
        <p className="text-green-600 mb-4">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

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
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Type</option>
          <option value="House">House</option>
          <option value="Apartment">Apartment</option>
          <option value="Guesthouse">Guesthouse</option>
          <option value="Hotel Apartment">Hotel Apartment</option>
        </select>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="price"
          placeholder="Price (e.g., 300 birr / night)"
          value={form.price}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="file"
          name="img"
          onChange={handleFileChange}
          className="border p-2 rounded"
          accept="image/*"
        />
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Property" : "Add Property"}
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-4">Existing Properties</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((p) => (
            <li key={p._id} className="border p-4 bg-white rounded shadow">
              <p className="font-bold">{p.title}</p>
              <p>{p.type}</p>
              <p>{p.location}</p>
              <p>{p.price}</p>
              {p.img && (
                <img
                  src={`http://localhost:10000/uploads/${p.img}`}
                  alt={p.title}
                  className="w-full h-32 object-cover mt-2"
                />
              )}
              <p className="mt-2 font-semibold">
                Status: {p.status || "pending"}
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {p.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(p._id)}
                      disabled={approveLoadingId === p._id}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      {approveLoadingId === p._id ? "..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(p._id)}
                      disabled={approveLoadingId === p._id}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      {approveLoadingId === p._id ? "..." : "Reject"}
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
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
