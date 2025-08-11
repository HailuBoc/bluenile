const listings = [
  {
    id: 1,
    img: "/p1.png",
    title: "Cozy cabin in the woods",
    location: "📍 Meskel Flower",
    price: "120 birr/night",
    description:
      "a Peaceful retreat surrounded by nature, perfect for a weekend getway.",
    rating: 4.9,
    guestFavorite: true,
  },
  {
    id: 2,
    img: "/p2.png",
    title: "Modern apartment near downtown",
    location: "📍 CMC",
    price: "180 birr/night",
    description:
      "Stylish and comfortable, this apartment is ideal for city explorers.",
    rating: 4.7,
    guestFavorite: true,
  },
  {
    id: 3,
    img: "/p14.jpg",
    title: "Beachside bungalow",
    location: "📍 Kolfe",
    price: "220 birr/night",
    description:
      "Enjoy the sound of waves and stunning sunsets from this beach front property.",
    rating: 4.8,
    guestFavorite: true,
  },
  {
    id: 4,
    img: "/p13.jpg",
    title: "Mountain view retreat",
    location: "📍 Arada",
    price: "150 birr/night",
    description:
      "A serene escape with breathtaking mountain views, perfect for hiking enthusiasts.",
    rating: 4.6,
    guestFavorite: true,
  },
  {
    id: 5,
    img: "/p10.jpg",
    title: "Rustic country home",
    location: "📍 Semit 72",
    price: "110 birr/night",
    description:
      "Experience the charm of rural living in this cozy country home with modern amenities.",
    rating: 4.5,
    guestFavorite: true,
  },
  {
    id: 6,
    img: "/p11.jpg",
    title: "Tiny house getaway",
    location: "📍 Bole Arabsa",
    price: "90 birr/night",
    description:
      "A minimalist living experience in a beautifully designed tiny house, perfect for solo travelers or couples.",
    rating: 4.7,
    guestFavorite: true,
  },
  {
    id: 7,
    img: "/car1.png",
    title: "Desert Cruiser 4x4",
    location: "📍 Fiyel Bet",
    price: "140 birr/day",
    description:
      "A rugged 4x4 built for desert terrain. Perfect for off-road adventures and remote explorations.",
    rating: 4.8,
    guestFavorite: true,
  },
  {
    id: 8,
    img: "/car2.png",
    title: "Skyline Sedan",
    location: "📍 Kaliti",
    price: "175 birr/day",
    description:
      "A sleek and modern sedan, ideal for city driving with great mileage and a smooth ride.",
    rating: 4.9,
    guestFavorite: true,
  },
  {
    id: 9,
    img: "/car3.png",
    title: "Countryside SUV",
    location: "📍 Jemo 1",
    price: "200 birr/day",
    description:
      "Spacious and powerful SUV, excellent for family trips or long countryside drives.",
    rating: 4.6,
    guestFavorite: true,
  },
  {
    id: 10,
    img: "/car4.png",
    title: "Eco Tree Compact",
    location: "📍 Asko Addis-Sefer",
    price: "160 birr/day",
    description:
      "Compact and eco-friendly hatchback, great for navigating city streets with ease and efficiency.",
    rating: 4.7,
    guestFavorite: true,
  },
  {
    id: 11,
    img: "/car5.png",
    title: "Jungle Runner Jeep",
    location: "📍 Betel",
    price: "165 birr/day",
    description:
      "Durable and adventurous Jeep, designed for rough terrain and wild escapes. A thrill-seeker’s favorite.",
    rating: 4.8,
    guestFavorite: true,
  },
  {
    id: 12,
    img: "/car6.jpg",
    title: "Luxury Cruiser X",
    location: "📍 Megenagna",
    price: "170 birr/day",
    description:
      "Premium SUV with luxurious interiors, panoramic sunroof, and top-tier comfort for long drives.",
    rating: 4.9,
    guestFavorite: true,
  },
];

export default listings;
// "use client";
// import { Menu, Search, X, Home, User, List } from "lucide-react";
// import { useState } from "react";
// import Link from "next/link";

// export default function HeroSection() {
//   const [navOpen, setNavOpen] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);

//   return (
//     <div className="relative bg-blue-900 min-h-screen flex flex-col">
//       {/* ==== TOP BAR ==== */}
//       <div className="absolute top-4 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12">
//         <span className="text-2xl font-bold text-white tracking-wide">
//           Blue Nile Plc
//         </span>

//         <div className="hidden md:flex items-center gap-6 text-sm text-white">
//           <Link href="/listProperty" className="hover:underline transition">
//             List your property
//           </Link>
//           <a
//             href="/login"
//             className="px-4 py-2 border border-white rounded-md text-white hover:bg-white hover:text-blue-900 transition"
//           >
//             Sign in
//           </a>
//           <Link href="/aboutus" className="hover:underline transition">
//             About us
//           </Link>
//         </div>

