"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { cn } from "../utils/cn";
import { Heart, Share2, Bookmark, Star, ChevronUp, Download, Eye } from "lucide-react";

// ✅ Interactive Card with hover effects and micro-interactions
export function InteractiveCard({ 
  children, 
  className, 
  onClick, 
  hover = true,
  scale = true,
  glow = false,
  ...props 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.div
      className={cn(
        "card cursor-pointer",
        glow && "hover:shadow-glow-lg",
        className
      )}
      whileHover={hover ? { 
        scale: scale ? 1.05 : 1,
        y: -5,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={scale ? { scale: 0.98 } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTapStart={() => setIsPressed(true)}
      onTapCancel={() => setIsPressed(false)}
      onTap={() => {
        setIsPressed(false);
        onClick?.();
      }}
      {...props}
    >
      {/* Hover overlay effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Press effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="absolute inset-0 bg-primary-500/20 rounded-2xl pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </AnimatePresence>

      {children}
    </motion.div>
  );
}

// ✅ Interactive Button with ripple effect
export function InteractiveButton({ 
  children, 
  className, 
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  loading = false,
  ...props 
}) {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const createRipple = (event) => {
    if (disabled || loading) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "bg-transparent text-white border border-white/20 hover:bg-white/10",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden rounded-full font-semibold transition-all duration-300",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        loading && "cursor-wait",
        className
      )}
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseDown={createRipple}
      {...props}
    >
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </AnimatePresence>

      {/* Loading state */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}

      <span className={cn("relative z-10", loading && "opacity-0")}>
        {children}
      </span>
    </motion.button>
  );
}

// ✅ Interactive Like Button with animation
export function LikeButton({ 
  initialLiked = false, 
  className, 
  onLikeChange,
  ...props 
}) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setIsAnimating(true);
    onLikeChange?.(!isLiked);
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <motion.button
      className={cn(
        "touch-target p-2 rounded-full transition-all duration-300",
        isLiked 
          ? "bg-red-500 text-white shadow-lg shadow-red-500/50" 
          : "bg-white/10 text-white hover:bg-white/20",
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleLike}
      {...props}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isLiked ? "liked" : "unliked"}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
        </motion.div>
      </AnimatePresence>

      {/* Floating hearts animation */}
      {isAnimating && isLiked && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
              }}
              initial={{ 
                scale: 0,
                x: 0,
                y: 0,
                opacity: 1,
              }}
              animate={{
                scale: [0, 1, 0],
                x: (Math.random() - 0.5) * 100,
                y: -50 - Math.random() * 50,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            >
              <Heart className="h-4 w-4 text-red-500 fill-current" />
            </motion.div>
          ))}
        </div>
      )}
    </motion.button>
  );
}

// ✅ Interactive Rating Component
export function InteractiveRating({ 
  rating = 0, 
  maxRating = 5, 
  readonly = false,
  onRatingChange,
  className,
  ...props 
}) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const handleRatingChange = (newRating) => {
    if (readonly) return;
    setCurrentRating(newRating);
    onRatingChange?.(newRating);
  };

  return (
    <div className={cn("flex gap-1", className)} {...props}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoveredRating || currentRating);
        
        return (
          <motion.button
            key={index}
            type="button"
            className={cn(
              "touch-target p-1 transition-colors",
              readonly && "cursor-default"
            )}
            whileHover={!readonly ? { scale: 1.2 } : {}}
            whileTap={!readonly ? { scale: 0.8 } : {}}
            onClick={() => handleRatingChange(starValue)}
            onMouseEnter={() => !readonly && setHoveredRating(starValue)}
            onMouseLeave={() => !readonly && setHoveredRating(0)}
            disabled={readonly}
          >
            <Star 
              className={cn(
                "h-5 w-5 transition-all duration-200",
                isFilled 
                  ? "text-yellow-400 fill-current" 
                  : "text-gray-400"
              )}
            />
          </motion.button>
        );
      })}
    </div>
  );
}

// ✅ Interactive Share Button with dropdown
export function ShareButton({ className, ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shareOptions = [
    { name: 'Facebook', icon: '📘', action: () => console.log('Share to Facebook') },
    { name: 'Twitter', icon: '🐦', action: () => console.log('Share to Twitter') },
    { name: 'LinkedIn', icon: '💼', action: () => console.log('Share to LinkedIn') },
    { name: 'Copy Link', icon: '🔗', action: () => console.log('Copy link') },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        className={cn(
          "touch-target p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300",
          className
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        <Share2 className="h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 glass rounded-xl p-2 min-w-[200px] z-50"
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {shareOptions.map((option, index) => (
              <motion.button
                key={option.name}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-white hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={option.action}
              >
                <span className="text-xl">{option.icon}</span>
                <span className="text-sm">{option.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ✅ Scroll to Top Button
export function ScrollToTop({ className, ...props }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className={cn(
            "fixed bottom-8 right-8 touch-target p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors z-40",
            className
          )}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          {...props}
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ✅ Interactive Image Gallery
export function InteractiveGallery({ images, className, ...props }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={cn("relative", className)} {...props}>
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <motion.button
              className="absolute left-4 top-1/2 -translate-y-1/2 touch-target p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevImage}
            >
              <ChevronUp className="h-4 w-4 rotate-270" />
            </motion.button>
            
            <motion.button
              className="absolute right-4 top-1/2 -translate-y-1/2 touch-target p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextImage}
            >
              <ChevronUp className="h-4 w-4 rotate-90" />
            </motion.button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "bg-white w-6"
                    : "bg-white/50"
                )}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}

        {/* Fullscreen button */}
        <motion.button
          className="absolute top-4 right-4 touch-target p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          <Eye className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}

export default {
  InteractiveCard,
  InteractiveButton,
  LikeButton,
  InteractiveRating,
  ShareButton,
  ScrollToTop,
  InteractiveGallery,
};
