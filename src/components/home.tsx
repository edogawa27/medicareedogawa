import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import Header from "./layout/Header";
import AuthOptions from "./auth/AuthOptions";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type UserType = "patient" | "provider" | "admin";
type AuthState = "options" | "login" | "register";

const Home = () => {
  const [authState, setAuthState] = useState<AuthState>("options");
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user, logout } = useAuth();

  const handleUserTypeSelect = (type: UserType) => {
    setSelectedUserType(type);
    setAuthState("login");
  };

  const handleLoginSubmit = (values: any) => {
    console.log("Login submitted:", values);
    // In a real app, this would handle authentication
  };

  const handleRegisterSubmit = (values: any) => {
    console.log("Registration submitted:", values);
    // In a real app, this would handle registration
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
    // In a real app, this would navigate to password reset
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // In a real app, this would perform a search
  };

  const goToRegister = () => setAuthState("register");
  const goToLogin = () => setAuthState("login");
  const goToOptions = () => setAuthState("options");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  // Determine dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "patient") return "/patient-dashboard";
    if (user.role === "provider") return "/provider-dashboard";
    if (user.role === "admin") return "/admin-dashboard";
    return "/login";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header
        isAuthenticated={isAuthenticated}
        userType={user?.role as UserType}
        onLogin={goToLogin}
        onRegister={goToRegister}
        onLogout={logout}
      />

      <main className="flex-grow flex flex-col items-center justify-center px-4 pt-20 pb-10">
        <div className="w-full max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="mb-12 text-center">
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Mobile Healthcare Services
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Connect with qualified healthcare professionals for home care
              services. Book appointments, receive quality care, and manage your
              health journey all in one place.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              className="mt-8 max-w-lg mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onSubmit={handleSearch}
            >
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for healthcare services..."
                  className="pl-10 pr-4 py-2 rounded-full shadow-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.form>
          </section>

          {/* Authentication Section */}
          {!isAuthenticated && (
            <motion.section
              className="mb-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {authState === "options" && (
                <AuthOptions onSelectUserType={handleUserTypeSelect} />
              )}

              {authState === "login" && (
                <div className="flex flex-col items-center">
                  <LoginForm
                    onSubmit={handleLoginSubmit}
                    onForgotPassword={handleForgotPassword}
                  />
                  <p className="mt-4 text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      onClick={goToRegister}
                      className="text-primary font-medium hover:underline"
                    >
                      Register now
                    </button>
                  </p>
                  <button
                    onClick={goToOptions}
                    className="mt-2 text-sm text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    Back to user selection
                  </button>
                </div>
              )}

              {authState === "register" && (
                <div className="flex flex-col items-center">
                  <RegisterForm
                    onSubmit={handleRegisterSubmit}
                    onCancel={goToLogin}
                  />
                  <button
                    onClick={goToOptions}
                    className="mt-4 text-sm text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    Back to user selection
                  </button>
                </div>
              )}
            </motion.section>
          )}

          {/* Features Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "Find Specialists",
                description:
                  "Search for qualified healthcare providers based on specialty, location, and availability.",
                icon: "🔍",
              },
              {
                title: "Book Appointments",
                description:
                  "Schedule home visits with healthcare professionals at your preferred time and date.",
                icon: "📅",
              },
              {
                title: "Secure Payments",
                description:
                  "Pay for services through our secure payment gateway with multiple payment options.",
                icon: "💳",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * (index + 1) }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </section>

          {/* CTA Section */}
          <motion.section
            className="bg-primary text-white p-8 rounded-2xl text-center shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="mb-6">
              Join thousands of users who trust our platform for their
              healthcare needs.
            </p>
            {isAuthenticated ? (
              <Link to={getDashboardLink()}>
                <button className="bg-white text-primary font-medium px-6 py-3 rounded-full inline-flex items-center hover:bg-gray-100 transition-colors shadow-md active:scale-[0.98] transition-transform">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
            ) : (
              <button
                onClick={goToRegister}
                className="bg-white text-primary font-medium px-6 py-3 rounded-full inline-flex items-center hover:bg-gray-100 transition-colors shadow-md active:scale-[0.98] transition-transform"
              >
                Create an account <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            )}
          </motion.section>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">HealthCare</h3>
              <p className="text-gray-300">
                Connecting patients with healthcare professionals for quality
                home care services.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Providers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Join as Provider
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Provider Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Provider Login
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Email: support@healthcare.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Health Street, Medical City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} HealthCare Mobile Services. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
