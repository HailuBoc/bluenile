// ...existing code...
"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// ...existing code...

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!session?.user?.email) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/${session.user.email}`
        );

        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUser();
    } else {
      // try to read signup/local profile fallback
      try {
        const raw =
          typeof window !== "undefined" && localStorage.getItem("signupData");
        if (raw) {
          const parsed = JSON.parse(raw);
          setUser({
            fullName: parsed.fullName || parsed.name,
            email: parsed.email,
            role: parsed.role || "User",
            createdAt: parsed.createdAt || Date.now(),
            ...parsed,
          });
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    }
  }, [session, status]);

  // handler: prepare profile data for edit page then navigate
  const handleEdit = () => {
    try {
      if (typeof window !== "undefined" && user) {
        localStorage.setItem("profileToEdit", JSON.stringify(user));
      }
    } catch (e) {
      console.warn("Could not save profile for edit", e);
    }
    router.push("/auth/profile/edit");
  };

  // handler: sign out and redirect to root, clear local signup data
  const handleSignOut = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("signupData");
        localStorage.removeItem("profileToEdit");
      }
    } catch (e) {
      /* ignore */
    }
    await signOut({ callbackUrl: "/" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 dark:text-gray-300">
        <p>No profile data found.</p>
        <div className="mt-4 flex gap-3">
          <Link href="/auth/signup">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Sign up
            </button>
          </Link>
          <Link href="/auth/login">
            <button className="px-4 py-2 border rounded-md">Login</button>
          </Link>
        </div>
      </div>
    );
  }

  // ...existing code...
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <section id="account" className="max-w-4xl mx-auto p-6 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <Image
                src={"/unknown.png"}
                alt="avatar"
                width={96}
                height={96}
                className="rounded-full ring-2 ring-indigo-500/30 object-cover"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {user.fullName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                {user.role || "User"}
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase">Email</p>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">Joined</p>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">Status</p>
                  <p className="text-sm text-green-500 font-medium">Active</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                Welcome back, {user.fullName}! You are logged in as{" "}
                <span className="font-medium">{user.role}</span>.
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-600 text-white rounded-full text-sm"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
// ...existing code...
