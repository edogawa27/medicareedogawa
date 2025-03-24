import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  ShieldCheck,
  AlertCircle,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  PieChart,
  TrendingUp,
  DollarSign,
  Calendar,
  UserCheck,
  UserX,
  Activity,
} from "lucide-react";
import ProviderVerification from "../admin/ProviderVerification";
import UserManagement from "../admin/UserManagement";
import { useAuth } from "../../context/AuthContext";

interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Use authenticated user data if available
  const displayName = user?.name || "Admin User";
  const displayEmail = user?.email || "admin@healthcare.com";
  const displayAvatar =
    user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=admin";

  const metrics: DashboardMetric[] = [
    {
      title: "Total Users",
      value: "2,845",
      change: "+12.5%",
      trend: "up",
      icon: <Users className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Active Providers",
      value: "186",
      change: "+8.2%",
      trend: "up",
      icon: <UserCheck className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Pending Verifications",
      value: "24",
      change: "-3.1%",
      trend: "down",
      icon: <ShieldCheck className="h-5 w-5 text-amber-500" />,
    },
    {
      title: "Monthly Revenue",
      value: "$42,580",
      change: "+15.3%",
      trend: "up",
      icon: <DollarSign className="h-5 w-5 text-emerald-500" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            Admin Portal
          </h2>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-4 w-4" />
              User Management
            </Button>
            <Button
              variant={activeTab === "verification" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("verification")}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Provider Verification
            </Button>
            <Button
              variant={activeTab === "reports" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("reports")}
            >
              <PieChart className="mr-2 h-4 w-4" />
              Reports & Analytics
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={displayAvatar} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{displayName}</p>
              <p className="text-xs text-muted-foreground">{displayEmail}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start mt-4"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <BarChart3 className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" className="flex items-center gap-2">
              <span className="hidden md:inline-block">{displayName}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Dashboard Overview</h1>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {metric.title}
                          </p>
                          <h3 className="text-2xl font-bold mt-1">
                            {metric.value}
                          </h3>
                        </div>
                        <div className="p-2 bg-primary-50 rounded-full">
                          {metric.icon}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center">
                        <Badge
                          variant={
                            metric.trend === "up" ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {metric.trend === "up" ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          ) : (
                            <Activity className="mr-1 h-3 w-3" />
                          )}
                          {metric.change}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-2">
                          vs last month
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Recent Provider Applications
                    </h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=provider${item}`}
                              />
                              <AvatarFallback>P{item}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Dr. Provider {item}</p>
                              <p className="text-sm text-muted-foreground">
                                Cardiologist • New York
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Pending</Badge>
                            <span className="text-sm text-muted-foreground">
                              2h ago
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All Applications
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      System Alerts
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 border-b pb-4">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Payment Gateway Issue</p>
                          <p className="text-sm text-muted-foreground">
                            The payment gateway is experiencing delays
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            10 minutes ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 border-b pb-4">
                        <UserX className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">User Reported Issue</p>
                          <p className="text-sm text-muted-foreground">
                            A provider reported login problems
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            1 hour ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium">System Maintenance</p>
                          <p className="text-sm text-muted-foreground">
                            Scheduled maintenance in 2 days
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            5 hours ago
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All Alerts
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "users" && <UserManagement />}
          {activeTab === "verification" && <ProviderVerification />}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Reports & Analytics</h1>
              <p className="text-muted-foreground">
                This section is under development.
              </p>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">System Settings</h1>
              <p className="text-muted-foreground">
                This section is under development.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
