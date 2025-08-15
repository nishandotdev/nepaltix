import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Calendar, MapPin, Star } from 'lucide-react';
import { debounce } from '@/lib/performance';
import nepalMountains from '@/assets/nepal-mountains.jpg';
import nepalFestival from '@/assets/nepal-festival.jpg';
import kathmanduCity from '@/assets/kathmandu-city.jpg';

// High-quality Nepali hero images
const heroImages = [
  nepalMountains, // Himalayan landscape
  nepalFestival,  // Cultural festival
  kathmanduCity,  // Kathmandu cityscape
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
    }, 800); // Reduced to 800ms for faster loading with local images
    
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

  const prevIndex = (currentImageIndex - 1 + heroImages.length) % heroImages.length;

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
      {heroImages.map((image, index) => {
        const isCurrent = currentImageIndex === index;
        const isPrev = prevIndex === index;
        const visible = isCurrent ? isImageLoaded : (!isImageLoaded && isPrev);
        return (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'} ${isCurrent ? (isTransitioning ? 'scale-105' : 'scale-100') : 'scale-100'} transition-transform duration-2000`}
            style={{ backgroundImage: `url(${image})` }}
          >
            <img
              src={image}
              alt="Nepal scenic view"
              className="hidden"
              onLoad={isCurrent ? handleImageLoad : undefined}
              onError={isCurrent ? handleImageLoad : undefined}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        );
      })}
      
      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-3 sm:px-6 lg:px-8">
        <div className="animate-entrance max-w-5xl mx-auto">
          {/* Enhanced badge with icon */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium uppercase tracking-wider bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-md rounded-full text-white border border-white/30 shadow-lg">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>Book Everything in One Place</span>
            <Star className="w-4 h-4 text-yellow-400" />
          </div>
          
          {/* Enhanced heading with gradient text */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 sm:mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-white via-white to-primary bg-clip-text text-transparent">
              Your Ultimate
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Booking Platform
            </span>
          </h1>
          
          {/* Enhanced description */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
            Movies, Events, Flights & More - All in one seamless experience
          </p>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 sm:mb-10 text-sm text-white/80">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full">
              <Play className="w-4 h-4" />
              <span>Movies</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full">
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full">
              <MapPin className="w-4 h-4" />
              <span>Travel</span>
            </div>
          </div>
          
          {/* Enhanced buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Link
              to="/events"
              className="group relative px-8 py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 text-white overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-primary/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center gap-2">
                Start Booking
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
            <Link
              to="/featured"
              className="group px-8 py-4 rounded-full text-lg font-semibold bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                Browse Categories
                <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </span>
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
