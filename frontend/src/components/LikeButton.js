"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const LikeButton = ({ 
  itemId, 
  itemType = "property", 
  initialLiked = false, 
  initialLikes = 0,
  className = "",
  showCount = true,
  size = "default" // "small", "default", "large"
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://bluenile.onrender.com";

  // Size configurations
  const sizeConfig = {
    small: {
      icon: "w-3 h-3",
      text: "text-xs",
      button: "p-1"
    },
    default: {
      icon: "w-4 h-4", 
      text: "text-xs",
      button: "p-1.5"
    },
    large: {
      icon: "w-5 h-5",
      text: "text-sm", 
      button: "p-2"
    }
  };

  const config = sizeConfig[size] || sizeConfig.default;

  useEffect(() => {
    setLiked(initialLiked);
    setLikesCount(initialLikes);
  }, [initialLiked, initialLikes]);

  const handleLikeClick = async () => {
    // Check if user is authenticated
    if (status === "loading") return; // Still loading session
    
    if (!session) {
      // Redirect to login with return URL
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (loading) return; // Prevent multiple clicks

    try {
      setLoading(true);
      const newLiked = !liked;
      
      // Optimistic update
      setLiked(newLiked);
      setLikesCount(prev => newLiked ? prev + 1 : Math.max(prev - 1, 0));

      // Make API call
      let endpoint;
      if (itemType === "property" || itemType === "house") {
        endpoint = `${BASE_URL}/houselike/${itemId}/like`;
      } else if (itemType === "car") {
        endpoint = `${BASE_URL}/cars/${itemId}/like`;
      } else {
        endpoint = `${BASE_URL}/${itemType}like/${itemId}/like`;
      }

      const res = await axios.post(endpoint, {
        userId: session.user.id
      });

      // Update with server response
      setLiked(res.data.userLiked ?? newLiked);
      setLikesCount(res.data.likes ?? (newLiked ? likesCount + 1 : likesCount - 1));

    } catch (error) {
      console.error("❌ Failed to toggle like:", error);
      // Revert optimistic update on error
      setLiked(prev => !prev);
      setLikesCount(prev => liked ? Math.max(prev - 1, 0) : prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeClick}
      disabled={loading}
      className={`
        bg-white/90 hover:bg-white 
        dark:bg-gray-800/90 dark:hover:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-full shadow-sm hover:shadow-md
        flex items-center gap-1.5
        transition-all duration-200
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        ${config.button}
        ${className}
      `}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <Heart
        className={`
          ${config.icon}
          ${liked 
            ? "text-red-500 fill-red-500" 
            : "text-gray-500 dark:text-gray-400 hover:text-red-400"
          }
          transition-colors duration-200
        `}
      />
      {showCount && (
        <span className={`
          ${config.text}
          font-semibold 
          text-gray-700 dark:text-gray-300
          min-w-[12px] text-center
        `}>
          {likesCount}
        </span>
      )}
    </button>
  );
};

export default LikeButton;
