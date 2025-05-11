
import { Loader } from "@/components/ui/loader";

interface LoadingStateProps {
  isCheckout?: boolean;
  isSuccess?: boolean;
}

const LoadingState = ({ isCheckout = false, isSuccess = false }: LoadingStateProps) => {
  if (isSuccess) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100 animate-fade-in">
        <div className="mb-6">
          <Loader size={36} text="Generating your tickets..." />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Almost there!</h2>
        <p className="text-gray-600">Please wait while we prepare your digital tickets.</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader size={36} text="Loading checkout..." className="animate-pulse" />
    </div>
  );
};

export default LoadingState;
