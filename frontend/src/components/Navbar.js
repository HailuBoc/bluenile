import { Menu, Search, Globe, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md px-5 py-4 flex items-center justify-between">
      {/* Left - Logo and Brand */}
      <div className="flex items-center gap-3">
        <img
          src="/akotet.png"
          alt="Akotet"
          className="h-12 w-auto transition-transform duration-300 hover:scale-110"
        />
        <span className="text-3xl font-extrabold text-blue-900 tracking-wider uppercase">
          Akotet
        </span>
      </div>

      {/* Center - Navigation Links */}
      <nav className="hidden md:flex gap-6 text-gray-700 font-medium text-sm">
        <a href="#" className="hover:text-red-500 transition">
          Homes
        </a>
        <a href="#" className="hover:text-red-500 transition">
          Services
        </a>
        <a href="#" className="hover:text-red-500 transition">
          Experiences
        </a>
      </nav>

      {/* Middle - Search Bar */}
      <div className="flex items-center justify-between border rounded-full shadow-sm px-4 py-2 w-full max-w-md mx-4">
        <input
          type="text"
          placeholder="Search destinations"
          className="flex-grow bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400"
        />
        <Search className="h-5 w-5 text-white bg-red-400 p-1 rounded-full cursor-pointer" />
      </div>

      {/* Right - Profile/User Menu */}
      <div className="flex items-center gap-4 text-gray-500">
        <p className="hidden md:inline cursor-pointer">Become a host</p>
        <Globe className="h-5 w-5 cursor-pointer" />
        <div className="flex items-center border p-2 rounded-full space-x-2 cursor-pointer">
          <Menu className="h-5 w-5" />
          <User className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
}
