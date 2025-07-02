"use client";
import React, { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const ProductCard = ({ img, title, desc, rating, price }) => {
  const [showModal, setShowModal] = useState(false);

  const generateRating = (rating) => {
    switch (rating) {
      case 1:
        return (
          <div className="flex gap-1 text-[20px] text-[#fbbd0f]">
            <AiFillStar />
            <AiOutlineStar />
            <AiOutlineStar />
            <AiOutlineStar />
            <AiOutlineStar />
          </div>
        );
      case 2:
        return (
          <div className="flex gap-1 text-[20px] text-[#fbbd0f]">
            <AiFillStar />
            <AiFillStar />
            <AiOutlineStar />
            <AiOutlineStar />
            <AiOutlineStar />
          </div>
        );
      case 3:
        return (
          <div className="flex gap-1 text-[20px] text-[#fbbd0f]">
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiOutlineStar />
            <AiOutlineStar />
          </div>
        );
      case 4:
        return (
          <div className="flex gap-1 text-[20px] text-[#fbbd0f]">
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiOutlineStar />
          </div>
        );
      case 5:
        return (
          <div className="flex gap-1 text-[20px] text-[#fbbd0f]">
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Card */}
      <div
        className="relative px-4 py-4 border border-gray-700 rounded-xl max-w-[400px] shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group bg-neutral-800"
        onClick={() => setShowModal(true)}
      >
        <img
          className="w-full h-auto rounded-md transition-transform duration-300 group-hover:scale-105"
          src={img}
          width={200}
          height={300}
          alt={title}
        />
        <div className="space-y-2 py-2">
          <h2 className="text-white font-medium uppercase">{title}</h2>
          <p className="text-gray-400 max-w-[150px] truncate">{desc}</p>
          <div>{generateRating(rating)}</div>
          <div className="font-bold flex gap-4 text-white">
            {price}
            <del className="text-gray-400 font-normal">
              {parseInt(price) + 30} birr
            </del>
          </div>
        </div>

        {/* Tooltip */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition duration-300 z-20">
          Click to view more
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-neutral-900 text-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-4 text-gray-400 hover:text-red-600 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <img
              src={img}
              alt={title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-gray-300 mt-2">{desc}</p>
            <div className="mt-4 flex justify-between items-center">
              <div>{generateRating(rating)}</div>
              <div className="text-lg font-bold">{price}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
