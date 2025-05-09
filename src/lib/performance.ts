
// Performance optimization utilities

/**
 * Debounce function to limit how often a function is called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit the rate at which a function is executed
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastFunc: number | null = null;
  let lastRan: number = 0;
  
  return function(...args: Parameters<T>) {
    const context = this;
    
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      if (lastFunc) clearTimeout(lastFunc);
      
      lastFunc = window.setTimeout(function() {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Memoize function to cache results of expensive operations
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return function(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Function to lazy load components or data
 */
export const lazyLoad = async <T>(loader: () => Promise<T>): Promise<T> => {
  return await loader();
};

/**
 * Optimized image loading with progress tracking
 */
export const preloadImages = (
  imageSrcs: string[], 
  onProgress?: (percent: number) => void, 
  onComplete?: () => void
): Promise<void> => {
  return new Promise((resolve) => {
    let loaded = 0;
    const total = imageSrcs.length;
    
    if (total === 0) {
      if (onComplete) onComplete();
      resolve();
      return;
    }
    
    imageSrcs.forEach(src => {
      const img = new Image();
      
      img.onload = img.onerror = () => {
        loaded++;
        if (onProgress) {
          onProgress((loaded / total) * 100);
        }
        
        if (loaded === total) {
          if (onComplete) onComplete();
          resolve();
        }
      };
      
      img.src = src;
    });
  });
};
