
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in milliseconds
  type?: 'fade-up' | 'fade-left' | 'fade-right' | 'zoom-in' | 'bounce';
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  delay = 0,
  type = 'fade-up',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add a timeout based on the delay prop
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px', // Adjust the trigger point relative to the viewport
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [delay]);

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-1000 ease-out';
    
    if (!isVisible) {
      switch (type) {
        case 'fade-up':
          return `${baseClasses} opacity-0 translate-y-12`;
        case 'fade-left':
          return `${baseClasses} opacity-0 translate-x-12`;
        case 'fade-right':
          return `${baseClasses} opacity-0 -translate-x-12`;
        case 'zoom-in':
          return `${baseClasses} opacity-0 scale-90`;
        case 'bounce':
          return `${baseClasses} opacity-0 -translate-y-8`;
        default:
          return `${baseClasses} opacity-0 translate-y-12`;
      }
    }
    
    return `${baseClasses} opacity-100 translate-y-0 translate-x-0 scale-100`;
  };

  return (
    <div
      ref={sectionRef}
      className={cn(getAnimationClasses(), className)}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
