"use client";
import { useState } from "react";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-6 tracking-wide">
        Log in
      </h2>

      {/* Social login buttons */}
      <div className="w-full max-w-sm space-y-3 mb-6">
        <button className="flex items-center justify-center gap-2 w-full bg-white text-gray-900 py-2 rounded-md hover:bg-gray-200 transition">
          <FaGoogle className="w-5 h-5" /> Continue with Google
        </button>
        <button className="flex items-center justify-center gap-2 w-full bg-blue-600 py-2 rounded-md hover:bg-blue-700 transition">
          <FaFacebook className="w-5 h-5" /> Continue with Facebook
        </button>
        <button className="flex items-center justify-center gap-2 w-full bg-gray-800 py-2 rounded-md hover:bg-gray-700 transition">
          <FaGithub className="w-5 h-5" /> Continue with GitHub
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center w-full max-w-sm my-6">
        <div className="flex-grow border-t border-gray-700"></div>
        <span className="px-3 text-gray-400 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-700"></div>
      </div>

      {/* Email/password form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="text-right text-sm">
          <a
            href="#"
            className="text-blue-400 hover:underline hover:text-blue-300"
          >
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded-md font-semibold"
        >
          Sign In
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-400">
        Don’t have an account?{" "}
        <a href="/signup" className="text-blue-400 hover:underline">
          Create one
        </a>
      </p>
    </div>
  );
}
