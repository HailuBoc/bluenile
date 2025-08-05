"use client";
import { Menu, Search, Globe, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md px-4 py-3 flex items-center justify-between md:px-6">
      {/* Left - Logo and Brand */}
      <div className="flex items-center gap-2">
        <img
          src="/akotet.png"
          alt="Akotet"
          className="h-10 w-auto transition-transform duration-300 hover:scale-110"
        />
        <span className="text-xl sm:text-2xl font-extrabold text-blue-900 tracking-wider uppercase">
          Akotet
        </span>
      </div>

      {/* Middle - Search Bar (Responsive) */}
      <div className="hidden sm:flex items-center justify-between border rounded-full shadow-sm px-4 py-2 w-full max-w-sm mx-4">
        <input
          type="text"
          placeholder="Search destinations"
          className="flex-grow bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400"
        />
        <Search className="h-5 w-5 text-white bg-red-400 p-1 rounded-full cursor-pointer" />
      </div>

      {/* Right - User Section */}
      <div className="flex items-center gap-3 text-gray-500">
        <p className="hidden md:inline cursor-pointer text-sm">Become a host</p>
        <Globe className="h-5 w-5 cursor-pointer" />
        <div
          className="flex items-center border p-2 rounded-full space-x-2 cursor-pointer md:hidden"
          onClick={() => setNavOpen(!navOpen)}
        >
          <Menu className="h-5 w-5" />
          <User className="h-5 w-5" />
        </div>
        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center border p-2 rounded-full space-x-2 cursor-pointer">
          <Menu className="h-5 w-5" />
          <User className="h-5 w-5" />
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {navOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-start px-5 py-4 space-y-3 md:hidden">
          <a href="#" className="text-gray-700 text-sm hover:text-red-500">
            Homes
          </a>
          <a href="#" className="text-gray-700 text-sm hover:text-red-500">
            Services
          </a>
          <a href="#" className="text-gray-700 text-sm hover:text-red-500">
            Experiences
          </a>
          <div className="flex w-full mt-3 border rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Search destinations"
              className="flex-grow bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400"
            />
            <Search className="h-5 w-5 text-white bg-red-400 p-1 rounded-full cursor-pointer" />
          </div>
        </div>
      )}
    </header>
  );
}
