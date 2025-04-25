
import React, { useEffect, useRef } from 'react';

interface InteractiveBackgroundProps {
  children?: React.ReactNode;
}

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let width = container.clientWidth;
    let height = container.clientHeight;
    
    // Set canvas dimensions to match container
    canvas.width = width;
    canvas.height = height;
    
    // Points array for the particles
    const points: { x: number; y: number; vx: number; vy: number; radius: number; opacity: number; }[] = [];
    const connectionDistance = 150;
    const pointCount = Math.floor(width * height / 15000); // Adjust number of particles based on screen size
    
    // Create initial points
    for (let i = 0; i < pointCount; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    
    // Mouse position
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;
    let mouseTimeout: number | null = null;
    
    // Handle mouse move events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseMoving = true;
      
      if (mouseTimeout) {
        clearTimeout(mouseTimeout);
      }
      
      mouseTimeout = window.setTimeout(() => {
        isMouseMoving = false;
      }, 100);
    };
    
    // Handle resize events
    const handleResize = () => {
      if (!container) return;
      
      width = container.clientWidth;
      height = container.clientHeight;
      
      canvas.width = width;
      canvas.height = height;
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw points
      for (const point of points) {
        // Update position
        point.x += point.vx;
        point.y += point.vy;
        
        // Bounce off edges
        if (point.x < 0 || point.x > width) point.vx = -point.vx;
        if (point.y < 0 || point.y > height) point.vy = -point.vy;
        
        // Handle mouse interaction
        if (isMouseMoving) {
          const dx = mouseX - point.x;
          const dy = mouseY - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const angle = Math.atan2(dy, dx);
            const force = (100 - distance) * 0.03;
            point.vx -= Math.cos(angle) * force;
            point.vy -= Math.sin(angle) * force;
          }
        }
        
        // Draw the point
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 27, 27, ${point.opacity})`;
        ctx.fill();
      }
      
      // Draw connections between nearby points
      ctx.strokeStyle = 'rgba(148, 27, 27, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = `rgba(148, 27, 27, ${0.1 * (1 - distance / connectionDistance)})`;
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mouseTimeout) {
        clearTimeout(mouseTimeout);
      }
    };
  }, []);
  
  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default InteractiveBackground;
