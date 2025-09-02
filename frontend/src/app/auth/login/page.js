"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      setMessage({ type: "error", text: "❌ Invalid email or password." });
      setLoading(false);
      return;
    }

    setMessage({
      type: "success",
      text: "✅ Login successful! Redirecting...",
    });
    setTimeout(() => router.push("/home"), 1000);
    setLoading(false);
  };

  const handleOAuthSignIn = (provider) => {
    setLoading(true);
    signIn(provider, { callbackUrl: "/home" }).finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Sign In
        </h2>

        {message.text && (
          <div
            className={`p-2 rounded-md text-sm mb-4 text-center ${
              message.type === "error" ? "bg-red-600" : "bg-green-600"
            } text-white`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
            required
          />

          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md"
            required
          />

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-blue-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Larger main sign in button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-lg font-semibold rounded-lg transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* OAuth icons only */}
        <div className="mt-6 flex justify-center gap-6">
          <button
            onClick={() => handleOAuthSignIn("google")}
            className="text-white hover:opacity-80"
          >
            <FaGoogle size={28} />
          </button>
          <button
            onClick={() => handleOAuthSignIn("facebook")}
            className="text-blue-500 hover:opacity-80"
          >
            <FaFacebook size={28} />
          </button>
          <button
            onClick={() => handleOAuthSignIn("github")}
            className="text-gray-300 hover:opacity-80"
          >
            <FaGithub size={28} />
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="text-blue-400 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
