"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    basePrice: 500,
    vipFee: 300,
    chapaKey: "",
    telebirrKey: "",
    cbeKey: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch current settings on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:10000/admin/settings");
        if (res.data.settings) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        setMessage("Error fetching settings.");
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:10000/admin/settings", settings);
      setMessage("Settings updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error updating settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Settings</h1>

        {message && (
          <p
            className={`mb-4 text-center ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">
              Base Price per Person (ETB)
            </label>
            <input
              type="number"
              name="basePrice"
              value={settings.basePrice}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">VIP Fee (ETB)</label>
            <input
              type="number"
              name="vipFee"
              value={settings.vipFee}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Chapa Secret Key</label>
            <input
              type="text"
              name="chapaKey"
              value={settings.chapaKey}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Telebirr API Key</label>
            <input
              type="text"
              name="telebirrKey"
              value={settings.telebirrKey}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">CBE Birr API Key</label>
            <input
              type="text"
              name="cbeKey"
              value={settings.cbeKey}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg w-full"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}
