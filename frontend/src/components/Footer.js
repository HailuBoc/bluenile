import { Instagram, Linkedin, Youtube } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-300 text-sm border-t border-gray-700/50 mt-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-8 xs:py-10 sm:py-12">
        {/* Top Section: Footer Columns */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-6 xs:gap-8 pb-8 xs:pb-10 sm:pb-12 text-center xs:text-left sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="font-bold text-white mb-3 xs:mb-4 text-base xs:text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              About
            </h3>
            <ul className="space-y-2 xs:space-y-3">
              <li>
                <a
                  href="/aboutus"
                  className="hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  How Blue Nile PLC works
                </a>
              </li>

              <li>
                <a
                  href="/auth/login"
                  className="hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Blue Nile Plus
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-bold text-white mb-3 xs:mb-4 text-base xs:text-lg bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Community
            </h3>
            <ul className="space-y-2 xs:space-y-3">
              <li>
                <a
                  href="/auth/login"
                  className="hover:text-green-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  This is a real site
                </a>
              </li>
              <div className="flex flex-wrap justify-center gap-4 xs:gap-6 pb-6 xs:pb-8">
                <a
                  href="https://www.tiktok.com/@bluenile32?_t=ZM-8ywz8okk59J&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-all duration-300 hover:scale-125 p-2 rounded-full hover:bg-blue-500/10"
                >
                  <FaTiktok className="h-5 w-5 xs:h-6 xs:w-6" />
                </a>
                <a
                  href="https://x.com/BlueNile374131?t=p0q0DtyhwBVfQwIysudJXQ&s=35"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-400 transition-all duration-300 hover:scale-125 p-2 rounded-full hover:bg-sky-500/10"
                >
                  <FaXTwitter className="h-5 w-5 xs:h-6 xs:w-6" />
                </a>
                <a
                  href="https://www.instagram.com/blue.nile66?utm_source=qr&igsh=MWE0enpybWRqa2k2dQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-400 transition-all duration-300 hover:scale-125 p-2 rounded-full hover:bg-pink-500/10"
                >
                  <Instagram className="h-5 w-5 xs:h-6 xs:w-6" />
                </a>
                <a
                  href="https://www.linkedin.com/groups/13354352"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-all duration-300 hover:scale-125 p-2 rounded-full hover:bg-blue-500/10"
                >
                  <Linkedin className="h-5 w-5 xs:h-6 xs:w-6" />
                </a>
                <a
                  href="https://youtube.com/@bluenile-z8t?si=Gyhp8MsqaPwvaCoO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-all duration-300 hover:scale-125 p-2 rounded-full hover:bg-red-500/10"
                >
                  <Youtube className="h-5 w-5 xs:h-6 xs:w-6" />
                </a>
              </div>
            </ul>
          </div>

          {/* Host */}
          <div>
            <h3 className="font-bold text-white mb-3 xs:mb-4 text-base xs:text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Host
            </h3>
            <ul className="space-y-2 xs:space-y-3">
              <li>
                <a
                  href="/listProperty"
                  className="hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Become a Host
                </a>
              </li>
              <li>
                <a
                  href="/auth/login"
                  className="hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Blue Nile for Work
                </a>
              </li>
              <li>
                <a
                  href="/listProperty"
                  className="hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Host resources
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white mb-3 xs:mb-4 text-base xs:text-lg bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Support
            </h3>
            <ul className="space-y-2 xs:space-y-3">
              <li>
                <a
                  href="/auth/login"
                  className="hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/cancellation"
                  className="hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Cancellation options
                </a>
              </li>
              <li>
                <a
                  href="/auth/login"
                  className="hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Neighborhood Support
                </a>
              </li>
              <li>
                <a
                  href="/auth/login"
                  className="hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Trust & Safety
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-700/50 pt-6 xs:pt-8 gap-3 xs:gap-4 text-center sm:text-left">
          <p className="text-xs xs:text-sm text-gray-400">
            © {new Date().getFullYear()} Blue Nile PLC · Privacy · Terms ·
            Sitemap
          </p>
          <div className="flex flex-col sm:flex-row gap-2 xs:gap-3 sm:gap-6 text-xs xs:text-sm">
            <span className="cursor-pointer hover:text-blue-400 transition-colors duration-300">
              English (EN)
            </span>
            <span className="cursor-pointer hover:text-blue-400 transition-colors duration-300">
              ETB (Birr)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
