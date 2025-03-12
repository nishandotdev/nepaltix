
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRegisterSuccess = (email: string, password: string) => {
    setActiveTab("login");
    // No need to set login data here since we're using separate components
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
          />
        </TabsContent>
        
        <TabsContent value="register">
          <RegisterForm 
            isLoading={isLoading} 
            setIsLoading={setIsLoading}
            onRegisterSuccess={handleRegisterSuccess}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
