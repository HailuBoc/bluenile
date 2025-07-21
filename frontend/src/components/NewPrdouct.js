import ProductCard from "./ProductCard.js";

const productsData = [
  {
    img: "/chemo.jpg",
    title: "Chemistry",
    desc: "Explore reactions, elements, and formulas.",
    rating: 4.5,
    price: "50 birr per day",
  },
  {
    img: "/bio.jpg",
    title: "Biology",
    desc: "Understand life from cells to systems.",
    rating: 4.2,
    price: "50 birr per day",
  },
  {
    img: "/physics.jpg",
    title: "Physics",
    desc: "Master motion, force, and energy.",
    rating: 4.6,
    price: "50 birr per day",
  },
  {
    img: "/geography.jpg",
    title: "Geography",
    desc: "Study maps, places, and environments.",
    rating: 4.7,
    price: "50 birr per day",
  },
];

const NewPrdouct = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Find Tutors for your subjects
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-8">
          {productsData.map((item, index) => (
            <ProductCard
              key={index}
              img={item.img}
              title={item.title}
              desc={item.desc}
              rating={item.rating}
              price={item.price}
            />
          ))}
        </div>

        {/* Register Button */}
        <div className="mt-12 text-center">
          <a
            href="/register" // <-- change this to your actual route or modal trigger
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-lg transition duration-300"
          >
            Register for All Subjects
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewPrdouct;
