"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Instagram, 
  Linkedin, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronUp,
  Heart,
  Globe,
  Shield,
  Users
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { cn } from "../utils/cn";
import { InteractiveButton } from "./InteractiveComponents";

const footerSections = [
  {
    title: "Company",
    items: [
      { label: "About Us", href: "/aboutus" },
      { label: "Services", href: "/services" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
    icon: <Globe className="h-5 w-5" />,
    gradient: "from-blue-400 to-purple-400",
  },
  {
    title: "Services",
    items: [
      { label: "Property Rentals", href: "/propertyrental" },
      { label: "Event Venues", href: "/event" },
      { label: "Transport Services", href: "/transport" },
      { label: "Tourism", href: "/tourism" },
    ],
    icon: <Users className="h-5 w-5" />,
    gradient: "from-green-400 to-blue-400",
  },
  {
    title: "Support",
    items: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
    icon: <Shield className="h-5 w-5" />,
    gradient: "from-orange-400 to-red-400",
  },
  {
    title: "Connect",
    items: [
      { label: "Facebook", href: "#" },
      { label: "Twitter", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Instagram", href: "#" },
    ],
    icon: <Heart className="h-5 w-5" />,
    gradient: "from-purple-400 to-pink-400",
  },
];

const socialLinks = [
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@bluenile32?_t=ZM-8ywz8okk59J&_r=1",
    icon: <FaTiktok className="h-5 w-5" />,
    color: "hover:text-blue-400 hover:bg-blue-500/10",
  },
  {
    name: "Twitter",
    href: "https://x.com/BlueNile374131?t=p0q0DtyhwBVfQwIysudJXQ&s=35",
    icon: <FaXTwitter className="h-5 w-5" />,
    color: "hover:text-sky-400 hover:bg-sky-500/10",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/blue.nile66?utm_source=qr&igsh=MWE0enpybWRqa2k2dQ==",
    icon: <Instagram className="h-5 w-5" />,
    color: "hover:text-pink-400 hover:bg-pink-500/10",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/groups/13354352",
    icon: <Linkedin className="h-5 w-5" />,
    color: "hover:text-blue-400 hover:bg-blue-500/10",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@bluenile-z8t?si=Gyhp8MsqaPwvaCoO",
    icon: <Youtube className="h-5 w-5" />,
    color: "hover:text-red-400 hover:bg-red-500/10",
  },
];

export default function EnhancedFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  const toggleSection = (title) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-full blur-xl"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 1,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-gray-700/50">
          <div className="container-responsive py-12 xs:py-16">
            <div className="text-center max-w-2xl mx-auto">
              <motion.h2 
                className="text-2xl xs:text-3xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Stay Updated with Blue Nile PLC
              </motion.h2>
              <motion.p 
                className="text-gray-400 mb-8 text-sm xs:text-base"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Get the latest updates on properties, events, and exclusive offers delivered to your inbox.
              </motion.p>
              
              <motion.form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all duration-300"
                  required
                />
                <InteractiveButton type="submit" size="md">
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </InteractiveButton>
              </motion.form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container-responsive py-12 xs:py-16">
          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${section.gradient}`}>
                    {section.icon}
                  </div>
                  <h3 className={`font-bold text-white bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent`}>
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6 mb-12">
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${section.gradient}`}>
                      {section.icon}
                    </div>
                    <h3 className={`font-bold text-white bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent`}>
                      {section.title}
                    </h3>
                  </div>
                  <ChevronUp 
                    className={cn(
                      "h-5 w-5 transition-transform duration-300",
                      expandedSection === section.title && "rotate-180"
                    )} 
                  />
                </button>
                
                <AnimatePresence>
                  {expandedSection === section.title && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0">
                        <ul className="space-y-3">
                          {section.items.map((item) => (
                            <li key={item.label}>
                              <a
                                href={item.href}
                                className="block py-2 text-gray-300 hover:text-white transition-colors duration-300"
                              >
                                {item.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Contact Information */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <Phone className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-white font-medium">+251 911 234 567</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <div className="p-2 bg-secondary-500/20 rounded-lg">
                <Mail className="h-5 w-5 text-secondary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white font-medium">info@bluenileplc.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <div className="p-2 bg-success/20 rounded-lg">
                <MapPin className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Address</p>
                <p className="text-white font-medium">Addis Ababa, Ethiopia</p>
              </div>
            </div>
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-6">Follow Us</h3>
            <div className="flex justify-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-full bg-white/10 border border-white/20 transition-all duration-300 hover:scale-110 ${social.color}`}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700/50 pt-8">
            <motion.div
              className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
                <p>© {new Date().getFullYear()} Blue Nile PLC</p>
                <span className="hidden sm:inline">•</span>
                <div className="flex gap-4">
                  <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                  <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                  <a href="/sitemap" className="hover:text-white transition-colors">Sitemap</a>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <select className="bg-transparent text-gray-400 hover:text-white transition-colors outline-none cursor-pointer">
                    <option value="en">English (EN)</option>
                    <option value="am">አማርኛ (AM)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">ETB</span>
                  <span className="text-gray-400">Birr</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
