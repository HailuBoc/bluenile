"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Home, LogIn, Sparkles } from "lucide-react";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import Link from "next/link";
import AnimatedCard from "../../../components/AnimatedCard";
import CustomButton from "../../../components/CustomButton";
import DarkModeToggle from "../../../components/DarkModeToggle";
import Footer from "../../../components/Footer";
import { DarkModeProvider } from "../../../contexts/DarkModeContext";

function SignInContent() {
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
                Sign In
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
        className="relative overflow-hidden py-14 xs:py-16 sm:py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-indigo-500/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Welcome back
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Sign in to access your account.
            </p>
          </motion.div>
        </div>
      </motion.header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-md mx-auto">
          <AnimatedCard className="p-6 sm:p-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <LogIn className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Sign In
              </h3>
            </div>

            {message.text && (
              <div
                className={`p-3 rounded-xl text-sm mb-4 text-center border ${
                  message.type === "error"
                    ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 border-red-200 dark:border-red-700"
                    : "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <CustomButton disabled={loading} variant="primary" size="lg" className="w-full">
                {loading ? "Signing In..." : "Sign In"}
              </CustomButton>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Or continue with
              </div>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthSignIn("google")}
                className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition flex items-center justify-center"
                disabled={loading}
                aria-label="Continue with Google"
              >
                <FaGoogle size={22} className="text-gray-800 dark:text-gray-200" />
              </button>
              <button
                type="button"
                onClick={() => handleOAuthSignIn("facebook")}
                className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition flex items-center justify-center"
                disabled={loading}
                aria-label="Continue with Facebook"
              >
                <FaFacebook size={22} className="text-blue-600" />
              </button>
              <button
                type="button"
                onClick={() => handleOAuthSignIn("github")}
                className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition flex items-center justify-center"
                disabled={loading}
                aria-label="Continue with GitHub"
              >
                <FaGithub size={22} className="text-gray-800 dark:text-gray-200" />
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Don’t have an account?{" "}
              <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
                Create Account
              </Link>
            </p>
          </AnimatedCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function SignIn() {
  return (
    <DarkModeProvider>
      <SignInContent />
    </DarkModeProvider>
  );
}
