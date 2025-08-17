import { Instagram, Linkedin, Youtube } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-sm border-t border-gray-200 dark:border-gray-700 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Top Section: Footer Columns */}
        <div className="grid grid-cols-1 gap-8 pb-10 sm:grid-cols-2 lg:grid-cols-4 text-center sm:text-left">
          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              About
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  How Blue Nile PLC works
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Newsroom
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Investors
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Blue Nile Plus
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Blue Nile Luxe
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              Community
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Accessibility
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  This is not a real site
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  It’s a demo
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Built with Next.js
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Tailwind CSS
                </a>
              </li>
            </ul>
          </div>

          {/* Host */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              Host
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Become a Host
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Blue Nile for Work
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Host resources
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Community Center
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Cancellation options
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Neighborhood Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Trust & Safety
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center sm:justify-start gap-4 pb-6">
          <a
            href="https://www.tiktok.com/@bluenile32?_t=ZM-8ywz8okk59J&_r=1"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            <FaTiktok className="h-5 w-5" />
          </a>
          <a
            href="https://x.com/BlueNile374131?t=p0q0DtyhwBVfQwIysudJXQ&s=35"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-500"
          >
            <FaXTwitter className="h-5 w-5" />
          </a>
          <a
            href="https://www.instagram.com/blue.nile66?utm_source=qr&igsh=MWE0enpybWRqa2k2dQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/groups/13354352"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://youtube.com/@bluenile-z8t?si=Gyhp8MsqaPwvaCoO"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-600"
          >
            <Youtube className="h-5 w-5" />
          </a>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6 gap-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm">
            © {new Date().getFullYear()} Blue Nile PLC · Privacy · Terms ·
            Sitemap
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm">
            <span className="cursor-pointer hover:underline">English (EN)</span>
            <span className="cursor-pointer hover:underline">ETB (Birr)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
