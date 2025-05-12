
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { debounce } from '@/lib/performance';

// Updated image URLs with more reliable sources
const heroImages = [
  "https://images.pexels.com/photos/2402950/pexels-photo-2402950.jpeg?auto=compress&cs=tinysrgb&w=1200", // Nepal mountains
  "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=1200", // Nepal temple
  "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=1200"  // Nepal stupa
];

const Hero = () => {
  // Initialize all state variables at the beginning
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Preload images with improved error handling
  useEffect(() => {
    let loadedCount = 0;
    let errorCount = 0;
    const totalImages = heroImages.length;
    
    const preloadImages = () => {
      heroImages.forEach((src) => {
        const img = new Image();
        img.onload = () => {
          loadedCount += 1;
          if (loadedCount + errorCount === totalImages) {
            setImagesPreloaded(true);
            setIsImageLoaded(true);
          }
        };
        img.onerror = () => {
          // Handle image load errors - still proceed with availability
          console.warn(`Failed to load image: ${src}`);
          errorCount += 1;
          if (loadedCount + errorCount === totalImages) {
            setImagesPreloaded(true);
            setIsImageLoaded(true);
          }
        };
        img.src = src;
      });
    };
    
    // Set a faster fallback timeout to ensure the hero shows even if images fail
    const fallbackTimer = setTimeout(() => {
      if (!imagesPreloaded) {
        console.log('Using fallback timer for hero section');
        setImagesPreloaded(true);
        setIsImageLoaded(true);
      }
    }, 1500); // Reduced from 2000 to 1500ms for faster loading
    
    preloadImages();
    
    // Clean up the fallback timer
    return () => clearTimeout(fallbackTimer);
  }, []);

  // Handle image rotation with timer - only start after preloading
  useEffect(() => {
    // Don't start timer until images are loaded
    if (!imagesPreloaded) return;
    
    const startImageTimer = () => {
      // Clear any existing timer
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
      
      // Set new timer
      timerRef.current = window.setInterval(() => {
        setIsTransitioning(true);
        setIsImageLoaded(false);
        
        // Delay the index change slightly to allow for transitions
        setTimeout(() => {
          setCurrentImageIndex(prevIndex => 
            prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
          );
        }, 300);
      }, 6000);
    };
    
    startImageTimer();
    
    // Cleanup function to clear interval
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [currentImageIndex, imagesPreloaded]);

  // Debounced image load handler
  const handleImageLoad = debounce(() => {
    setIsImageLoaded(true);
    setIsTransitioning(false);
  }, 100);

  return (
    <div className="relative h-[100svh] w-full overflow-hidden">
      {/* Loading state with improved styling */}
      {!imagesPreloaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-30">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-nepal-red border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white">Loading amazing experiences...</p>
          </div>
        </div>
      )}
      
      {/* Gradient overlay - lighter than before */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60 z-10"></div>
      
      {/* Background pattern - more subtle */}
      <div className="absolute inset-0 bg-nepal-pattern opacity-30 z-0"></div>
      
      {/* Fallback background color in case images fail */}
      <div className="absolute inset-0 bg-gray-800"></div>
      
      {/* Background image */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            currentImageIndex === index 
              ? (isImageLoaded ? 'opacity-100' : 'opacity-0') 
              : 'opacity-0'
          } ${isTransitioning ? 'scale-105' : 'scale-100'} transition-transform duration-2000`}
          style={{ backgroundImage: `url(${image})` }}
        >
          <img
            src={image}
            alt="Nepal scenic view"
            className="hidden"
            onLoad={index === currentImageIndex ? handleImageLoad : undefined}
            onError={index === currentImageIndex ? handleImageLoad : undefined}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
      
      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-3 sm:px-6 lg:px-8">
        <div className="animate-entrance max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 mb-3 text-xs font-medium uppercase tracking-wider bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
            Experience Nepal's Best Events
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 sm:mb-6 tracking-tight">
            Discover & Book Amazing <span className="text-nepal-red">Events in Nepal</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            From cultural festivals to adventure competitions, find and book tickets to the most exciting events across Nepal.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center px-4 sm:px-0">
            <Link
              to="/events"
              className="px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base font-medium bg-nepal-red text-white hover:bg-opacity-90 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
            >
              Explore Events
            </Link>
            <Link
              to="/featured"
              className="px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base font-medium bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 transition-all duration-300 transform hover:translate-y-[-2px] flex items-center justify-center group"
            >
              Featured Events
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements - lighter gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent z-20"></div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-float">
        <div className="w-5 h-9 sm:w-6 sm:h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1">
          <div className="w-1.5 h-2.5 bg-white/60 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