//         {/* Mobile Top Right Buttons */}
//         <div className="flex md:hidden gap-3">
//           {/* Search toggle */}
//           <button
//             onClick={() => setShowSearch(!showSearch)}
//             className="p-2 bg-white/90 rounded-full shadow-lg"
//           >
//             <Search className="h-5 w-5 text-blue-900" />
//           </button>
//           {/* Menu toggle */}
//           <button
//             onClick={() => setNavOpen(!navOpen)}
//             className="p-2 bg-white/90 rounded-full shadow-lg"
//           >
//             {navOpen ? (
//               <X className="h-5 w-5 text-blue-900" />
//             ) : (
//               <Menu className="h-5 w-5 text-blue-900" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* ==== SIDE MENU MOBILE ==== */}
//       {navOpen && (
//         <div className="fixed inset-0 bg-black/50 z-40 flex justify-end">
//           <div className="bg-white w-64 h-full p-6 flex flex-col gap-6">
//             <Link href="/listProperty" onClick={() => setNavOpen(false)}>
//               List your property
//             </Link>
//             <Link href="/login" onClick={() => setNavOpen(false)}>
//               Sign in
//             </Link>
//             <Link href="/aboutus" onClick={() => setNavOpen(false)}>
//               About us
//             </Link>
//           </div>
//         </div>
//       )}

//       {/* ==== MAIN CONTENT ==== */}
//       <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col h-full px-6 md:px-12 py-6 flex-grow">
//         {/* Services & Search Section */}
//         <div className="flex-grow flex flex-col items-center justify-center text-center px-4 space-y-10">
//           {/* Services */}
//           <nav className="flex flex-wrap justify-center gap-8 text-white text-sm font-semibold max-w-5xl animate-bounce">
//             {[
//               {
//                 href: "/propertyrental",
//                 icon: "🏠",
//                 label: "Property Rentals & Bookings",
//               },
//               { href: "/event", icon: "🎉", label: "Event Venues & Support" },
//               { href: "/transport", icon: "🚗", label: "Transport Services" },
//               { href: "/sales", icon: "🏡", label: "Sales Section" },
//               { href: "/tourism", icon: "🌍", label: "Tourism Services" },
//             ].map((item, i) => (
//               <a
//                 key={i}
//                 href={item.href}
//                 className="group flex flex-col items-center max-w-[150px] p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md hover:bg-slate-400/80 hover:shadow-lg transition-all duration-300 ease-out"
//               >
//                 <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
//                   {item.icon}
//                 </span>
//                 <span className="mt-2 text-center group-hover:underline">
//                   {item.label}
//                 </span>
//               </a>
//             ))}
//           </nav>

//           {/* Welcome */}
//           <div>
//             <h1 className="text-4xl font-extrabold text-white drop-shadow-md">
//               Welcome to Blue Nile PLC
//             </h1>
//             <p className="mt-3 text-lg text-gray-200 drop-shadow-sm max-w-2xl">
//               All-in-one booking platform for properties, events, transport, and
//               tourism in Ethiopia
//             </p>
//           </div>

//           {/* Search (Desktop or Mobile Toggle) */}
//           {(showSearch || typeof window === "undefined") && (
//             <div className="w-full max-w-5xl">
//               <div className="flex items-center justify-between border rounded-full shadow-lg px-6 py-3 bg-white/90 dark:bg-gray-800/90 dark:border-gray-600">
//                 {[
//                   {
//                     label: "Destination",
//                     type: "text",
//                     placeholder: "Where are you going?",
//                   },
//                   { label: "Check-in", type: "date" },
//                   { label: "Check-out", type: "date" },
//                   { label: "Guests", type: "number", placeholder: "2 guests" },
//                 ].map((field, i) => (
//                   <div
//                     key={i}
//                     className={`flex flex-col px-4 ${
//                       i < 3 ? "border-r dark:border-gray-600" : ""
//                     }`}
//                   >
//                     <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
//                       {field.label}
//                     </label>
//                     <input
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       min={field.type === "number" ? "1" : undefined}
//                       className="bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
//                     />
//                   </div>
//                 ))}
//                 <div className="pl-4">
//                   <Search className="h-8 w-8 text-white bg-blue-600 p-2 rounded-full cursor-pointer shadow-lg" />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ==== MOBILE BOTTOM NAV ==== */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-2 flex justify-around items-center md:hidden z-50">
//         <Link href="/" className="flex flex-col items-center">
//           <Home className="h-6 w-6 text-blue-900" />
//           <span className="text-xs">Home</span>
//         </Link>
//         <Link href="/categories" className="flex flex-col items-center">
//           <List className="h-6 w-6 text-blue-900" />
//           <span className="text-xs">Categories</span>
//         </Link>
//         <Link href="/account" className="flex flex-col items-center">
//           <User className="h-6 w-6 text-blue-900" />
//           <span className="text-xs">Account</span>
//         </Link>

//       </div>
//     </div>
//   );
// }
