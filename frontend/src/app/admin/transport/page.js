"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminTransportPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    vehicleName: "",
    vehicleType: "",
    description: "",
    price: "",
  });
  const [imgFile, setImgFile] = useState(null);
  const [transports, setTransports] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const baseUrl = "http://localhost:10000/transportpost";

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

  // ---------------- Fetch Transports ----------------
  const fetchTransports = async () => {
    try {
      const res = await axios.get(baseUrl);
      setTransports(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch transports", err);
    }
  };

  useEffect(() => {
    if (authorized) fetchTransports();
  }, [authorized]);

  // ---------------- Handlers ----------------
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImgFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.vehicleName ||
      !form.vehicleType ||
      !form.price ||
      !form.description
    ) {
      alert("Please fill in all required fields.");
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
        setTransports((prev) =>
          prev.map((t) => (t._id === editingId ? res.data : t))
        );
        setEditingId(null);
      } else {
        res = await axios.post(baseUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setTransports([...transports, res.data]);
      }

      setForm({ vehicleName: "", vehicleType: "", description: "", price: "" });
      setImgFile(null);
    } catch (err) {
      console.error(
        "❌ Failed to submit transport",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleEdit = (t) => {
    setForm({
      vehicleName: t.vehicleName,
      vehicleType: t.vehicleType,
      description: t.description,
      price: t.price,
    });
    setEditingId(t._id);
    setImgFile(null);
  };

  const handleApprove = async (id) => {
    try {
      const res = await axios.put(`${baseUrl}/${id}/approve`);
      setTransports((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("❌ Failed to approve transport", err);
      alert("Approve failed!");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await axios.put(`${baseUrl}/${id}/reject`);
      setTransports((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("❌ Failed to reject transport", err);
      alert("Reject failed!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/${id}`);
      setTransports(transports.filter((t) => t._id !== id));
    } catch (err) {
      console.error(
        "❌ Failed to delete transport",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Delete failed!");
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
      <h1 className="text-2xl font-bold mb-6">Admin - Manage Transport</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6"
      >
        <input
          type="text"
          name="vehicleName"
          placeholder="Vehicle Name"
          value={form.vehicleName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="vehicleType"
          value={form.vehicleType}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Vehicle Type</option>
          <option value="Car">Car</option>
          <option value="Bus">Bus</option>
          <option value="Van">Van</option>
          <option value="SUV">SUV</option>
        </select>
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="price"
          placeholder="Price (e.g., 1000 birr/day)"
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
        />
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Transport" : "Add Transport"}
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-4">Existing Transports</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transports.map((t) => (
            <li key={t._id} className="border p-4 bg-white rounded shadow">
              <p className="font-bold">{t.vehicleName}</p>
              <p>Type: {t.vehicleType}</p>
              <p>Description: {t.description}</p>
              <p>Price: {t.price}</p>
              {t.img && (
                <img
                  src={`http://localhost:10000/uploads/${t.img}`}
                  alt={t.vehicleName}
                  className="w-full h-32 object-cover mt-2"
                />
              )}
              <p className="mt-2 font-semibold">
                Status: {t.status || "pending"}
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {t.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(t._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(t._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleEdit(t)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
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
