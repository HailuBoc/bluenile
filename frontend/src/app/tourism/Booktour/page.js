"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function TourBooking() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL; // ← environment variable

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    tourDate: "",
    numberOfPeople: 1,
    message: "",
    vipService: false,
    paymentMethod: "",
    document: null,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const basePrice = 500;
    const vipFee = 300;
    const amount =
      Number(formData.numberOfPeople) * basePrice +
      (formData.vipService ? vipFee : 0);
    setTotalAmount(amount);
  }, [formData.numberOfPeople, formData.vipService]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, document: files[0] });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data = new FormData();
      data.append("destination", "VIP Tour");
      data.append("date", formData.tourDate);
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      data.append("paymentMethod", formData.paymentMethod);
      data.append("notes", formData.message);
      data.append(
        "extras",
        JSON.stringify(formData.vipService ? ["VIP Service"] : [])
      );
      data.append("totalAmount", String(totalAmount));

      if (formData.document) {
        data.append("paymentProof", formData.document);
      }

      const res = await axios.post(`${API_URL}/vip-bookings`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (formData.paymentMethod.toLowerCase() === "chapa") {
        const paymentRes = await axios.post(`${API_URL}/bookings/pay/chapa`, {
          amount: totalAmount,
          currency: "ETB",
          email: formData.email,
          fullName: formData.fullName,
          bookingId: res.data.booking._id,
        });

        if (paymentRes.data?.checkout_url) {
          window.location.href = paymentRes.data.checkout_url;
          return;
        } else {
          throw new Error("Chapa payment URL not returned from server");
        }
      } else {
        setSuccessMessage(
          `Booking submitted! Amount ${totalAmount} ETB will be verified manually.`
        );
      }

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        tourDate: "",
        numberOfPeople: 1,
        message: "",
        vipService: false,
        paymentMethod: "",
        document: null,
      });
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.error ||
          err.message ||
          "Server error, try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 md:p-10">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Book a Tour
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {["fullName", "email", "phone", "tourDate"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={field === "tourDate" ? "date" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of People
            </label>
            <input
              type="number"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="vipService"
              checked={formData.vipService}
              onChange={handleChange}
              className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Add VIP Service (+300 ETB)
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Requests
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Select Payment Method</h3>
            <div className="flex gap-4">
              {[
                { name: "Chapa", logo: "/chapa.png" },
                { name: "Telebirr", logo: "/telebirr.png" },
                { name: "CBE Birr", logo: "/cbe.png" },
              ].map((method) => (
                <label
                  key={method.name}
                  className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer ${
                    formData.paymentMethod === method.name
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.name}
                    checked={formData.paymentMethod === method.name}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="w-10 h-10"
                  />
                  {method.name}
                </label>
              ))}
            </div>

            {(formData.paymentMethod === "Telebirr" ||
              formData.paymentMethod === "CBE Birr") && (
              <div className="mt-3">
                <input
                  type="file"
                  name="document"
                  accept="image/*,application/pdf"
                  onChange={handleChange}
                  className="px-2 py-1 border rounded-lg text-black cursor-pointer text-sm"
                />
              </div>
            )}
          </div>

          <p className="text-gray-700 font-medium">
            Total Amount: {totalAmount} ETB
          </p>

          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
          {successMessage && <p className="text-green-600">{successMessage}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition w-full"
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
