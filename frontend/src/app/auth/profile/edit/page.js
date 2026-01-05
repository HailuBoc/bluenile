"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    about: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    const load = async () => {
      // Prefer profileToEdit (set by profile page), fallback to signupData or session user
      try {
        if (typeof window !== "undefined") {
          const stored =
            localStorage.getItem("profileToEdit") ||
            localStorage.getItem("signupData");
          if (stored) {
            const parsed = JSON.parse(stored);
            setForm({
              fullName: parsed.fullName || parsed.name || "",
              email: parsed.email || (session?.user?.email ?? ""),
              phone: parsed.phone || "",
              location: parsed.location || "",
              about: parsed.about || "",
              avatar: parsed.avatar || "/logo.jpg",
            });
            setLoading(false);
            return;
          }
        }

        // If authenticated, try to fetch from API
        if (status === "authenticated" && session?.user?.email && baseUrl) {
          const res = await fetch(`${baseUrl}/auth/user/${session.user.email}`);
          if (res.ok) {
            const data = await res.json();
            setForm({
              fullName: data.fullName || data.name || "",
              email: data.email || session?.user?.email || "",
              phone: data.phone || "",
              location: data.location || "",
              about: data.about || "",
              avatar: data.avatar || "/logo.jpg",
            });
            setLoading(false);
            return;
          }
        }

        // final fallback: use session user
        setForm((f) => ({
          ...f,
          email: session?.user?.email || "",
        }));
      } catch (err) {
        console.warn("Load profileToEdit failed", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [session, status, baseUrl]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Save to API if authenticated, else save locally
    try {
      if (status === "authenticated" && session?.user?.email && baseUrl) {
        const res = await fetch(`${baseUrl}/auth/user/${session.user.email}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: form.fullName,
            phone: form.phone,
            location: form.location,
            about: form.about,
            avatar: form.avatar,
          }),
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || "Failed to update profile");
        }

        // update local cache used by profile page
        try {
          localStorage.setItem("profileToEdit", JSON.stringify({ ...form }));
          localStorage.setItem(
            "signupData",
            JSON.stringify({
              fullName: form.fullName,
              email: form.email,
              phone: form.phone,
              location: form.location,
              avatar: form.avatar,
            })
          );
        } catch {}
        setMessage({ type: "success", text: "Profile updated." });
        router.push("/auth/profile");
      } else {
        // unauthenticated: persist locally
        try {
          localStorage.setItem("profileToEdit", JSON.stringify(form));
          localStorage.setItem(
            "signupData",
            JSON.stringify({
              fullName: form.fullName,
              email: form.email,
              phone: form.phone,
              location: form.location,
              avatar: form.avatar,
            })
          );
        } catch (err) {
          console.warn("localStorage error", err);
        }
        setMessage({ type: "success", text: "Profile saved locally." });
        router.push("/auth/profile");
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <main className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Edit Profile</h1>
            <Link
              href="/auth/profile"
              className="text-sm text-blue-600 hover:underline"
            >
              Back
            </Link>
          </div>

          {message && (
            <div
              className={`p-2 mb-4 text-sm rounded ${
                message.type === "error"
                  ? "bg-red-600 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src={form.avatar || "/logo.jpg"}
                  width={80}
                  height={80}
                  alt="avatar"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">
                  Avatar URL
                </label>
                <input
                  name="avatar"
                  value={form.avatar}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Full name
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Email (readonly)
              </label>
              <input
                name="email"
                value={form.email}
                readOnly
                className="w-full px-3 py-2 rounded bg-gray-50 dark:bg-gray-600 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">About</label>
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => router.push("/auth/profile")}
                className="px-4 py-2 border rounded text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-4 py-2 rounded text-sm text-white ${
                  saving ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
