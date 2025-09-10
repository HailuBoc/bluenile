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
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // Track delete confirmation

  // -------------------------------
  // Add Property Form State
  // -------------------------------
  const [listingType, setListingType] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [formData, setFormData] = useState({});
  const [facilities, setFacilities] = useState([]);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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
        await axios.get("http://localhost:10000/admin/verify-token", {
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

  // -------------------------------
  // Fetch Properties
  // -------------------------------
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:10000/admin/properties", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.properties || [];

      const formattedData = data.map((item) => {
        const baseUrl = "http://localhost:10000";
        let firstImage =
          Array.isArray(item.imageUrl) && item.imageUrl.length > 0
            ? item.imageUrl[0]
            : typeof item.imageUrl === "string"
            ? item.imageUrl
            : null;

        const imageSrc = firstImage
          ? firstImage.startsWith("http")
            ? firstImage
            : `${baseUrl}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
          : null;

        return { ...item, imageUrl: imageSrc };
      });

      setProperties(formattedData);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setErrorMessage("❌ Unable to fetch properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) fetchProperties();
  }, [authorized]);

  // -------------------------------
  // Fetch Single Property Dynamically
  // -------------------------------
  const fetchPropertyByNameAndService = async (propertyName, serviceType) => {
    if (!propertyName || !serviceType) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:10000/admin/properties/search`,
        {
          params: { propertyName, serviceType },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data) {
        const p = res.data; // assume backend returns single property
        setFormData({
          userEmail: p.userEmail,
          propertyName: p.propertyName,
          address: p.address,
          price: p.price,
          description: p.description || "",
        });
        setListingType(p.listingType);
        setServiceType(p.serviceType);
        setFacilities(p.facilities || []);
        setPreviewUrl(
          Array.isArray(p.imageUrl) ? p.imageUrl[0] : p.imageUrl || null
        );
      }
    } catch (err) {
      console.error("Error fetching property:", err);
      setErrorMessage("❌ Unable to fetch property.");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  useEffect(() => {
    fetchPropertyByNameAndService(formData.propertyName, serviceType);
  }, [formData.propertyName, serviceType]);

  // -------------------------------
  // Approve / Reject / Delete
  // -------------------------------
  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:10000/admin/properties/${id}/status`,
        { status }
      );
      setSuccessMessage(`✅ Property has been ${status} successfully!`);
      fetchProperties();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ " + (err.response?.data?.error || err.message));
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:10000/admin/properties/${id}`);
      setSuccessMessage("✅ Property deleted successfully!");
      setDeleteConfirmId(null);
      fetchProperties();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ Unable to delete property.");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  // -------------------------------
  // Form Handlers
  // -------------------------------
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
      setErrorMessage("❌ Please fill all required fields.");
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
      data.append("facilities", JSON.stringify(facilities));
      if (formData.description)
        data.append("description", formData.description);
      if (image) data.append("image", image);

      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:10000/admin/properties",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status !== 201) throw new Error("Failed to submit property");
      setSuccessMessage("✅ Property submitted successfully!");
      setErrorMessage("");
      resetForm();
      fetchProperties();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ " + (err.response?.data?.error || err.message));
    }
  };

  // -------------------------------
  // Filter Properties
  // -------------------------------
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

      {/* Add Property Form */}
      <form
        className="bg-gray-800 p-8 rounded-2xl shadow text-white w-full max-w-4xl space-y-6 mb-8"
        onSubmit={handleSubmit}
      >
        {/* --- FORM CONTENT REMAINS EXACTLY THE SAME --- */}
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
          Submit Property
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

      {/* Properties Table */}
      <table className="w-full max-w-6xl text-left text-white border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-3 border-b">#</th>
            <th className="p-3 border-b">Image</th>
            <th className="p-3 border-b">Property Name</th>
            <th className="p-3 border-b">Type</th>
            <th className="p-3 border-b">Listing</th>
            <th className="p-3 border-b">Price</th>
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
              <td className="p-3">{p.status}</td>
              <td className="p-3 space-x-2">
                {p.status === "pending" && (
                  <>
                    <button
                      className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                      onClick={() => handleStatusChange(p._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                      onClick={() => handleStatusChange(p._id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* --- UPDATED DELETE BUTTON LOGIC --- */}
                {deleteConfirmId === p._id ? (
                  <>
                    <span className="text-yellow-400 mr-2">
                      Confirm delete?
                    </span>
                    <button
                      className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                      onClick={() => handleDelete(p._id)}
                    >
                      Yes
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
                      onClick={() => setDeleteConfirmId(null)}
                    >
                      No
                    </button>
                  </>
                ) : (
                  <button
                    className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
                    onClick={() => setDeleteConfirmId(p._id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
