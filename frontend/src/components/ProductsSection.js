import ProductCard from "./ProductCard";

const listings = [
  {
    image: "/p1.png",
    title: "Cozy cabin in the woods",
    location: "Lake Tahoe",
    price: "$120/night",
  },
  {
    image: "/p2.png",
    title: "Modern apartment near downtown",
    location: "New York",
    price: "$180/night",
  },
  {
    image: "/p3.png",
    title: "Beachside bungalow",
    location: "Malibu",
    price: "$220/night",
  },
  {
    image: "/p4.png",
    title: "Mountain view retreat",
    location: "Aspen",
    price: "$150/night",
  },
  {
    image: "/p5.png",
    title: "Rustic country home",
    location: "Nashville",
    price: "$110/night",
  },
  {
    image: "/p11.png",
    title: "Tiny house getaway",
    location: "Portland",
    price: "$90/night",
  },
  {
    image: "/p7.png",
    title: "Desert dome escape",
    location: "Joshua Tree",
    price: "$140/night",
  },
  {
    image: "/p8.png",
    title: "Urban loft with skyline view",
    location: "Chicago",
    price: "$175/night",
  },
  {
    image: "/p9.png",
    title: "Countryside villa",
    location: "Tuscany",
    price: "$200/night",
  },
  {
    image: "/p10.png",
    title: "Treehouse experience",
    location: "Vermont",
    price: "$160/night",
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
