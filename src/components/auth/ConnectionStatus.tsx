
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConnectionStatusProps {
  connectionTested: boolean;
  connectionSuccess: boolean;
}

const ConnectionStatus = ({ connectionTested, connectionSuccess }: ConnectionStatusProps) => {
  if (!connectionTested) {
    return (
      <div className="py-2 text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
        <Loader2 size={16} className="animate-spin" />
        <span>Checking database connection...</span>
      </div>
    );
  }

  if (!connectionSuccess) {
    return (
      <div className="py-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md flex items-center space-x-2">
        <AlertTriangle size={16} />
        <span>Database connection failed. Please try again later.</span>
      </div>
    );
  }

  return null;
};

export default ConnectionStatus;
