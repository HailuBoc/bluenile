"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const CustomButton = ({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  disabled = false,
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center gap-2
    font-semibold rounded-full transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-4 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-purple-600 text-white
      hover:from-blue-700 hover:to-purple-700
      shadow-lg hover:shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40
      focus:ring-blue-500/50
    `,
    secondary: `
      bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200
      hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700
      shadow-md hover:shadow-lg shadow-gray-500/25 dark:shadow-gray-700/25
      focus:ring-gray-500/50
    `,
    accent: `
      bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900
      hover:from-yellow-500 hover:to-orange-600
      shadow-lg hover:shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40
      focus:ring-yellow-500/50
    `,
    ghost: `
      bg-transparent border-2 border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500
      focus:ring-gray-500/50
    `,
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]}`;

  const buttonContent = (
    <motion.div
      className="flex items-center justify-center gap-2"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>

      {/* Animated background glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0"
        whileHover={{
          opacity: [0, 0.1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            variant === "primary"
              ? "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)"
              : variant === "accent"
              ? "radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(156, 163, 175, 0.3) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={buttonClasses}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <motion.button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {buttonContent}
    </motion.button>
  );
};

export default CustomButton;

