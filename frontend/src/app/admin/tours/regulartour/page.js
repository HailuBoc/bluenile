"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Map,
  Calendar,
  Landmark,
  Building,
  BedDouble,
  Shield,
} from "lucide-react";

const iconMap = { Map, Calendar, Landmark, Building, BedDouble, Shield };

export default function AdminTours() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const [tours, setTours] = useState([]);
  const [form, setForm] = useState({
    category: "",
    icon: "",
    destinations: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  const API_URL = "http://localhost:10000/regular-post";

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

  // ---------------- Fetch Tours ----------------
  const fetchTours = async () => {
    try {
      const res = await axios.get(API_URL);
      setTours(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch tours", err);
      setMessage({ type: "error", text: "Failed to load tours" });
    }
  };

  useEffect(() => {
    if (authorized) fetchTours();
  }, [authorized]);

  // ---------------- Form Handlers ----------------
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleDestinationsChange = (e) => {
    setForm({
      ...form,
      destinations: e.target.value.split(",").map((d) => d.trim()),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingId) {
        res = await axios.put(`${API_URL}/${editingId}`, form);
        setTours(tours.map((t) => (t._id === editingId ? res.data : t)));
        setEditingId(null);
      } else {
        res = await axios.post(API_URL, form);
        setTours([...tours, res.data]);
      }
      setForm({ category: "", icon: "", destinations: [] });
      setMessage({ type: "success", text: "Tour saved successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save tour!" });
    }
  };

  const handleEdit = (tour) => {
    setForm({
      category: tour.category,
      icon: tour.icon,
      destinations: tour.destinations || [],
    });
    setEditingId(tour._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTours(tours.filter((t) => t._id !== id));
      setMessage({ type: "success", text: "Tour deleted!" });
    } catch (err) {
      console.error(err);
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
      <h1 className="text-2xl font-bold mb-6">Admin - Manage Regular Tours</h1>

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
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="4-Week Rotation Plan">4-Week Rotation Plan</option>
          <option value="Monthly Plan">Monthly Plan</option>
          <option value="Special Offers">Special Offers</option>
          <option value="Included Services">Included Services</option>
          <option value="Accommodation">Accommodation</option>
          <option value="Safety & Support">Safety & Support</option>
        </select>

        <select
          name="icon"
          value={form.icon}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Icon</option>
          {Object.keys(iconMap).map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Destinations (comma separated)"
          value={form.destinations.join(", ")}
          onChange={handleDestinationsChange}
          className="border p-2 rounded md:col-span-2"
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Tour" : "Add Tour"}
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-4">Existing Tours</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tours.map((t) => {
            const IconComponent = iconMap[t.icon] || Map;
            return (
              <li key={t._id} className="border p-4 bg-white rounded shadow">
                <div className="flex items-center gap-2 mb-2">
                  <IconComponent className="w-6 h-6 text-yellow-600" />
                  <span className="font-bold">{t.category}</span>
                </div>
                <p>Destinations: {t.destinations?.join(", ")}</p>
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
            );
          })}
        </ul>
      </div>
    </div>
  );
}
