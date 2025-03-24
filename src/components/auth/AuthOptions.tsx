import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type UserType = "patient" | "provider" | "admin";

interface AuthOptionsProps {
  onSelectUserType: (type: UserType) => void;
}

export const AuthOptions = ({ onSelectUserType }: AuthOptionsProps) => {
  const userTypes = [
    {
      type: "patient",
      title: "I'm a Patient",
      description: "Looking for healthcare services",
      icon: "🏠",
    },
    {
      type: "provider",
      title: "I'm a Provider",
      description: "Offering healthcare services",
      icon: "⚕️",
    },
    {
      type: "admin",
      title: "I'm an Admin",
      description: "Platform management",
      icon: "🔧",
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-none shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Choose Your Role
          </CardTitle>
          <CardDescription>
            Select how you want to use our platform
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {userTypes.map((userType, index) => (
            <motion.div
              key={userType.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Button
                variant="outline"
                className="w-full justify-start text-left p-4 h-auto border border-gray-200 hover:border-primary hover:bg-primary/5"
                onClick={() => onSelectUserType(userType.type as UserType)}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{userType.icon}</div>
                  <div>
                    <h3 className="font-medium text-lg">{userType.title}</h3>
                    <p className="text-sm text-gray-500">
                      {userType.description}
                    </p>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

// Add default export
export default AuthOptions;
