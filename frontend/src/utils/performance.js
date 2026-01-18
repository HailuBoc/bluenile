// ✅ Performance monitoring and optimization utilities

// ✅ Debounce function for search and other input events
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ✅ Throttle function for scroll events
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ✅ Measure and log performance metrics
export class PerformanceMonitor {
  static startMeasure(name) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-start`);
    }
  }

  static endMeasure(name) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-end`);
      window.performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measures = window.performance.getEntriesByName(name);
      if (measures.length > 0) {
        const duration = measures[0].duration;
        console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
        
        // Clean up marks
        window.performance.clearMarks(`${name}-start`);
        window.performance.clearMarks(`${name}-end`);
        window.performance.clearMeasures(name);
        
        return duration;
      }
    }
    return 0;
  }
}

// ✅ Image optimization utilities
export const imageUtils = {
  // ✅ Generate responsive image sizes
  getResponsiveSizes: (baseWidth) => {
    return {
      small: Math.floor(baseWidth * 0.5),
      medium: Math.floor(baseWidth * 0.75),
      large: baseWidth,
      xlarge: Math.floor(baseWidth * 1.25),
    };
  },

  // ✅ Check if image should be lazy loaded
  shouldLazyLoad: (priority, index) => {
    return !priority && index > 2; // Load first 2 images immediately
  },

  // ✅ Generate WebP source set
  generateWebPSourceSet: (src, sizes) => {
    if (!src || src.startsWith('data:')) return '';
    
    const baseUrl = src.split('.')[0];
    return Object.values(sizes)
      .map(size => `${baseUrl}_${size}.webp ${size}w`)
      .join(', ');
  },
};

// ✅ Cache utilities
export class CacheManager {
  static set(key, data, ttl = 300000) { // 5 minutes default TTL
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      window.localStorage.setItem(key, JSON.stringify(item));
    }
  }

  static get(key) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const now = Date.now();
      
      if (now - parsed.timestamp > parsed.ttl) {
        window.localStorage.removeItem(key);
        return null;
      }
      
      return parsed.data;
    }
    return null;
  }

  static clear() {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Only clear items with our cache prefix
      Object.keys(window.localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          window.localStorage.removeItem(key);
        }
      });
    }
  }
}

// ✅ Network status monitoring
export class NetworkMonitor {
  static isOnline() {
    return typeof window !== 'undefined' && navigator.onLine;
  }

  static getConnectionType() {
    if (typeof window !== 'undefined' && navigator.connection) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
      };
    }
    return null;
  }

  static shouldReduceMotion() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }
}

// ✅ Bundle size monitoring - function removed to avoid duplicates
