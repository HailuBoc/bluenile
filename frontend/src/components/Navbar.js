// import React from "react";
"use client";
import Link from "next/link";
import page from "../app/subjects/page";
import ProductsData from "./NewPrdouct";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const route = useRouter();
  const handleSubjects = () => {
    route.push("/subjects");
  };
  const handleHome = () => {
    route.push("/");
  };
  const handleAbout = () => {
    route.push("/aboutus");
  };
  return (
    <div className="hidden lg:block">
      <div className="container">
        <div className="flex justify-between items-center py-4 font-medium text-black">
          {/* SIGN IN on the left */}

          {/* Centered nav items */}
          <div className="flex gap-10 mx-auto">
            <div className="navbar__link relative cursor-pointer">
              <button onClick={handleHome}>HOME</button>
            </div>
            <div className="navbar__link relative cursor-pointer">
              <button onClick={handleSubjects}>SUBJECTS</button>
            </div>

            <div className="navbar__link relative cursor-pointer">
              <button onClick={handleAbout}>ABOUT US</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
