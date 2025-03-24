import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Bell,
  Settings,
  Users,
  FileText,
  DollarSign,
  LogOut,
} from "lucide-react";
import AvailabilityCalendar from "../providers/AvailabilityCalendar";
import EarningsSummary from "../providers/EarningsSummary";
import { useAuth } from "../../context/AuthContext";

interface Appointment {
  id: string;
  patientName: string;
  patientAvatar?: string;
  service: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
}

interface ProviderDashboardProps {
  providerName?: string;
  specialty?: string;
  appointmentsCount?: number;
  upcomingAppointments?: Appointment[];
  notifications?: number;
}

const ProviderDashboard = ({
  providerName,
  specialty = "Physiotherapist",
  appointmentsCount = 5,
  upcomingAppointments = [
    {
      id: "app-1",
      patientName: "Ahmad Rahman",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
      service: "Physical Therapy",
      date: "2023-06-15",
      time: "10:00 AM",
      status: "upcoming",
    },
    {
      id: "app-2",
      patientName: "Maria Garcia",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      service: "Home Nursing",
      date: "2023-06-15",
      time: "2:30 PM",
      status: "upcoming",
    },
    {
      id: "app-3",
      patientName: "Robert Johnson",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      service: "Medical Consultation",
      date: "2023-06-16",
      time: "9:15 AM",
      status: "upcoming",
    },
    {
      id: "app-4",
      patientName: "Sarah Williams",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      service: "Physical Therapy",
      date: "2023-06-17",
      time: "11:00 AM",
      status: "upcoming",
    },
    {
      id: "app-5",
      patientName: "David Brown",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      service: "Home Nursing",
      date: "2023-06-18",
      time: "3:45 PM",
      status: "upcoming",
    },
  ],
  notifications = 3,
}: ProviderDashboardProps) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Use authenticated user data if available, otherwise use props
  const displayName = user?.name || providerName || "Dr. Sarah Johnson";
  const displayAvatar =
    user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=provider";

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      {/* Top Navigation Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={displayAvatar} alt={displayName} />
            <AvatarFallback>
              {displayName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{displayName}</h2>
            <p className="text-sm text-gray-500">{specialty}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
          <nav className="space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <FileText className="mr-2 h-5 w-5" />
              Overview
            </Button>
            <Button
              variant={activeTab === "appointments" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("appointments")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Appointments
              <Badge className="ml-auto" variant="secondary">
                {appointmentsCount}
              </Badge>
            </Button>
            <Button
              variant={activeTab === "availability" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("availability")}
            >
              <Clock className="mr-2 h-5 w-5" />
              Availability
            </Button>
            <Button
              variant={activeTab === "patients" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("patients")}
            >
              <Users className="mr-2 h-5 w-5" />
              Patients
            </Button>
            <Button
              variant={activeTab === "earnings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("earnings")}
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Earnings
            </Button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsContent value="overview" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Welcome back, {displayName.split(" ")[0]}!
                  </CardTitle>
                  <CardDescription>
                    Here's what's happening with your practice today.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>Today's Appointments</CardDescription>
                        <CardTitle className="text-2xl">
                          {
                            upcomingAppointments.filter(
                              (a) =>
                                new Date(a.date).toDateString() ===
                                new Date().toDateString(),
                            ).length
                          }
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Next:{" "}
                          {upcomingAppointments.length > 0
                            ? upcomingAppointments[0].time
                            : "No appointments"}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>This Week</CardDescription>
                        <CardTitle className="text-2xl">
                          {upcomingAppointments.length}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Appointments scheduled
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>Pending Reviews</CardDescription>
                        <CardTitle className="text-2xl">2</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button variant="link" className="p-0 h-auto" size="sm">
                          <span className="text-sm">View all</span>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-lg font-medium mb-4">
                    Upcoming Appointments
                  </h3>
                  <div className="space-y-4">
                    {upcomingAppointments.slice(0, 3).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage
                              src={appointment.patientAvatar}
                              alt={appointment.patientName}
                            />
                            <AvatarFallback>
                              {appointment.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">
                              {appointment.patientName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {appointment.service}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatDate(appointment.date)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.time}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm">Accept</Button>
                          <Button size="sm" variant="outline">
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    ))}
                    {upcomingAppointments.length > 3 && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setActiveTab("appointments")}
                      >
                        View All Appointments
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Appointments</CardTitle>
                  <CardDescription>
                    Manage your upcoming and past appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage
                              src={appointment.patientAvatar}
                              alt={appointment.patientName}
                            />
                            <AvatarFallback>
                              {appointment.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">
                              {appointment.patientName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {appointment.service}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatDate(appointment.date)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.time}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm">Accept</Button>
                          <Button size="sm" variant="outline">
                            Reschedule
                          </Button>
                          <Button size="sm" variant="destructive">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability" className="mt-0">
              <AvailabilityCalendar />
            </TabsContent>

            <TabsContent value="patients" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Patients</CardTitle>
                  <CardDescription>Manage your patient records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center bg-slate-50 rounded-md">
                    <p className="text-muted-foreground">
                      Patient management interface would appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings" className="mt-0">
              <EarningsSummary />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
