import ProductCard from "./ProductCard";

const listings = [
  {
    image: "/p1.png",
    title: "Cozy cabin in the woods",
    location: "Meskel Flower",
    price: "120 birr/night",
    rating: 4.9,
    guestFavorite: true,
  },
  {
    image: "/p2.png",
    title: "Modern apartment near downtown",
    location: "CMC",
    price: "180 birr/night",
    rating: 4.7,
    guestFavorite: true,
  },
  {
    image: "/p3.png",
    title: "Beachside bungalow",
    location: "Kolfe",
    price: "220 birr/night",
    rating: 4.8,
    guestFavorite: true,
  },
  {
    image: "/p4.png",
    title: "Mountain view retreat",
    location: "Arada",
    price: "150 birr/night",
    rating: 4.6,
    guestFavorite: true,
  },
  {
    image: "/p5.png",
    title: "Rustic country home",
    location: "Semit 72",
    price: "110 birr/night",
    rating: 4.5,
    guestFavorite: true,
  },
  {
    image: "/p11.png",
    title: "Tiny house getaway",
    location: "Bole Arabsa",
    price: "90 birr/night",
    rating: 4.7,
    guestFavorite: true,
  },
  {
    image: "/p7.png",
    title: "Desert dome escape",
    location: "Fiyel Bet",
    price: "140 birr/night",
    rating: 4.8,
    guestFavorite: true,
  },
  {
    image: "/p8.png",
    title: "Urban loft with skyline view",
    location: "Kaliti",
    price: "175 birr/night",
    rating: 4.9,
    guestFavorite: true,
  },
  {
    image: "/p9.png",
    title: "Countryside villa",
    location: "Jemo 1",
    price: "200 birr/night",
    rating: 4.6,
    guestFavorite: true,
  },
  {
    image: "/p10.png",
    title: "Treehouse Experience",
    location: "Asko Addis-Sefer",
    price: "160 birr/night",
    rating: 4.7,
    guestFavorite: true,
  },
  {
    image: "/p13.png",
    title: "Jungle Canopy Hideout",
    location: "Betel",
    price: "165 birr/night",
    rating: 4.8,
    guestFavorite: true,
  },
  {
    image: "/p14.png",
    title: "Luxury Treetop Suite",
    location: "Megenagna",
    price: "170 birr/night",
    rating: 4.9,
    guestFavorite: true,
  },
];

export default function ProductsSection() {
  return (
    <section className="px-4 sm:px-6 pt-6 pb-12">
      <h2 className="text-xl sm:text-2xl font-semibold pb-5 text-gray-800">
        Live Anywhere
      </h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {listings.map((listing, index) => (
          <ProductCard key={index} {...listing} />
        ))}
      </div>
    </section>
  );
}
// import ProductCard from "./ProductCard";

// const listings = [
//   {
//     image: "/p1.png",
//     title: "Cozy cabin in the woods",
//     location: "Meskel Flower",
//     price: "120 birr/night",
//     rating: 4.9,
//     guestFavorite: true,
//   },
//   // ... (rest of the listings)
// ];

// export default function ProductsSection() {
//   return (

//   );
// }
