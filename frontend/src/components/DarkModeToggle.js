"use client";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`
        relative p-3 rounded-full transition-all duration-300 ease-in-out
        ${
          isDarkMode
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
            : "bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg shadow-yellow-500/25"
        }
        hover:scale-110 active:scale-95
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        className="flex items-center justify-center"
        initial={false}
        animate={{ rotate: isDarkMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDarkMode ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </motion.div>

      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0"
        animate={{
          opacity: isDarkMode ? [0, 0.3, 0] : [0, 0.2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: isDarkMode
            ? "radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, transparent 70%)",
        }}
      />
    </motion.button>
  );
}





