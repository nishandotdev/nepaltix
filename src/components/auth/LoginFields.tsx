
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";

interface LoginFieldsProps {
  email: string;
  password: string;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginFields = ({ email, password, isLoading, onChange }: LoginFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={onChange}
            required
            disabled={isLoading}
            className="pl-10 transition-all focus:border-nepal-red focus:ring-nepal-red"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Button variant="link" size="sm" className="text-xs text-nepal-red p-0 h-auto">
            Forgot password?
          </Button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={onChange}
            required
            disabled={isLoading}
            className="pl-10 transition-all focus:border-nepal-red focus:ring-nepal-red"
          />
        </div>
      </div>
    </>
  );
};

export default LoginFields;
