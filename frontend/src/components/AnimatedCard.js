"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const AnimatedCard = ({
  children,
  href,
  className = "",
  delay = 0,
  hoverEffect = true,
}) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: "easeOut",
      },
    },
    hover: hoverEffect
      ? {
          y: -8,
          scale: 1.02,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        }
      : {},
  };

  const cardClasses = `
    relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl
    border border-gray-200 dark:border-gray-700
    transition-all duration-300 ease-out
    overflow-hidden
    ${className}
  `;

  const cardContent = (
    <motion.div
      className={cardClasses}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0"
        whileHover={{
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.3), transparent)",
          padding: "1px",
        }}
      />

      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default AnimatedCard;






