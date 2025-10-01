"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminVipTours() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
    highlights: [],
  });
  const [imgFile, setImgFile] = useState(null);
  const [tours, setTours] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  const baseUrl = "http://localhost:10000/vip-post";

  // ---------------- Admin Authentication ----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/admin/login");

    const verifyToken = async () => {
      try {
        await axios.get("http://localhost:10000/admin/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthorized(true);
      } catch {
        localStorage.removeItem("token");
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [router]);

  // ---------------- Fetch VIP Tours ----------------
  const fetchTours = async () => {
    try {
      const res = await axios.get(baseUrl);
      setTours(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch VIP tours", err);
      setMessage({ type: "error", text: "Failed to load tours" });
    }
  };

  useEffect(() => {
    if (authorized) fetchTours();
  }, [authorized]);

  // ---------------- Form Handlers ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleHighlightsChange = (e) => {
    setForm({
      ...form,
      highlights: e.target.value.split(",").map((h) => h.trim()),
    });
  };

  const handleFileChange = (e) => {
    setImgFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.date) {
      alert("Please fill in Name, Description, and Date.");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("date", form.date);
      fd.append("highlights", JSON.stringify(form.highlights));
      if (imgFile) fd.append("image", imgFile);

      let res;
      if (editingId) {
        res = await axios.put(`${baseUrl}/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setTours((prev) =>
          prev.map((t) => (t._id === editingId ? res.data : t))
        );
        setEditingId(null);
      } else {
        res = await axios.post(baseUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setTours((prev) => [res.data, ...prev]);
      }

      setForm({ name: "", description: "", date: "", highlights: [] });
      setImgFile(null);
      setMessage({ type: "success", text: "VIP tour saved successfully!" });
    } catch (err) {
      console.error(
        "❌ Failed to submit VIP tour",
        err.response?.data || err.message
      );
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Something went wrong!",
      });
    }
  };

  const handleEdit = (tour) => {
    setForm({
      name: tour.name,
      description: tour.description,
      date: tour.date,
      highlights: tour.highlights || [],
    });
    setEditingId(tour._id);
    setImgFile(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/${id}`);
      setTours(tours.filter((t) => t._id !== id));
      setMessage({ type: "success", text: "Tour deleted successfully" });
    } catch (err) {
      console.error(
        "❌ Failed to delete VIP tour",
        err.response?.data || err.message
      );
      setMessage({ type: "error", text: "Delete failed!" });
    }
  };

  // ---------------- Render ----------------
  if (loading)
    return (
      <p className="text-center mt-10 text-gray-700">
        Checking admin access...
      </p>
    );
  if (!authorized)
    return <p className="text-center mt-10 text-red-600">Unauthorized</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin - Manage VIP Tours</h1>

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

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Tour Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded md:col-span-2"
          required
        />

        <input
          type="text"
          placeholder="Highlights (comma separated)"
          value={form.highlights.join(", ")}
          onChange={handleHighlightsChange}
          className="border p-2 rounded md:col-span-2"
        />

        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          className="border p-2 rounded md:col-span-2"
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update VIP Tour" : "Add VIP Tour"}
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-4">Existing VIP Tours</h2>
        {tours.length === 0 ? (
          <p className="text-gray-500">No VIP tours yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tours.map((t) => (
              <li key={t._id} className="border p-4 bg-white rounded shadow">
                <p className="font-bold">{t.name}</p>
                <p>{t.description}</p>
                <p>Date: {t.date}</p>
                <p>Highlights: {t.highlights?.join(", ")}</p>
                {t.image && (
                  <img
                    src={`http://localhost:10000/uploads/${t.image}`}
                    alt={t.name}
                    className="w-full h-32 object-cover mt-2"
                  />
                )}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button
                    onClick={() => handleEdit(t)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
