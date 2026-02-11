"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Home, Image as ImageIcon, Sparkles, X } from "lucide-react";
import Link from "next/link";
import AnimatedCard from "../../components/AnimatedCard";
import CustomButton from "../../components/CustomButton";
import DarkModeToggle from "../../components/DarkModeToggle";
import Footer from "../../components/Footer";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

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

function ListPropertyContent() {
  const [listingType, setListingType] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [formData, setFormData] = useState({});
  const [facilities, setFacilities] = useState([]);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null);

  // Use environment variable for backend URL
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://bluenile.onrender.com";

  const featureOptions = useMemo(() => {
    if (serviceType === "tourism") return tourismFeatures;
    if (serviceType === "car") return carFeatures;
    return facilityOptions;
  }, [serviceType]);

  const featureTitle = useMemo(() => {
    if (serviceType === "tourism") return "Tourism Features";
    if (serviceType === "car") return "Car Features";
    return "Facilities";
  }, [serviceType]);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(image);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox")
      setFacilities(
        checked ? [...facilities, name] : facilities.filter((f) => f !== name)
      );
    else if (type === "file") {
      const file = files[0];
      setImage(file);
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
      data.append("rating", formData.rating ?? 0);
      if (formData.description)
        data.append("description", formData.description);
      if (image) data.append("image", image);

      const res = await axios.post(`${backendUrl}/admin/properties`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <motion.nav
        className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center gap-3"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                List Your Service
              </h1>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <DarkModeToggle />
            </motion.div>
          </div>
        </div>
      </motion.nav>

      <motion.header
        className="relative overflow-hidden py-16 xs:py-20 sm:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-emerald-500/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Submit a Listing
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Add your property, car, or tourism service. We’ll review it and
              publish after admin approval.
            </p>
          </motion.div>
        </div>
      </motion.header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <AnimatedCard className="p-6 sm:p-8 max-w-4xl mx-auto">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Your Email
                </label>
                <input
                  type="email"
                  name="userEmail"
                  value={formData.userEmail || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Property Name
                </label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Listing Purpose
                </label>
                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Purpose</option>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="tourism">Tourism Service</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Service Type
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Address / Location
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Address / Location"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Price (BIRR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                  placeholder="Price (BIRR)"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating || ""}
                  onChange={handleChange}
                  min={0}
                  max={5}
                  step={0.1}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Description (optional)
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Short description"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Property Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <AnimatedCard
                  hoverEffect={false}
                  className="md:col-span-2 p-5 cursor-pointer"
                  href={undefined}
                >
                  <div
                    className="flex flex-col items-center justify-center gap-3 text-center"
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Click to upload an image
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG up to a few MB
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard hoverEffect={false} className="md:col-span-3 p-5">
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl"
                        loading="lazy"
                        decoding="async"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition text-gray-800 shadow"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-48 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      No image selected
                    </div>
                  )}
                </AnimatedCard>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {featureTitle}
              </h3>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
                {featureOptions.map((f, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/40"
                  >
                    <input
                      type="checkbox"
                      name={f}
                      checked={facilities.includes(f)}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {f}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <CustomButton type="submit" variant="primary" size="lg" className="w-full">
                Submit Listing
              </CustomButton>
            </div>

            {successMessage && (
              <p className="mt-2 text-green-600 dark:text-green-400 font-semibold text-center">
                {successMessage}
              </p>
            )}
            {errorMessage && (
              <p className="mt-2 text-red-600 dark:text-red-400 font-semibold text-center">
                {errorMessage}
              </p>
            )}
          </form>
        </AnimatedCard>
      </section>

      <Footer />
    </div>
  );
}

export default function ListPropertyPage() {
  return (
    <DarkModeProvider>
      <ListPropertyContent />
    </DarkModeProvider>
  );
}
