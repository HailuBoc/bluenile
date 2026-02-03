// ✅ Enhanced performance monitoring and optimization utilities

import { debounce, throttle } from './performance';

// ✅ Advanced performance monitoring
export class EnhancedPerformanceMonitor {
  static metrics = new Map();
  static observers = new Set();

  static startMeasure(name) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-start`);
      this.metrics.set(name, { startTime: performance.now() });
    }
  }

  static endMeasure(name) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-end`);
      window.performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measures = window.performance.getEntriesByName(name);
      if (measures.length > 0) {
        const duration = measures[0].duration;
        this.metrics.set(name, { 
          ...this.metrics.get(name), 
          duration,
          endTime: performance.now()
        });
        
        console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
        
        // Clean up marks
        window.performance.clearMarks(`${name}-start`);
        window.performance.clearMarks(`${name}-end`);
        window.performance.clearMeasures(name);
        
        // Notify observers
        this.notifyObservers(name, duration);
        
        return duration;
      }
    }
    return 0;
  }

  static addObserver(callback) {
    this.observers.add(callback);
  }

  static removeObserver(callback) {
    this.observers.delete(callback);
  }

  static notifyObservers(name, duration) {
    this.observers.forEach(callback => {
      try {
        callback(name, duration);
      } catch (error) {
        console.error('Error in performance observer:', error);
      }
    });
  }

  static getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  static clearMetrics() {
    this.metrics.clear();
  }
}

// ✅ Resource optimization utilities
export class ResourceOptimizer {
  static preloadImages(urls) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  static preloadFont(fontUrl, fontFamily) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = fontUrl;
    document.head.appendChild(link);
  }

  static lazyLoadImages() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
}

// ✅ Memory management utilities
export class MemoryManager {
  static cleanup() {
    // Clean up event listeners
    if (typeof window !== 'undefined') {
      // Clear any pending timeouts/intervals
      const highestTimeoutId = setTimeout(() => {});
      for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
        clearInterval(i);
      }
    }
  }

  static monitorMemory() {
    if ('memory' in performance) {
      const memory = performance.memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
      };
    }
    return null;
  }

  static optimizeImages(images) {
    return images.map(img => {
      if (img.width > 1920) {
        img.width = 1920;
      }
      if (img.height > 1080) {
        img.height = 1080;
      }
      return img;
    });
  }
}

// ✅ Network optimization utilities
export class NetworkOptimizer {
  static async fetchWithRetry(url, options = {}, retries = 3) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Cache-Control': 'no-cache',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  }

  static batchRequests(requests, batchSize = 5) {
    const batches = [];
    for (let i = 0; i < requests.length; i += batchSize) {
      batches.push(requests.slice(i, i + batchSize));
    }
    return batches;
  }

  static async fetchBatch(batch) {
    return Promise.allSettled(
      batch.map(({ url, options }) => this.fetchWithRetry(url, options))
    );
  }
}

// ✅ Component optimization utilities
export class ComponentOptimizer {
  static createLazyComponent(importFunc) {
    return React.lazy(importFunc);
  }

  static withSuspense(component, fallback = null) {
    return (
      <React.Suspense fallback={fallback || <div>Loading...</div>}>
        {component}
      </React.Suspense>
    );
  }

  static memoizeComponent(component, areEqual = null) {
    return React.memo(component, areEqual);
  }
}

// ✅ Enhanced debounce and throttle for better performance
export const enhancedDebounce = (func, wait, options = {}) => {
  let timeout;
  let lastArgs;
  let lastThis;
  let maxWait;
  let result;

  const later = () => {
    const lastCalled = Date.now();
    result = func.apply(lastThis, lastArgs);
    timeout = null;
    lastArgs = lastThis = null;
  };

  const debounced = function(...args) {
    const now = Date.now();
    lastArgs = args;
    lastThis = this;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    return result;
  };

  debounced.cancel = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      lastArgs = lastThis = null;
    }
  };

  return debounced;
};

export const enhancedThrottle = (func, wait, options = {}) => {
  let timeout;
  let previous = 0;

  const later = function(...args) {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    return func.apply(this, args);
  };

  const throttled = function(...args) {
    const now = Date.now();
    if (!previous && options.leading === false) {
      previous = now;
    }

    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      return func.apply(this, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };

  throttled.cancel = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      previous = 0;
    }
  };

  return throttled;
};

// ✅ Performance hooks for React components
export function usePerformanceMonitor(componentName) {
  useEffect(() => {
    EnhancedPerformanceMonitor.startMount(componentName);
    
    return () => {
      EnhancedPerformanceMonitor.endMount(componentName);
    };
  }, [componentName]);
}

export function useIntersectionObserver(callback, options = {}) {
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(callback, options);
    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback, options]);

  return setRef;
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// ✅ Bundle size analyzer
export class BundleAnalyzer {
  static analyzeBundleSize() {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0];
      const transferSize = navigation.transferSize || 0;
      const encodedBodySize = navigation.encodedBodySize || 0;
      
      return {
        transferSize: `${(transferSize / 1024).toFixed(2)} KB`,
        encodedBodySize: `${(encodedBodySize / 1024).toFixed(2)} KB`,
        compressionRatio: encodedBodySize > 0 
          ? `${((1 - transferSize / encodedBodySize) * 100).toFixed(1)}%`
          : 'N/A',
      };
    }
    return null;
  }

  static monitorResourceLoading() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.initiatorType === 'script' || entry.initiatorType === 'link') {
            console.log(`📦 ${entry.name}: ${(entry.transferSize / 1024).toFixed(2)} KB`);
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
      return observer;
    }
    return null;
  }
}

export default {
  EnhancedPerformanceMonitor,
  ResourceOptimizer,
  MemoryManager,
  NetworkOptimizer,
  ComponentOptimizer,
  enhancedDebounce,
  enhancedThrottle,
  usePerformanceMonitor,
  useIntersectionObserver,
  useMediaQuery,
  BundleAnalyzer,
};
