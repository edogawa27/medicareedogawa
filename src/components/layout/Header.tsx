import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { UserCircle, Menu, X } from "lucide-react";

interface HeaderProps {
  isAuthenticated?: boolean;
  userType?: "patient" | "provider" | "admin";
  onLogin?: () => void;
  onRegister?: () => void;
  onLogout?: () => void;
}

const Header = ({
  isAuthenticated = false,
  userType = "patient",
  onLogin = () => {},
  onRegister = () => {},
  onLogout = () => {},
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm fixed top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">HC</span>
            </div>
            <span className="ml-2 text-xl font-semibold text-primary hidden sm:inline-block">
              HealthCare
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary font-medium">
            Home
          </Link>
          <Link
            to="/services"
            className="text-gray-700 hover:text-primary font-medium"
          >
            Services
          </Link>
          <Link
            to="/providers"
            className="text-gray-700 hover:text-primary font-medium"
          >
            Providers
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-primary font-medium"
          >
            About
          </Link>
        </nav>

        {/* Authentication Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Link
                to={`/${userType}/dashboard`}
                className="flex items-center space-x-2"
              >
                <UserCircle className="h-6 w-6 text-primary" />
                <span className="text-gray-700 font-medium">Dashboard</span>
              </Link>
              <Button
                variant="outline"
                onClick={onLogout}
                className="font-medium"
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onLogin}
                className="font-medium"
              >
                Login
              </Button>
              <Button onClick={onRegister} className="font-medium">
                Register
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden bg-white w-full absolute transition-all duration-300 ease-in-out border-b border-gray-200",
          mobileMenuOpen ? "max-h-screen py-4" : "max-h-0 overflow-hidden py-0",
        )}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          <Link
            to="/"
            className="text-gray-700 hover:text-primary font-medium py-2"
          >
            Home
          </Link>
          <Link
            to="/services"
            className="text-gray-700 hover:text-primary font-medium py-2"
          >
            Services
          </Link>
          <Link
            to="/providers"
            className="text-gray-700 hover:text-primary font-medium py-2"
          >
            Providers
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-primary font-medium py-2"
          >
            About
          </Link>

          <div className="pt-2 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-3">
                <Link
                  to={`/${userType}/dashboard`}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary font-medium py-2"
                >
                  <UserCircle className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Button variant="outline" onClick={onLogout} className="w-full">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Button variant="outline" onClick={onLogin} className="w-full">
                  Login
                </Button>
                <Button onClick={onRegister} className="w-full">
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
