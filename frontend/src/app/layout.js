import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Providers from "../components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Blue Nile PLC",
  description: "Made by Hailegebrel Yalember",
  icons: {
    icon: "/favicon copy.ico", // fallback for browsers
    shortcut: "/favicon copy.ico", // shortcut icon
    apple: "/favicon copy.ico", // iOS devices
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
