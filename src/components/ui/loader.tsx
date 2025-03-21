
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: number;
  className?: string;
  text?: string;
}

export const Loader = ({ size = 24, className, text }: LoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 
        className={cn("animate-spin text-nepal-red", className)} 
        size={size} 
      />
      {text && (
        <p className="mt-2 text-sm text-gray-500">{text}</p>
      )}
    </div>
  );
};
