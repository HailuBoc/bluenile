"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "../utils/cn";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

const containerVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
  out: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const itemVariants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export function PageTransition({ children, className }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={cn("w-full", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function AnimatedContainer({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      variants={containerVariants}
      transition={{ delay }}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ children, className, delay = 0 }) {
  return (
    <motion.div
      variants={itemVariants}
      transition={{ delay }}
      className={cn("", className)}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, className, delay = 0, duration = 0.6 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn("", className)}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({ children, className, direction = "left", delay = 0 }) {
  const directions = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn("", className)}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn("", className)}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredGrid({ children, className, staggerDelay = 0.1 }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      variants={{
        initial: { opacity: 0 },
        in: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={cn("grid", className)}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            initial: { opacity: 0, y: 30 },
            in: {
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export function LoadingBar({ isLoading }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 z-50 origin-left"
          style={{ transformOrigin: "left" }}
        />
      )}
    </AnimatePresence>
  );
}

export function AnimatedBackground({ children, className }) {
  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10"
        animate={{
          background: [
            "linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))",
            "linear-gradient(to bottom right, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1))",
            "linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))",
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      {/* Floating elements */}
      {[...Array(6)].map((_, i) => {
        // Use deterministic positions based on index to avoid hydration mismatch
        const positions = [
          { left: 10, top: 20 },
          { left: 80, top: 10 },
          { left: 25, top: 60 },
          { left: 70, top: 80 },
          { left: 45, top: 40 },
          { left: 90, top: 50 },
        ];
        const position = positions[i % positions.length];
        
        return (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full blur-xl"
            style={{
              left: `${position.left}%`,
              top: `${position.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + (i * 0.5),
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.3,
            }}
          />
        );
      })}
      
      {children}
    </motion.div>
  );
}

export default {
  PageTransition,
  AnimatedContainer,
  AnimatedItem,
  FadeIn,
  SlideIn,
  ScaleIn,
  StaggeredGrid,
  LoadingBar,
  AnimatedBackground,
};
