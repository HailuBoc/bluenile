// "use client";

// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import Footer from "../../../components/Footer";
// import HousesCard from "../../../components/HousesCard";

// export default function HouseSalePage() {
//   const params = useSearchParams();
//   const houseId = params.get("id");
//   const [house, setHouse] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!houseId) return;
//     fetch(`http://localhost:10000/houses/${houseId}`)
//       .then((res) => res.json())
//       .then((data) => setHouse(data))
//       .catch((err) => console.error(err))
//       .finally(() => setLoading(false));
//   }, [houseId]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-lg">Loading house details...</p>
//       </div>
//     );
//   }

//   if (!house) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-lg">House not found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
//       <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Left: Image */}
//           <div className="md:w-1/2 relative rounded-xl overflow-hidden shadow-lg">
//             <img
//               src={house.imageUrl}
//               alt={house.title}
//               className="w-full h-full object-cover rounded-xl"
//               style={{ minHeight: "400px" }}
//             />
//           </div>

//           {/* Right: Details */}
//           <div className="md:w-1/2 flex flex-col justify-start">
//             <h1 className="text-3xl font-bold mb-2">{house.title}</h1>
//             <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
//               {house.location}
//             </p>
//             <div className="flex items-center mb-2">★ {house.rating}</div>
//             <div className="text-xl font-semibold mb-4">{house.price} Br</div>

//             <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
//               {house.description}
//             </p>

//             <a
//               href={`/sections/houses/reserveHouse?id=${house._id}`}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
//             >
//               Reserve Now
//             </a>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }
