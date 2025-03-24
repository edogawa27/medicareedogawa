import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthOptions from "../components/auth/AuthOptions";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [userType, setUserType] = useState<
    "patient" | "provider" | "admin" | null
  >(null);
  const { login, loginWithDummy } = useAuth();
  const navigate = useNavigate();

  const handleUserTypeSelect = (type: "patient" | "provider" | "admin") => {
    setUserType(type);
  };

  const handleLoginSubmit = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      await login(values.email, values.password);
      // Navigation is handled in the AuthContext after successful login
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error (would show toast/error message in a real app)
    }
  };

  const handleQuickLogin = () => {
    if (userType) {
      loginWithDummy(userType);
    }
  };

  const handleBackToOptions = () => {
    setUserType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!userType ? (
          <AuthOptions onSelectUserType={handleUserTypeSelect} />
        ) : (
          <div className="space-y-6">
            <LoginForm
              onSubmit={handleLoginSubmit}
              userType={userType}
              onBackToOptions={handleBackToOptions}
            />
            <div className="text-center">
              <button
                onClick={handleQuickLogin}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Quick Login as{" "}
                {userType === "patient"
                  ? "Patient"
                  : userType === "provider"
                    ? "Healthcare Provider"
                    : "Administrator"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
