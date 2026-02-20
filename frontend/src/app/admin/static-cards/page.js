"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://bluenile.onrender.com";

const CARD_TYPES = [
  { value: "product", label: "Products" },
  { value: "house", label: "Houses" },
  { value: "car", label: "Rental Cars" },
  { value: "carsale", label: "Cars for Sale" },
  { value: "tourism", label: "Tourism" },
  { value: "specialoffer", label: "Special Offers" },
];

export default function StaticCardsAdmin() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("product");
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    cardType: "product",
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    location: "",
    address: "",
    city: "",
    rating: "0",
    reviewCount: "0",
    bedrooms: "",
    bathrooms: "",
    guests: "",
    carName: "",
    make: "",
    model: "",
    year: "",
    mileage: "",
    transmission: "",
    fuelType: "",
    duration: "",
    groupSize: "",
    discount: "",
    offerPrice: "",
    imageUrl: "",
    tags: "",
    amenities: "",
    features: "",
    priority: "0",
    displayOrder: "0",
    isActive: true,
  });

  // Fetch cards
  useEffect(() => {
    fetchCards();
  }, [selectedType]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Check if server is available first
      const res = await axios.get(`${BASE_URL}/api/static-cards`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { cardType: selectedType },
        timeout: 10000,
      });

      setCards(res.data.cards || []);
      // Save to localStorage for offline fallback
      localStorage.setItem(
        `static-cards-${selectedType}`,
        JSON.stringify(res.data.cards || []),
      );
      setMessage({ type: "", text: "" });
    } catch (err) {
      // Silent fail - use cached data if available
      const cached = localStorage.getItem(`static-cards-${selectedType}`);
      if (cached) {
        setCards(JSON.parse(cached));
        setMessage({
          type: "info",
          text: "Showing cached data (server unavailable)",
        });
      } else {
        setCards([]);
        setMessage({
          type: "error",
          text: "Server temporarily unavailable. Please try again later.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add all text fields
      formDataToSend.append("cardType", formData.cardType);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price || "0");
      formDataToSend.append("originalPrice", formData.originalPrice || "");
      formDataToSend.append("location", formData.location);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("rating", formData.rating || "0");
      formDataToSend.append("reviewCount", formData.reviewCount || "0");
      formDataToSend.append("bedrooms", formData.bedrooms || "");
      formDataToSend.append("bathrooms", formData.bathrooms || "");
      formDataToSend.append("guests", formData.guests || "");
      formDataToSend.append("carName", formData.carName);
      formDataToSend.append("make", formData.make);
      formDataToSend.append("model", formData.model);
      formDataToSend.append("year", formData.year || "");
      formDataToSend.append("mileage", formData.mileage || "");
      formDataToSend.append("transmission", formData.transmission);
      formDataToSend.append("fuelType", formData.fuelType);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("groupSize", formData.groupSize || "");
      formDataToSend.append("discount", formData.discount || "");
      formDataToSend.append("offerPrice", formData.offerPrice || "");
      formDataToSend.append("tags", formData.tags);
      formDataToSend.append("amenities", formData.amenities);
      formDataToSend.append("features", formData.features);
      formDataToSend.append("priority", formData.priority || "0");
      formDataToSend.append("displayOrder", formData.displayOrder || "0");
      formDataToSend.append("isActive", formData.isActive ? "true" : "false");

      // Add image files
      if (formData.imageFiles && formData.imageFiles.length > 0) {
        for (let i = 0; i < formData.imageFiles.length; i++) {
          formDataToSend.append("images", formData.imageFiles[i]);
        }
      }

      if (editingCard) {
        await axios.put(
          `${BASE_URL}/api/static-cards/${editingCard._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        setMessage({ type: "success", text: "Card updated successfully!" });
      } else {
        await axios.post(`${BASE_URL}/api/static-cards`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMessage({ type: "success", text: "Card created successfully!" });
      }

      resetForm();
      fetchCards();
    } catch (err) {
      console.error("Error saving card:", err);
      setMessage({
        type: "error",
        text:
          "Failed to save card: " +
          (err.response?.data?.message || err.message),
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this card?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/static-cards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: "success", text: "Card deleted successfully!" });
      fetchCards();
    } catch (err) {
      console.error("Error deleting card:", err);
      setMessage({ type: "error", text: "Failed to delete card" });
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/static-cards/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMessage({ type: "success", text: "Card approved successfully!" });
      fetchCards();
    } catch (err) {
      console.error("Error approving card:", err);
      setMessage({ type: "error", text: "Failed to approve card" });
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/static-cards/${id}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMessage({ type: "success", text: "Status toggled successfully!" });
      fetchCards();
    } catch (err) {
      console.error("Error toggling status:", err);
      setMessage({ type: "error", text: "Failed to toggle status" });
    }
  };

  const editCard = (card) => {
    setEditingCard(card);
    setFormData({
      cardType: card.cardType,
      title: card.title,
      description: card.description || "",
      price: card.price?.toString() || "",
      originalPrice: card.originalPrice?.toString() || "",
      location: card.location || "",
      address: card.address || "",
      city: card.city || "",
      rating: card.rating?.toString() || "0",
      reviewCount: card.reviewCount?.toString() || "0",
      bedrooms: card.bedrooms?.toString() || "",
      bathrooms: card.bathrooms?.toString() || "",
      guests: card.guests?.toString() || "",
      carName: card.carName || "",
      make: card.make || "",
      model: card.model || "",
      year: card.year?.toString() || "",
      mileage: card.mileage?.toString() || "",
      transmission: card.transmission || "",
      fuelType: card.fuelType || "",
      duration: card.duration || "",
      groupSize: card.groupSize?.toString() || "",
      discount: card.discount?.toString() || "",
      offerPrice: card.offerPrice?.toString() || "",
      imageFiles: null, // Reset file input for editing
      tags: card.tags?.join(", ") || "",
      amenities: card.amenities?.join(", ") || "",
      features: card.features?.join(", ") || "",
      priority: card.priority?.toString() || "0",
      displayOrder: card.displayOrder?.toString() || "0",
      isActive: card.isActive,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingCard(null);
    setShowForm(false);
    setFormData({
      cardType: selectedType,
      title: "",
      description: "",
      price: "",
      originalPrice: "",
      location: "",
      address: "",
      city: "",
      rating: "0",
      reviewCount: "0",
      bedrooms: "",
      bathrooms: "",
      guests: "",
      carName: "",
      make: "",
      model: "",
      year: "",
      mileage: "",
      transmission: "",
      fuelType: "",
      duration: "",
      groupSize: "",
      discount: "",
      offerPrice: "",
      imageFiles: null,
      tags: "",
      amenities: "",
      features: "",
      priority: "0",
      displayOrder: "0",
      isActive: true,
    });
  };

  const getStatusBadge = (card) => {
    if (!card.isApproved) {
      return (
        <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
          Pending
        </span>
      );
    }
    if (card.isActive) {
      return (
        <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
          Active
        </span>
      );
    }
    return (
      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
        Inactive
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Static Cards Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage offline-persistent cards that display alongside dynamic
            content
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "Add New Card"}
        </button>
      </div>

      {/* Success/Error Messages */}
      {message.text && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 border border-green-400 text-green-800"
              : "bg-red-100 border border-red-400 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{message.text}</span>
            <button
              onClick={() => setMessage({ type: "", text: "" })}
              className="ml-auto text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Card Type Filter */}
      <div className="flex flex-wrap gap-2">
        {CARD_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelectedType(type.value)}
            className={`px-4 py-2 rounded transition-colors ${
              selectedType === type.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingCard ? "Edit Card" : "Create New Card"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Type *
                </label>
                <select
                  value={formData.cardType}
                  onChange={(e) =>
                    setFormData({ ...formData, cardType: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {CARD_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price (for discounts)
                </label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, originalPrice: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>

              {/* Review Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Count
                </label>
                <input
                  type="number"
                  value={formData.reviewCount}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewCount: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bedrooms */}
              {(selectedType === "house" || selectedType === "car") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bedrooms: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              )}

              {/* Bathrooms */}
              {(selectedType === "house" || selectedType === "car") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bathrooms: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              )}

              {/* Guests */}
              {(selectedType === "house" || selectedType === "tourism") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <input
                    type="number"
                    value={formData.guests}
                    onChange={(e) =>
                      setFormData({ ...formData, guests: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              )}

              {/* Car fields */}
              {(selectedType === "car" || selectedType === "carsale") && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Car Name
                    </label>
                    <input
                      type="text"
                      value={formData.carName}
                      onChange={(e) =>
                        setFormData({ ...formData, carName: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Make
                    </label>
                    <input
                      type="text"
                      value={formData.make}
                      onChange={(e) =>
                        setFormData({ ...formData, make: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mileage
                    </label>
                    <input
                      type="number"
                      value={formData.mileage}
                      onChange={(e) =>
                        setFormData({ ...formData, mileage: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transmission
                    </label>
                    <input
                      type="text"
                      value={formData.transmission}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          transmission: e.target.value,
                        })
                      }
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Automatic, Manual"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Type
                    </label>
                    <input
                      type="text"
                      value={formData.fuelType}
                      onChange={(e) =>
                        setFormData({ ...formData, fuelType: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Petrol, Diesel, Electric"
                    />
                  </div>
                </>
              )}

              {/* Tourism fields */}
              {selectedType === "tourism" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 3 days, 1 week"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Group Size
                    </label>
                    <input
                      type="number"
                      value={formData.groupSize}
                      onChange={(e) =>
                        setFormData({ ...formData, groupSize: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>
                </>
              )}

              {/* Special Offer fields */}
              {selectedType === "specialoffer" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData({ ...formData, discount: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Offer Price
                    </label>
                    <input
                      type="number"
                      value={formData.offerPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, offerPrice: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                    />
                  </div>
                </>
              )}

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority (higher = shown first)
                </label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Images
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, imageFiles: e.target.files })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">
                  Select one or more images from your device
                </p>
                {/* Preview existing images when editing */}
                {editingCard && card.imageUrl && card.imageUrl.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {card.imageUrl.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Existing ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            {/* Tags, Amenities, Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="luxury, beach, family"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) =>
                    setFormData({ ...formData, amenities: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="wifi, pool, parking"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="aircon, balcony, gym"
                />
              </div>
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm text-gray-900"
              >
                Active (visible to users)
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {editingCard ? "Update Card" : "Create Card"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cards List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            {CARD_TYPES.find((t) => t.value === selectedType)?.label} Cards (
            {cards.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cards...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No static cards found for this type. Create one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cards.map((card) => (
                  <tr key={card._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {card.imageUrl && card.imageUrl[0] ? (
                        <img
                          src={card.imageUrl[0]}
                          alt={card.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {card.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {card.description || "No description"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">
                        ${card.price?.toLocaleString() || 0}
                      </div>
                      {card.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ${card.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {card.location || "-"}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(card)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {!card.isApproved && (
                          <button
                            onClick={() => handleApprove(card._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleStatus(card._id)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            card.isActive
                              ? "bg-yellow-500 text-white hover:bg-yellow-600"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          {card.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => editCard(card)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(card._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
