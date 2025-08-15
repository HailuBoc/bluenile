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
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const res = await signIn("Credentials", {
      redirect: false,
      email: formData.email.trim(),
      password: formData.password,
      callbackUrl: "/home", // Always send to /home
    });

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      router.push("/home");
    }

    setLoading(false);
  };

  const handleOAuthSignIn = (provider) => {
    signIn(provider, { callbackUrl: "/home" });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Sign In
        </h2>

        {errorMsg && (
          <div className="bg-red-600 text-white p-2 rounded-md text-sm mb-4 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Link
              href="/reset-password"
              className="text-blue-400 hover:underline hover:text-blue-300"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded-md font-semibold disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleOAuthSignIn("google")}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-white text-gray-900 py-2 rounded-md hover:bg-gray-200 transition disabled:opacity-50"
          >
            <FaGoogle className="w-5 h-5" /> Continue with Google
          </button>
          <button
            onClick={() => handleOAuthSignIn("facebook")}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            <FaFacebook className="w-5 h-5" /> Continue with Facebook
          </button>
          <button
            onClick={() => handleOAuthSignIn("github")}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-gray-800 py-2 rounded-md hover:bg-gray-700 transition disabled:opacity-50"
          >
            <FaGithub className="w-5 h-5" /> Continue with GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-400 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
