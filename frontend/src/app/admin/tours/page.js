// "use client";
// import { useEffect, useState } from "react";

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "https://bluenile.onrender.com";

// export default function AdminTours() {
//   const [tours, setTours] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     type: "regular", // "regular" or "vip"
//     category: "",
//     name: "",
//     description: "",
//     date: "",
//     destinations: [],
//     highlights: [],
//     icon: "",
//     image: "",
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [message, setMessage] = useState(null);

//   // Fetch tours from API
//   const fetchTours = async () => {
//     try {
//       const res = await fetch(`${API_URL}/tours`);
//       const data = await res.json();
//       setTours(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchTours();
//   }, []);

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleArrayChange = (name, value) => {
//     setForm((prev) => ({
//       ...prev,
//       [name]: value.split(",").map((v) => v.trim()),
//     }));
//   };

//   // Submit form (add or edit)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     try {
//       const method = editingId ? "PUT" : "POST";
//       const url = editingId
//         ? `${API_URL}/tours/${editingId}`
//         : `${API_URL}/tours`;
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error || data.message);

//       setMessage({ type: "success", text: data.message || "Success!" });
//       setForm({
//         type: "regular",
//         category: "",
//         name: "",
//         description: "",
//         date: "",
//         destinations: [],
//         highlights: [],
//         icon: "",
//         image: "",
//       });
//       setEditingId(null);
//       fetchTours();
//     } catch (err) {
//       setMessage({ type: "error", text: err.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Edit tour
//   const handleEdit = (tour) => {
//     setEditingId(tour._id);
//     setForm({
//       type: tour.type,
//       category: tour.category || "",
//       name: tour.name || "",
//       description: tour.description || "",
//       date: tour.date || "",
//       destinations: tour.destinations || [],
//       highlights: tour.highlights || [],
//       icon: tour.icon || "",
//       image: tour.image || "",
//     });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Delete tour
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this tour?")) return;
//     try {
//       const res = await fetch(`${API_URL}/tours/${id}`, { method: "DELETE" });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || data.message);
//       setMessage({ type: "success", text: data.message });
//       fetchTours();
//     } catch (err) {
//       setMessage({ type: "error", text: err.message });
//     }
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Admin Tour Management</h1>

//       {message && (
//         <div
//           className={`mb-4 p-3 rounded text-sm ${
//             message.type === "success"
//               ? "bg-green-100 text-green-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {message.text}
//         </div>
//       )}

//       {/* Tour Form */}
//       <form
//         className="bg-white p-6 rounded shadow mb-8"
//         onSubmit={handleSubmit}
//       >
//         <h2 className="text-xl font-semibold mb-3">
//           {editingId ? "Edit Tour" : "Add New Tour"}
//         </h2>

//         <div className="mb-3">
//           <label className="block mb-1 font-semibold">Type</label>
//           <select
//             name="type"
//             value={form.type}
//             onChange={handleChange}
//             className="border rounded px-3 py-2 w-full"
//           >
//             <option value="regular">Regular</option>
//             <option value="vip">VIP</option>
//           </select>
//         </div>

//         {form.type === "regular" && (
//           <>
//             <div className="mb-3">
//               <label className="block mb-1 font-semibold">Category</label>
//               <input
//                 name="category"
//                 value={form.category}
//                 onChange={handleChange}
//                 className="border rounded px-3 py-2 w-full"
//               />
//             </div>
//             <div className="mb-3">
//               <label className="block mb-1 font-semibold">
//                 Destinations (comma-separated)
//               </label>
//               <input
//                 name="destinations"
//                 value={form.destinations.join(", ")}
//                 onChange={(e) =>
//                   handleArrayChange("destinations", e.target.value)
//                 }
//                 className="border rounded px-3 py-2 w-full"
//               />
//             </div>
//             <div className="mb-3">
//               <label className="block mb-1 font-semibold">
//                 Icon (lucide-react)
//               </label>
//               <input
//                 name="icon"
//                 value={form.icon}
//                 onChange={handleChange}
//                 className="border rounded px-3 py-2 w-full"
//               />
//             </div>
//           </>
//         )}

//         {form.type === "vip" && (
//           <>
//             <div className="mb-3">
//               <label className="block mb-1 font-semibold">Name</label>
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 className="border rounded px-3 py-2 w-full"
//               />
//             </div>
//             <div className="mb-3">
//               <label className="block mb-1 font-semibold">Description</label>
//               <textarea
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//                 className="border rounded px-3 py-2 w-full"
//               />
//             </div>
//             <div className="mb-3">
//               <label className="block mb-1 font-semibold">Date Info</label>
//               <input
//                 name="date"
//                 value={form.date}
//                 onChange={handleChange}
//                 className="border rounded px-3 py-2 w-full"
//               />
//             </div>
//             <div className="mb-3">
//               <label className="block mb-1 font-semibold">
//                 Highlights (comma-separated)
//               </label>
//               <input
//                 name="highlights"
//                 value={form.highlights.join(", ")}
//                 onChange={(e) =>
//                   handleArrayChange("highlights", e.target.value)
//                 }
//                 className="border rounded px-3 py-2 w-full"
//               />
//             </div>
//             <div className="mb-3">
//               <label className="block mb-1 font-semibold">Image URL</label>
//               <input
//                 name="image"
//                 value={form.image}
//                 onChange={handleChange}
//                 className="border rounded px-3 py-2 w-full"
//               />
//             </div>
//           </>
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           {loading ? "Saving..." : editingId ? "Update Tour" : "Add Tour"}
//         </button>
//       </form>

//       {/* Tour List */}
//       <h2 className="text-xl font-semibold mb-3">Existing Tours</h2>
//       <div className="space-y-4">
//         {tours.map((tour) => (
//           <div
//             key={tour._id}
//             className="bg-white p-4 rounded shadow flex justify-between items-center"
//           >
//             <div>
//               <p className="font-bold">
//                 {tour.type === "vip" ? tour.name : tour.category}
//               </p>
//               {tour.type === "regular" && (
//                 <p className="text-sm text-gray-600">
//                   {tour.destinations.join(", ")}
//                 </p>
//               )}
//               {tour.type === "vip" && (
//                 <p className="text-sm text-gray-600">
//                   {tour.highlights.join(", ")}
//                 </p>
//               )}
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => handleEdit(tour)}
//                 className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(tour._id)}
//                 className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import Link from "next/link";

export default function ToursPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Tours Management</h1>
      <p className="text-gray-600 mb-8">
        Choose which type of tours you want to manage:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* VIP Tours */}
        <Link
          href="/admin/Tours/viptour"
          className="block bg-blue-600 text-white text-center py-6 rounded-xl shadow hover:bg-blue-700 transition"
        >
          Manage VIP Tours
        </Link>

        {/* Regular Tours */}
        <Link
          href="/admin/Tours/regulartour"
          className="block bg-green-600 text-white text-center py-6 rounded-xl shadow hover:bg-green-700 transition"
        >
          Manage Regular Tours
        </Link>
      </div>
    </div>
  );
}
