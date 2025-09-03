"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const email = localStorage.getItem("resetEmail") || "";

  useEffect(() => {
    if (!email) router.push("/auth/forgot-password");
  }, [email, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage({ type: "error", text: "❌ Passwords do not match." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("http://localhost:10000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);

      setMessage({ type: "success", text: "✅ Password reset successful!" });
      localStorage.removeItem("resetEmail");

      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (err) {
      setMessage({ type: "error", text: `❌ ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {message.text && (
          <div
            className={`p-2 rounded-md text-sm mb-4 text-center ${
              message.type === "error" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 bg-gray-800 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 bg-gray-800 rounded-md"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
