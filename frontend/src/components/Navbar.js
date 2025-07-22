"use client";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="bg-[#111] text-white shadow-md px-8 py-4 hidden lg:block">
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex gap-10 text-lg font-semibold tracking-wide">
          <button
            onClick={() => router.push("/")}
            className="hover:text-green-400 transition-colors duration-200"
          >
            Home
          </button>
          <button
            onClick={() => router.push("/subjects")}
            className="hover:text-green-400 transition-colors duration-200"
          >
            Subjects
          </button>
          <button
            onClick={() => router.push("/aboutus")}
            className="hover:text-green-400 transition-colors duration-200"
          >
            About Us
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
