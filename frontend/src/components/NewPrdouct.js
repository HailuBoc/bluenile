// import React from "react";
import ProductCard from "./ProductCard.js";

const productsData = [
  {
    img: "/chemo.jpg",
    title: "Chemistry",
    desc: "Chemistry is where curiosity meets precision, mixing imagination with exact formulas to unlock powerful results.",
    rating: 4.5,
    price: "50 birr per day",
  },
  {
    img: "/bio.jpg",
    title: "Biology",
    desc: "It asks the most fundamental question: What does it mean to be alive?—then answers it at every level, from genes to galaxies of organisms.",
    rating: 4.2,
    price: "50 birr per day ",
  },
  {
    img: "/physics.jpg",
    title: "Physics",
    desc: "Through physics, we learn that no mystery is too deep and no problem too complex to unravel with careful thought and precise measurement.",
    rating: 4.6,
    price: "50 birr per day",
  },
  {
    img: "/geography.jpg",
    title: "Geography",
    desc: "From mountain ranges to megacities, geography uncovers the relationships between people, places, and the planet.",
    rating: 4.7,
    price: "50 birr per day",
  },
];

const NewPrdouct = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Subjects You may need
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
      </div>
    </div>
  );
};

export default NewPrdouct;
