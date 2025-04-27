
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleRegisterSuccess = (email: string, password: string) => {
    setActiveTab("login");
  };
  
  if (!mounted) return null;
  
  return (
    <Card className="w-full border-0 overflow-hidden">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 rounded-none bg-gray-50 dark:bg-gray-900 p-0">
          <TabsTrigger 
            value="login"
            className={`py-3 ${activeTab === "login" 
              ? "data-[state=active]:bg-nepal-red data-[state=active]:text-white" 
              : "data-[state=active]:bg-transparent"}`}
          >
            Login
          </TabsTrigger>
          <TabsTrigger 
            value="register"
            className={`py-3 ${activeTab === "register" 
              ? "data-[state=active]:bg-nepal-red data-[state=active]:text-white" 
              : "data-[state=active]:bg-transparent"}`}
          >
            Register
          </TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === "login" ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="login" className="mt-0">
              <LoginForm 
                isLoading={isLoading} 
                setIsLoading={setIsLoading} 
              />
            </TabsContent>
            
            <TabsContent value="register" className="mt-0">
              <RegisterForm 
                isLoading={isLoading} 
                setIsLoading={setIsLoading}
                onRegisterSuccess={handleRegisterSuccess}
              />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
