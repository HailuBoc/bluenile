"use client";
import { useState, useEffect } from "react";
import {
  Map,
  Landmark,
  Building,
  Calendar,
  Crown,
  CheckCircle,
  Search,
  Shield,
  BedDouble,
  Plane,
  Car,
  User,
} from "lucide-react";
import Link from "next/link";

const iconMap = { Map, Landmark, Building, Calendar, Shield, BedDouble };

export default function TourismPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";

  const [activeTab, setActiveTab] = useState("regular");
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    destination: "",
    date: "",
    extras: [],
    notes: "",
    paymentMethod: "",
    phone: "",
    email: "",
    paymentProof: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [vipPosts, setVipPosts] = useState([]);
  const [regularTours, setRegularTours] = useState([]);

  // ✅ Fetch VIP posts
  useEffect(() => {
    const fetchVipPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/vip-post`);
        if (!res.ok) throw new Error("Failed to fetch VIP posts");
        const data = await res.json();
        setVipPosts(data);
      } catch (err) {
        console.error("Error fetching VIP posts:", err);
        setMessage({ type: "error", text: "Failed to fetch VIP posts" });
      }
    };
    fetchVipPosts();
  }, []);

  // ✅ Fetch Regular tours
  useEffect(() => {
    const fetchRegularTours = async () => {
      try {
        const res = await fetch(`${API_URL}/regular-post`);
        if (!res.ok) throw new Error("Failed to fetch regular tours");
        const data = await res.json();
        setRegularTours(data);
      } catch (err) {
        console.error("Error fetching regular tours:", err);
        setMessage({ type: "error", text: "Failed to fetch regular tours" });
      }
    };
    fetchRegularTours();
  }, []);

  const handleCheckboxChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      extras: prev.extras.includes(value)
        ? prev.extras.filter((e) => e !== value)
        : [...prev.extras, value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.paymentMethod) {
      setMessage({ type: "error", text: "⚠️ Please select a payment method!" });
      return;
    }
    if (!formData.phone || !formData.email) {
      setMessage({
        type: "error",
        text: "⚠️ Please provide your phone number and email!",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formPayload = new FormData();
      formPayload.append("destination", formData.destination);
      formPayload.append("date", formData.date);
      formPayload.append("extras", JSON.stringify(formData.extras));
      formPayload.append("notes", formData.notes);
      formPayload.append("paymentMethod", formData.paymentMethod);
      formPayload.append("phone", formData.phone);
      formPayload.append("email", formData.email);

      if (
        (formData.paymentMethod === "telebirr" ||
          formData.paymentMethod === "cbe_birr") &&
        formData.paymentProof
      ) {
        formPayload.append("paymentProof", formData.paymentProof);
      }

      const res = await fetch(`${API_URL}/vip-bookings`, {
        method: "POST",
        body: formPayload,
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Unexpected server response. Expected JSON, got text/HTML:\n" + text
        );
      }

      if (!res.ok)
        throw new Error(data.error || data.message || "Request failed");

      if (formData.paymentMethod === "chapa" && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setMessage({
          type: "success",
          text: "🎉 " + (data.message || "Booking submitted successfully."),
        });
      }

      setFormData({
        destination: "",
        date: "",
        extras: [],
        notes: "",
        paymentMethod: "",
        phone: "",
        email: "",
        paymentProof: null,
      });
    } catch (err) {
      setMessage({ type: "error", text: "❌ " + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-red-700 to-yellow-600 text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">
          Explore Ethiopian Tourism
        </h1>
        <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto px-2">
          Choose between Regular and VIP tourism packages to plan your perfect
          Ethiopian journey.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex justify-center mt-6 md:mt-8 gap-3 md:gap-4 flex-wrap px-3">
        <button
          onClick={() => setActiveTab("regular")}
          className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition text-sm md:text-base ${
            activeTab === "regular"
              ? "bg-yellow-600 text-white shadow-lg"
              : "bg-white text-gray-800 border"
          }`}
        >
          Regular Tourism
        </button>
        <button
          onClick={() => setActiveTab("vip")}
          className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition text-sm md:text-base ${
            activeTab === "vip"
              ? "bg-yellow-600 text-white shadow-lg"
              : "bg-white text-gray-800 border"
          }`}
        >
          VIP Tourism
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-12">
        {/* ✅ Regular Tours (from Admin) */}
        {activeTab === "regular" && (
          <div>
            <div className="max-w-md mx-auto mb-6 md:mb-8 flex items-center bg-white rounded-lg shadow px-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search regular packages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-2 py-2 text-sm md:text-base outline-none"
              />
            </div>

            {regularTours.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {regularTours
                  .filter((tour) =>
                    tour.category?.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((tour) => {
                    const IconComponent = iconMap[tour.icon] || Map;
                    return (
                      <div
                        key={tour._id}
                        className="bg-white p-4 md:p-6 rounded-xl shadow hover:shadow-lg transition"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <IconComponent className="w-6 h-6 text-yellow-600" />
                          <h3 className="text-base md:text-lg font-bold">
                            {tour.category}
                          </h3>
                        </div>
                        {tour.destinations && (
                          <ul className="list-disc list-inside text-gray-600 text-sm md:text-base">
                            {tour.destinations.map((d, i) => (
                              <li key={i}>{d}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No regular tours available.
              </p>
            )}
          </div>
        )}

        {/* ✅ VIP Tours (unchanged) */}
        {activeTab === "vip" && (
          <div>
            {/* VIP Posts dynamically fetched */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
              {vipPosts.length > 0 ? (
                vipPosts.map((tour) => (
                  <div
                    key={tour._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition relative"
                  >
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-yellow-500 text-white px-2 md:px-3 py-1 rounded-full flex items-center gap-1 text-xs md:text-sm font-semibold shadow-lg">
                      <Crown className="w-3 h-3 md:w-4 md:h-4" /> VIP Tour
                    </div>

                    {tour.image && (
                      <img
                        src={`${API_URL}/uploads/${tour.image}`}
                        alt={tour.name}
                        className="w-full h-52 md:h-64 object-cover"
                      />
                    )}
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4 gap-2">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                          {tour.name}
                        </h2>
                        <div className="flex items-center text-gray-600 text-xs md:text-sm">
                          <Calendar className="w-4 h-4 mr-1 text-yellow-600" />
                          {tour.date}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                        {tour.description}
                      </p>
                      <ul className="space-y-2 text-gray-700 mb-5 text-sm md:text-base">
                        {tour.highlights?.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-2">
                  No VIP posts available.
                </p>
              )}
            </div>

            {/* VIP Form (unchanged) */}
            {/* ... keep your existing VIP form code here ... */}
            <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                VIP Tour Customization Form
              </h3>

              {/* Inline success/error message */}
              {message && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                    message.type === "success"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Destination */}
                <div>
                  <label className="block font-semibold mb-1 text-sm text-gray-800">
                    Choose Destination
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData({ ...formData, destination: e.target.value })
                    }
                    className="w-full border border-gray-400 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">-- Select a place --</option>
                    <option value="lalibela">Lalibela</option>
                    <option value="axum">Axum</option>
                    <option value="gondar">Gondar</option>
                    <option value="omo_valley">Omo Valley</option>
                    <option value="sof_omar">Sof Omar Caves</option>
                    <option value="rift_valley">Rift Valley</option>
                  </select>
                </div>

                {/* Travel Date */}
                <div>
                  <label className="block font-semibold mb-1 text-sm text-gray-800">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full border border-gray-400 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-semibold mb-1 text-sm text-gray-800">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full border border-gray-400 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-semibold mb-1 text-sm text-gray-800">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border border-gray-400 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* VIP Extras */}
                <div>
                  <label className="block font-semibold mb-1 text-sm text-gray-800">
                    Select VIP Extras
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-black">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.extras.includes("private_car")}
                        onChange={() => handleCheckboxChange("private_car")}
                        className="accent-yellow-600"
                      />
                      <Car className="w-4 h-4" /> Private Car / SUV
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.extras.includes("airplane")}
                        onChange={() => handleCheckboxChange("airplane")}
                        className="accent-yellow-600"
                      />
                      <Plane className="w-4 h-4" /> Airplane Ride
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.extras.includes("personal_guide")}
                        onChange={() => handleCheckboxChange("personal_guide")}
                        className="accent-yellow-600"
                      />
                      <User className="w-4 h-4" /> Personal Guide
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.extras.includes("luxury_lodge")}
                        onChange={() => handleCheckboxChange("luxury_lodge")}
                        className="accent-yellow-600"
                      />
                      <BedDouble className="w-4 h-4" /> Luxury Lodge Stay
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block font-semibold mb-1 text-sm text-gray-800">
                    Additional Notes / Requests
                  </label>
                  <textarea
                    rows="4"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full border border-gray-400 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter special requests here..."
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block font-semibold mb-1 text-sm text-gray-800">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full border border-gray-400 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">-- Select Payment --</option>
                    <option value="chapa">Chapa</option>
                    <option value="telebirr">Telebirr</option>
                    <option value="cbe_birr">CBE Birr</option>
                  </select>
                </div>

                {/* Upload Payment Proof if Telebirr or CBE */}
                {(formData.paymentMethod === "telebirr" ||
                  formData.paymentMethod === "cbe_birr") && (
                  <div>
                    <label className="block font-semibold mb-1 mt-3 text-sm text-gray-800">
                      Upload Payment Proof
                    </label>
                    <input
                      type="file"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentProof: e.target.files[0],
                        })
                      }
                      className="w-full text-sm"
                    />
                  </div>
                )}

                {/* Submit Button with spacing */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-semibold shadow-md transition mb-8"
                >
                  {loading ? "Submitting..." : "Submit VIP Request"}
                </button>
              </form>

              {/* Footer Section */}
            </div>
          </div>
        )}
      </div>

      <section className="bg-green-700 text-white py-10 md:py-12">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Start Your Adventure?
          </h2>
          <p className="mb-6 text-base md:text-lg">
            Choose your ideal package and let us guide you through Ethiopia’s
            breathtaking landscapes and rich history.
          </p>
          <Link href={"/tourism/Booktour"}>
            <button className="bg-white text-green-700 font-bold py-2 md:py-3 px-6 md:px-8 rounded-lg shadow hover:bg-gray-100 transition text-sm md:text-base">
              Book Now
            </button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-300 py-5 md:py-6 text-center text-xs md:text-sm">
        &copy; {new Date().getFullYear()} Explore Ethiopia Tours. All rights
        reserved.
      </footer>
    </div>
  );
}
