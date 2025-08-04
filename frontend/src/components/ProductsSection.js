import ProductCard from "./ProductCard";

const listings = [
  {
    image: "/p1.png",
    title: "Cozy cabin in the woods",
    location: "Meskel Flower",
    price: "120 birr/night",
  },
  {
    image: "/p2.png",
    title: "Modern apartment near downtown",
    location: "CMC",
    price: "180 birr/night",
  },
  {
    image: "/p3.png",
    title: "Beachside bungalow",
    location: "Kolfe",
    price: "220 birr/night",
  },
  {
    image: "/p4.png",
    title: "Mountain view retreat",
    location: "Arada",
    price: "150 birr/night",
  },
  {
    image: "/p5.png",
    title: "Rustic country home",
    location: "Semit 72",
    price: "110 birr/night",
  },
  {
    image: "/p11.png",
    title: "Tiny house getaway",
    location: "Bole Arabsa",
    price: "90 birr/night",
  },
  {
    image: "/p7.png",
    title: "Desert dome escape",
    location: "Fiyel Bet",
    price: "140 birr/night",
  },
  {
    image: "/p8.png",
    title: "Urban loft with skyline view",
    location: "Kaliti",
    price: "175 birr/night",
  },
  {
    image: "/p9.png",
    title: "Countryside villa",
    location: "Jemo 1",
    price: "200 birr/night",
  },
  {
    image: "/p10.png",
    title: "Treehouse experience",
    location: "Asko Addis-Sefer",
    price: "160 birr/night",
  },
];

export default function ProductsSection() {
  return (
    <section className="px-6 pt-6 pb-12">
      <h2 className="text-2xl font-semibold pb-5">Live Anywhere</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing, index) => (
          <ProductCard key={index} {...listing} />
        ))}
      </div>
    </section>
  );
}
