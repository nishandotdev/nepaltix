
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: number;
  className?: string;
  text?: string;
  variant?: "primary" | "secondary" | "white" | "nepal-red";
  textSize?: "xs" | "sm" | "base";
  fullPage?: boolean;
}

export const Loader = ({ 
  size = 24, 
  className, 
  text, 
  variant = "primary",
  textSize = "sm",
  fullPage = false
}: LoaderProps) => {
  const getColor = () => {
    switch (variant) {
      case "primary": return "text-nepal-red";
      case "secondary": return "text-nepal-blue";
      case "white": return "text-white";
      case "nepal-red": return "text-nepal-red";
      default: return "text-nepal-red";
    }
  };

  const getTextSize = () => {
    switch (textSize) {
      case "xs": return "text-xs";
      case "sm": return "text-sm";
      case "base": return "text-base";
      default: return "text-sm";
    }
  };

  const content = (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 
        className={cn("animate-spin", getColor())} 
        size={size} 
      />
      {text && (
        <p className={cn("mt-2 text-gray-500 dark:text-gray-400", getTextSize())}>{text}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
};
