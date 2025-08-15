"use client";
import { useState } from "react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    // Simulate sending reset link
    console.log("Password reset link sent to:", email);
    setMessage(`A password reset link has been sent to ${email}.`);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>

        {message && (
          <div className="bg-green-600 text-white p-3 rounded mb-4 text-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Enter your email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded-md font-semibold"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
