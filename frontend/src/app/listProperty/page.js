"use client";
import React, { useState } from "react";
import axios from "axios";

export default function ListPropertyPage() {
  const [listingType, setListingType] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [formData, setFormData] = useState({});
  const [facilities, setFacilities] = useState([]);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox")
      setFacilities(
        checked ? [...facilities, name] : facilities.filter((f) => f !== name)
      );
    else if (type === "file") {
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
      data.append("rating", formData.rating ?? 0); // ✅ include rating
      if (formData.description)
        data.append("description", formData.description);
      if (image) data.append("image", image);

      const res = await axios.post(
        "https://bluenile.onrender.com/admin/properties",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status !== 201) throw new Error("Failed to submit listing");

      setSuccessMessage(
        "✅ Your listing has been submitted and is awaiting admin approval!"
      );
      setErrorMessage("");
      resetForm();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-white mb-6">List Your Service</h1>
      <form
        className="bg-gray-800 p-8 rounded-2xl shadow text-white w-full max-w-4xl space-y-6"
        onSubmit={handleSubmit}
      >
        {/* Email */}
        <div>
          <label className="block mb-2 font-medium">Your Email</label>
          <input
            type="email"
            name="userEmail"
            value={formData.userEmail || ""}
            onChange={handleChange}
            className="w-full border border-gray-500 bg-gray-900 rounded p-3 mb-3"
            required
          />
        </div>

        {/* Property Name */}
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

        {/* Listing Purpose */}
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

        {/* Service Type */}
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

        {/* Address */}
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

        {/* Price */}
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

        {/* Rating */}
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

        {/* Image */}
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

        {/* Facilities / Tourism / Car Features */}
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
          Submit Listing
        </button>

        {successMessage && (
          <p className="mt-4 text-green-400 font-semibold text-center">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="mt-4 text-red-400 font-semibold text-center">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}
