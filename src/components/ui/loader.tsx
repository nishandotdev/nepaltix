
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: number;
  className?: string;
  text?: string;
  variant?: "primary" | "secondary" | "white";
}

export const Loader = ({ 
  size = 24, 
  className, 
  text, 
  variant = "primary" 
}: LoaderProps) => {
  const getColor = () => {
    switch (variant) {
      case "primary": return "text-nepal-red";
      case "secondary": return "text-nepal-blue";
      case "white": return "text-white";
      default: return "text-nepal-red";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 
        className={cn("animate-spin", getColor(), className)} 
        size={size} 
      />
      {text && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
};
