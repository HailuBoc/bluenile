import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Providers from "../components/Providers";
import ResponsiveLayout from "../components/ResponsiveLayout";
import { LoadingBar } from "../components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // ✅ Font display optimization
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // ✅ Font display optimization
});

export const metadata = {
  title: "Blue Nile PLC",
  description: "Made by Hailegebrel Yalember",
  icons: {
    icon: "/favicon copy.ico", // fallback for browsers
    shortcut: "/favicon copy.ico", // shortcut icon
    apple: "/favicon copy.ico", // iOS devices
  },
  // ✅ Performance meta tags
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* ✅ Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* ✅ Explicit favicon links for maximum compatibility */}
        <link rel="icon" href="/favicon copy.ico" sizes="any" />
        <link
          rel="icon"
          type="image/jpg"
          sizes="32x32"
          href="/favicon copy.ico"
        />
        <link rel="apple-touch-icon" href="/favicon copy.ico" />
        <meta property="og:image" content="/favicon copy.ico" />
        
        {/* ✅ DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//api.example.com" />
        
        {/* ✅ Enhanced meta tags for PWA */}
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Blue Nile PLC" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Blue Nile PLC" />
        <meta name="msapplication-TileColor" content="#1e3a8a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* ✅ PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* ✅ Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ResponsiveLayout>
            <LoadingBar isLoading={false} />
            {children}
          </ResponsiveLayout>
        </Providers>
      </body>
    </html>
  );
}
