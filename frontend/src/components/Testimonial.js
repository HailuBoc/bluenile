"use client";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  BsFacebook,
  BsLinkedin,
  BsTelegram,
  BsX,
  BsYoutube,
} from "react-icons/bs";
import { useEffect } from "react";

export default function Testimonial() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#phone") {
      const phoneEl = document.getElementById("phone");
      if (phoneEl) {
        phoneEl.classList.add(
          "bg-green-900",
          "rounded",
          "transition",
          "duration-300"
        );
        setTimeout(() => {
          phoneEl.classList.remove("bg-green-900");
        }, 1500);
      }
    }
  }, []);

  return (
    <footer className="bg-[#111] text-gray-300 pt-12 pb-6 px-4 scroll-smooth">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold text-green-500 mb-2">
            Hulu School
          </h2>
          <p className="text-sm">
            Personalized tutoring to help you reach your academic potential.
            Online or in-person – we’re here for every learner.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-green-500">
                Home
              </a>
            </li>
            <li>
              <a href="/aboutus" className="hover:text-green-500">
                About Us
              </a>
            </li>
            <li>
              <a href="/subjects" className="hover:text-green-500">
                Subjects
              </a>
            </li>
            <li>
              <a href="#phone" className="hover:text-green-500">
                Contact
              </a>
            </li>
            <li>
              <a href="/register" className="hover:text-green-500">
                Register
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <a href="huluschool77@gmail.com">
                <Mail size={18} /> <span>tutor@huluschool.com</span>
              </a>
            </li>
            <li id="phone" className="flex items-start gap-2 scroll-mt-24">
              <Phone size={18} /> <span>+251-939-249-299</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={18} /> <span>Addis Ababa, Ethiopia</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Stay Updated
          </h3>
          <p className="text-sm mb-2">Subscribe to our newsletter</p>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-600 hover:bg-green-700 p-2 rounded text-white text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
        <p className="text-gray-500">
          &copy; {new Date().getFullYear()} Hulu School. All rights reserved.
        </p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <a
            href="https://www.youtube.com/channel/UCLKvnd9LA4mbbFDhCr29VYg"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition"
          >
            <BsYoutube size={20} />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61571803471689"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition"
          >
            <BsFacebook size={20} />
          </a>
          <a
            href="https://x.com/huluschool?t=raOpWe7YW__HKCi70NdM8Q&s=09"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500 transition"
          >
            <BsX size={20} />
          </a>
          <a
            href="https://t.me/+tXsbIL4G0TM0ZGM0"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            <BsTelegram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
