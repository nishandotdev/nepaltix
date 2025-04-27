
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DemoAccountsProps {
  onSelectAccount: (type: 'admin' | 'organizer' | 'user') => void;
  connectionTested: boolean;
}

const DemoAccounts = ({ onSelectAccount, connectionTested }: DemoAccountsProps) => {
  if (!connectionTested) return null;

  return (
    <TooltipProvider>
      <div className="pt-2 space-y-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Demo Accounts:</p>
        <div className="flex flex-wrap gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="text-xs transition-all hover:bg-nepal-red/10 hover:text-nepal-red border-nepal-red/20"
                onClick={() => onSelectAccount('admin')}
              >
                Admin
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>admin@nepaltix.com / admin123</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="text-xs transition-all hover:bg-nepal-red/10 hover:text-nepal-red border-nepal-red/20"
                onClick={() => onSelectAccount('organizer')}
              >
                Organizer
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>organizer@nepaltix.com / organizer123</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="text-xs transition-all hover:bg-nepal-red/10 hover:text-nepal-red border-nepal-red/20"
                onClick={() => onSelectAccount('user')}
              >
                Regular User
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>user@nepaltix.com / user123</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DemoAccounts;
