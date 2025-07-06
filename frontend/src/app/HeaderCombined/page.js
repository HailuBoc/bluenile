"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BsFacebook, BsTwitter, BsYoutube } from "react-icons/bs";

export default function HeaderCombined() {
  return (
    <div>
      {/* --- Header Top --- */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* Social Icons - Left Corner */}
            <div className="flex gap-4 text-gray-600">
              <a
                href="https://x.com/huluschool?t=raOpWe7YW__HKCi70NdM8Q&s=09"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition duration-300"
              >
                <BsTwitter size={20} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61571803471689"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition duration-300"
              >
                <BsFacebook size={20} />
              </a>
              <a
                href="https://www.youtube.com/@HuluSchool-23"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-600 transition duration-300"
              >
                <BsYoutube size={20} />
              </a>
            </div>

            {/* Centered Text */}
            <div className="text-gray-700 text-[15px] lg:text-[16px] font-medium text-center w-full lg:w-auto lg:text-left">
              <strong className="text-black mr-1">OUTSTANDING TUTORING</strong>
              FOR THE FUTURE OF YOUR CHILDREN
            </div>
          </div>
        </div>
      </div>

      {/* --- Header Main --- */}
      <header className="border-b border-gray-200 py-6 bg-white shadow-sm">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center justify-center text-center mb-4 sm:mb-0">
            <h1 className="text-4xl font-bold text-[#0a0f2c]">Hulu School</h1>
            <p className="text-sm text-gray-500 tracking-wide mt-1">
              Personalized Online & In-Person Tutoring
            </p>
          </div>

          {/* Horizontal Buttons */}
        </div>
      </header>
    </div>
  );
}
