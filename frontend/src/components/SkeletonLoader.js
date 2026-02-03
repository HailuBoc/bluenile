"use client";

import { cn } from "../utils/cn";

export function SkeletonCard({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6",
        className
      )}
      {...props}
    >
      <div className="space-y-4">
        {/* Image skeleton */}
        <div className="skeleton h-48 w-full rounded-xl" />
        
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-5/6 rounded" />
        </div>
        
        {/* Price skeleton */}
        <div className="skeleton h-6 w-1/3 rounded" />
        
        {/* Button skeleton */}
        <div className="skeleton h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className, ...props }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "skeleton h-4 rounded",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = "md", className, ...props }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  return (
    <div
      className={cn(
        "skeleton rounded-full",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

export function SkeletonProductGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 xs:gap-5 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonNavbar() {
  return (
    <div className="glass-dark p-4">
      <div className="flex items-center justify-between">
        {/* Logo skeleton */}
        <div className="flex items-center gap-3">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="skeleton h-6 w-32 rounded" />
        </div>
        
        {/* Nav items skeleton */}
        <div className="hidden sm:flex items-center gap-6">
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-8 w-16 rounded-full" />
        </div>
        
        {/* Mobile menu skeleton */}
        <div className="sm:hidden">
          <div className="skeleton h-6 w-6 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonFooter() {
  return (
    <footer className="bg-gray-900 p-8">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="skeleton h-5 w-24 rounded" />
            <div className="space-y-2">
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-3/4 rounded" />
              <div className="skeleton h-3 w-5/6 rounded" />
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}

export function LoadingSpinner({ size = "md", className, ...props }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-primary-200 border-t-primary-600",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

export function FullPageLoader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-white/60 animate-pulse">{message}</p>
      </div>
    </div>
  );
}

export function SkeletonSearchBar() {
  return (
    <div className="glass p-4 rounded-2xl">
      <div className="flex items-center gap-4">
        <div className="skeleton h-5 w-5 rounded" />
        <div className="skeleton h-10 flex-1 rounded-full" />
        <div className="skeleton h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}

export default {
  SkeletonCard,
  SkeletonText,
  SkeletonAvatar,
  SkeletonProductGrid,
  SkeletonNavbar,
  SkeletonFooter,
  LoadingSpinner,
  FullPageLoader,
  SkeletonSearchBar,
};
