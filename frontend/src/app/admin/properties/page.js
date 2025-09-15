"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [listingType, setListingType] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [formData, setFormData] = useState({});
  const [facilities, setFacilities] = useState([]);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const facilityOptions = [
    "WiFi",
    "Parking",
    "Air Conditioning",
    "Swimming Pool",
    "Gym",
    "Garden",
  ];
  const tourismFeatures = [
    "Guided Tour",
    "Local Transport",
    "Meals Included",
    "Adventure Activities",
  ];
  const carFeatures = [
    "Airbags",
    "GPS",
    "Sunroof",
    "Bluetooth",
    "ABS Brakes",
    "Leather Seats",
  ];

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // Authenticate admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/admin/login");

    const verifyToken = async () => {
      try {
        await axios.get(`${baseUrl}/admin/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthorized(true);
      } catch {
        localStorage.removeItem("token");
        router.push("/admin/login");
      }
    };
    verifyToken();
  }, [router, baseUrl]);

  // Fetch all properties
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/admin/properties`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.properties || [];
      const formattedData = data.map((item) => ({
        ...item,
        rating: Number(item.rating ?? 0),
        imageUrl: item.imageUrl
          ? item.imageUrl.startsWith("http")
            ? item.imageUrl
            : `${baseUrl}${item.imageUrl}`
          : null,
      }));

      setProperties(formattedData);
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ Unable to fetch properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) fetchProperties();
  }, [authorized]);

  // Approve/Reject/Delete
  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${baseUrl}/admin/properties/${id}/status`, { status });
      setSuccessMessage(`✅ Property ${status}!`);
      fetchProperties();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setErrorMessage("❌ " + (err.response?.data?.error || err.message));
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/admin/properties/${id}`);
      setSuccessMessage("✅ Property deleted!");
      setDeleteConfirmId(null);
      fetchProperties();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setErrorMessage("❌ Unable to delete property.");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  // Edit
  const handleEdit = (property) => {
    setEditingId(property._id);
    setFormData({
      userEmail: property.userEmail,
      propertyName: property.propertyName,
      address: property.address,
      price: property.price,
      description: property.description || "",
      rating: property.rating ?? 0,
    });
    setListingType(property.listingType);
    setServiceType(property.serviceType);
    setFacilities(property.facilities || []);
    setPreviewUrl(property.imageUrl || null);
  };

  // Form changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFacilities(
        checked ? [...facilities, name] : facilities.filter((f) => f !== name)
      );
    } else if (type === "file") {
      const file = files[0];
      setImage(file);
      setPreviewUrl(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({});
    setFacilities([]);
    setListingType("");
    setServiceType("");
    setImage(null);
    setPreviewUrl(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !listingType ||
      !serviceType ||
      !formData.address ||
      !formData.price ||
      !formData.userEmail ||
      !formData.propertyName
    ) {
      setErrorMessage("❌ Fill all required fields.");
      return;
    }

    try {
      const data = new FormData();
      data.append("listingType", listingType);
      data.append("serviceType", serviceType);
      data.append("propertyName", formData.propertyName);
      data.append("userEmail", formData.userEmail);
      data.append("address", formData.address);
      data.append("price", formData.price);
      data.append("rating", formData.rating ?? 0);
      data.append("facilities", JSON.stringify(facilities));

      if (formData.description)
        data.append("description", formData.description);
      if (image) data.append("image", image);

      const token = localStorage.getItem("token");

      if (editingId) {
        const res = await axios.patch(
          `${baseUrl}/admin/properties/${editingId}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProperties((prev) =>
          prev.map((p) =>
            p._id === editingId
              ? {
                  ...p,
                  ...res.data.property,
                  rating: Number(res.data.property.rating ?? 0),
                  imageUrl: res.data.property.imageUrl
                    ? res.data.property.imageUrl.startsWith("http")
                      ? res.data.property.imageUrl
                      : `${baseUrl}${res.data.property.imageUrl}`
                    : null,
                }
              : p
          )
        );

        setSuccessMessage("✅ Property updated!");
      } else {
        const res = await axios.post(`${baseUrl}/admin/properties`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        setProperties((prev) => [
          {
            ...res.data.property,
            rating: Number(res.data.property.rating ?? 0),
            imageUrl: res.data.property.imageUrl
              ? res.data.property.imageUrl.startsWith("http")
                ? res.data.property.imageUrl
                : `${baseUrl}${res.data.property.imageUrl}`
              : null,
          },
          ...prev,
        ]);

        setSuccessMessage("✅ Property submitted!");
      }

      resetForm();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setErrorMessage("❌ " + (err.response?.data?.error || err.message));
    }
  };

  const filteredProperties = properties.filter(
    (p) =>
      p.propertyName?.toLowerCase().includes(search.toLowerCase()) ||
      p.serviceType?.toLowerCase().includes(search.toLowerCase()) ||
      p.listingType?.toLowerCase().includes(search.toLowerCase())
  );

  if (!authorized)
    return (
      <p className="text-center mt-10 text-gray-700">
        Checking admin access...
      </p>
    );
  if (loading)
    return <p className="text-center mt-10 text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Admin: Manage Properties
      </h1>
      {successMessage && (
        <p className="mb-4 text-green-400 font-semibold text-center">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="mb-4 text-red-400 font-semibold text-center">
          {errorMessage}
        </p>
      )}

      {/* ----------------- Form ----------------- */}
      <form
        className="bg-gray-800 p-8 rounded-2xl shadow text-white w-full max-w-4xl space-y-6 mb-8"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block mb-2 font-medium">User Email</label>
          <input
            type="email"
            name="userEmail"
            value={formData.userEmail || ""}
            onChange={handleChange}
            className="w-full border border-gray-500 bg-gray-900 rounded p-3 mb-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Property Name</label>
          <input
            type="text"
            name="propertyName"
            value={formData.propertyName || ""}
            onChange={handleChange}
            className="w-full border border-gray-500 bg-gray-900 rounded p-3 mb-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Listing Purpose</label>
          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
            className="w-full border border-gray-500 bg-gray-900 rounded p-3 mb-3"
            required
          >
            <option value="">Select Purpose</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
            <option value="tourism">Tourism Service</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Service Type</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full border border-gray-500 bg-gray-900 rounded p-3 mb-3"
            required
          >
            <option value="">Select Service Type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="guesthouse">Guesthouse</option>
            <option value="car">Car</option>
            <option value="tourism">Tourism Site</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            name="address"
            placeholder="Address / Location"
            value={formData.address || ""}
            onChange={handleChange}
            className="w-full border border-gray-500 bg-gray-900 rounded p-3 mb-3"
            required
          />
        </div>

        <div>
          <input
            type="number"
            name="price"
            placeholder="Price (BIRR)"
            value={formData.price || ""}
            onChange={handleChange}
            className="w-full border border-gray-500 bg-gray-900 rounded p-3 mb-3"
            required
          />
        </div>

        <div>
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={formData.description || ""}
            onChange={handleChange}
            className="w-full border border-gray-500 bg-gray-900 rounded p-3 mb-3"
          />
        </div>

        {/* Rating Input */}
        <div>
          <label className="block mb-2 font-medium">Rating (0-5)</label>
          <input
            type="number"
            name="rating"
            value={formData.rating || ""}
            onChange={handleChange}
            min={0}
            max={5}
            step={0.1}
            className="w-full border border-gray-500 bg-gray-900 rounded p-3 mb-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Property Image</label>
          <input type="file" accept="image/*" onChange={handleChange} />
          {previewUrl && (
            <div className="mt-3">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-48 rounded"
              />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">
            {serviceType === "tourism"
              ? "Tourism Features"
              : serviceType === "car"
              ? "Car Features"
              : "Facilities"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(serviceType === "tourism"
              ? tourismFeatures
              : serviceType === "car"
              ? carFeatures
              : facilityOptions
            ).map((f, i) => (
              <label key={i} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={f}
                  checked={facilities.includes(f)}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                <span>{f}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {editingId ? "Update Property" : "Submit Property"}
        </button>
      </form>

      {/* Search */}
      <div className="w-full max-w-6xl mb-4">
        <input
          type="text"
          placeholder="🔍 Search properties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
        />
      </div>

      {/* ----------------- Table ----------------- */}
      <table className="w-full max-w-6xl text-left text-white border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-3 border-b">#</th>
            <th className="p-3 border-b">Image</th>
            <th className="p-3 border-b">Property Name</th>
            <th className="p-3 border-b">Type</th>
            <th className="p-3 border-b">Listing</th>
            <th className="p-3 border-b">Price</th>
            <th className="p-3 border-b">Rating</th>
            <th className="p-3 border-b">Status</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProperties.map((p, i) => (
            <tr key={p._id} className="border-b border-gray-700">
              <td className="p-3">{i + 1}</td>
              <td className="p-3">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.propertyName}
                    className="h-16 w-24 object-cover rounded"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="p-3">{p.propertyName}</td>
              <td className="p-3">{p.serviceType}</td>
              <td className="p-3">{p.listingType}</td>
              <td className="p-3">{p.price}</td>
              {/* ✅ Rating is permanent now */}
              <td className="p-3">{p.rating?.toFixed(1)}</td>
              <td className="p-3">{p.status}</td>
              <td className="p-3 space-x-2">
                {p.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(p._id, "approved")}
                      className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(p._id, "rejected")}
                      className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                {deleteConfirmId === p._id ? (
                  <>
                    <span className="text-yellow-400 mr-2">
                      Confirm delete?
                    </span>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
                    >
                      No
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(p._id)}
                    className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
          {filteredProperties.length === 0 && (
            <tr>
              <td colSpan="9" className="p-3 text-center text-gray-400">
                No properties found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
