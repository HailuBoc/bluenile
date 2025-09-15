"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false); // Only render if authorized
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ----------------------------
  // Check authentication
  // ----------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const verifyToken = async () => {
      try {
        await axios.get("https://bluenile.onrender.com/admin/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthorized(true); // token valid, allow rendering
      } catch (err) {
        localStorage.removeItem("token");
        router.push("/admin/login");
      }
    };

    verifyToken();
  }, [router]);

  // ----------------------------
  // Fetch all users
  // ----------------------------
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://bluenile.onrender.com/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
      setFiltered(res.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) fetchUsers();
  }, [authorized]);

  // ----------------------------
  // Filter by search
  // ----------------------------
  useEffect(() => {
    let temp = [...users];
    if (search) {
      temp = temp.filter(
        (u) =>
          (u.fullName &&
            u.fullName.toLowerCase().includes(search.toLowerCase())) ||
          (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
      );
    }
    setFiltered(temp);
  }, [search, users]);

  // ----------------------------
  // Delete user
  // ----------------------------
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://bluenile.onrender.com/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (!authorized)
    return (
      <p className="text-center mt-10 text-gray-700">
        Checking admin access...
      </p>
    );

  if (loading)
    return <p className="text-center mt-10 text-gray-700">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Users</h1>

      {/* Search bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded w-full"
        />
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Email", "Phone", "Role", "Joined", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((u) => (
              <tr key={u._id}>
                <td className="px-4 py-2">{u.fullName}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.phone || "-"}</td>
                <td className="px-4 py-2">
                  {u.role === "admin" ? (
                    <span className="text-blue-600 font-semibold">Admin</span>
                  ) : (
                    <span className="text-gray-700">User</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center py-4 text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
}
