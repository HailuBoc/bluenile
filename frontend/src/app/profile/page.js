"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/signup"); // Redirect if no data
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center px-4">
      <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-2xl p-6 md:p-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <FaUserCircle className="text-gray-400 text-8xl" />
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{user.fullName}</h2>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-700" />

        {/* Account Details */}
        <div className="space-y-4">
          <p className="text-lg font-semibold">Account Information</p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p>
              <span className="font-semibold">Name:</span> {user.fullName}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <button
            onClick={() => router.push("/properties")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-md"
          >
            View My Properties
          </button>
          <button
            onClick={() => router.push("/add-property")}
            className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-md"
          >
            Add New Property
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("userProfile");
              router.push("/signup");
            }}
            className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-md"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
