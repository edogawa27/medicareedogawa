import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onSubmit?: (values: FormValues) => void;
  onForgotPassword?: () => void;
  userType?: "patient" | "provider" | "admin" | null;
  onBackToOptions?: () => void;
}

const LoginForm = ({
  onSubmit,
  onForgotPassword = () => {},
  userType = null,
  onBackToOptions = () => {},
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  // Set default email based on user type
  const getDefaultEmail = () => {
    return "";
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: getDefaultEmail(),
      password: "password", // Default password for demo
      rememberMe: false,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    console.log("Login form submitted", values);
    setIsLoading(true);
    setError(null);

    try {
      // Use Supabase login
      await login(values.email, values.password);
      if (onSubmit) {
        onSubmit(values);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to login. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Get user type label
  const getUserTypeLabel = () => {
    if (userType === "patient") return "Patient";
    if (userType === "provider") return "Healthcare Provider";
    if (userType === "admin") return "Administrator";
    return "";
  };

  return (
    <div className="w-full max-w-md p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
      <div className="mb-6">
        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={onBackToOptions}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">
            {userType ? `${getUserTypeLabel()} Login` : "Login"}
          </h2>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your account to continue
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-500" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      className="pl-10"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10"
                      {...field}
                    />
                  </FormControl>
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
              )}
            />
            <Button
              type="button"
              variant="link"
              className="text-sm text-primary p-0 h-auto"
              onClick={onForgotPassword}
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
