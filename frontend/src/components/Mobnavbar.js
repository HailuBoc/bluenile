import React from "react";
import { FiHeart } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { IoMenuOutline } from "react-icons/io5";
import { AiOutlineHome, AiOutlineAppstore } from "react-icons/ai";

const Mobnavbar = () => {
  return (
    <div className="lg:hidden fixed bottom-0 w-full bg-white left-[50%] -translate-x-[50%]">
      <div className="flex justify-between text-[28px] py-2">
        <IoMenuOutline />

        <div className="relative">
          <HiOutlineShoppingBag />
          <div className="bg-red-500 rounded-full absolute top-0 right-0 w-[28px] h-[18px] text-white grid place-items-center translate-x-1 -tray">
            0
          </div>
        </div>

        <AiOutlineHome />

        <div className="relative">
          <FiHeart />
          <div className="bg-red-500 rounded-full absolute top-0 right-0 w-[28px] h-[18px] text-white grid place-items-center translate-x-1 -tray">
            0
          </div>
        </div>
        <AiOutlineAppstore />
      </div>
    </div>
  );
};

export default Mobnavbar;
