// "use client";

// import { useEffect, useState } from "react";
// import Footer from "../../../components/Footer";
// import HousesCard from "../../../components/HousesCard";

// export default function HousesListPage() {
//   const [houses, setHouses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("http://localhost:10000/houses")
//       .then((res) => res.json())
//       .then((data) => setHouses(data))
//       .catch((err) => console.error(err))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-lg">Loading houses...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
//       <section className="flex-grow px-2 sm:px-6 pt-6 pb-24">
//         <h2 className="text-base sm:text-2xl font-semibold pb-4 text-blue-800 dark:text-blue-200 max-w-6xl mx-auto">
//           All Houses
//         </h2>
//         <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6 max-w-6xl mx-auto">
//           {houses.map((house) => (
//             <div key={house._id} className="transform scale-75 sm:scale-100">
//               <HousesCard {...house} />
//             </div>
//           ))}
//         </div>
//       </section>
//       <Footer />
//     </div>
//   );
// }
