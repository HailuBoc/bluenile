"use client";

import { useEffect, useState } from "react";
import { cn } from "../utils/cn";

export default function ResponsiveLayout({ children, className }) {
  const [viewportSize, setViewportSize] = useState({
    width: 0,
    height: 0,
  });
  const [orientation, setOrientation] = useState("portrait");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateViewportSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewportSize({ width, height });
      setOrientation(width > height ? "landscape" : "portrait");
      
      // Breakpoint detection
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    // Initial call
    updateViewportSize();

    // Add event listener with debouncing for performance
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateViewportSize, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", updateViewportSize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", updateViewportSize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Add viewport meta tag for mobile devices
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    }
  }, []);

  const contextValue = {
    viewportSize,
    orientation,
    isMobile,
    isTablet,
    isDesktop,
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full overflow-x-hidden",
        "safe-area-top safe-area-bottom",
        className
      )}
      data-device={isMobile ? "mobile" : isTablet ? "tablet" : "desktop"}
      data-orientation={orientation}
    >
      {/* Viewport info for debugging (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 z-50 glass p-2 rounded-lg text-xs text-white/80">
          <div>W: {viewportSize.width}px</div>
          <div>H: {viewportSize.height}px</div>
          <div>{orientation}</div>
          <div>{isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop"}</div>
        </div>
      )}
      
      {children}
    </div>
  );
}

// Hook for using responsive context
export function useResponsive() {
  const [context, setContext] = useState({
    viewportSize: { width: 0, height: 0 },
    orientation: "portrait",
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const updateContext = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setContext({
        viewportSize: { width, height },
        orientation: width > height ? "landscape" : "portrait",
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    updateContext();
    
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateContext, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", updateContext);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", updateContext);
      clearTimeout(timeoutId);
    };
  }, []);

  return context;
}

// Responsive breakpoint utilities
export const breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
};

export function useBreakpoint(breakpoint) {
  const { viewportSize } = useResponsive();
  return viewportSize.width >= breakpoints[breakpoint];
}
