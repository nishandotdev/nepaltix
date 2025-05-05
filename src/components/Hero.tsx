
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const heroImages = [
  "https://images.unsplash.com/photo-1585147457016-a838195bfa12?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1602938417344-62ce67268f98?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1689221196350-c604cdcaafe6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsImageLoaded(false);
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <div className="relative h-[100svh] w-full overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70 z-10"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-nepal-pattern opacity-50 z-0"></div>
      
      {/* Background image */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            currentImageIndex === index ? (isImageLoaded ? 'opacity-100' : 'opacity-0') : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${image})` }}
        >
          <img
            src={image}
            alt="Hero Background"
            className="hidden"
            onLoad={index === currentImageIndex ? handleImageLoad : undefined}
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
      
      {/* Decorative elements */}
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
