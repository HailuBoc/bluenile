export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-sm border-t border-gray-200 dark:border-gray-700 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top Section: Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10">
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

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6">
          <p>
            © {new Date().getFullYear()} Blue Nile PLC · Privacy · Terms ·
            Sitemap
          </p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <span className="cursor-pointer hover:underline">English (EN)</span>
            <span className="cursor-pointer hover:underline">ETB (Birr)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
