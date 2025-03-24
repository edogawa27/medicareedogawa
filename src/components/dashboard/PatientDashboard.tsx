import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Calendar,
  Clock,
  Home,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  User,
} from "lucide-react";
import ProviderSearch from "./ProviderSearch";
import ProviderCard from "../providers/ProviderCard";
import AppointmentList from "../appointments/AppointmentList";
import { useAuth } from "../../context/AuthContext";

interface PatientDashboardProps {
  patientName?: string;
  patientAvatar?: string;
}

const PatientDashboard = ({
  patientName,
  patientAvatar,
}: PatientDashboardProps) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(
    null,
  );

  // Use authenticated user data if available, otherwise use props
  const displayName = user?.name || patientName || "John Doe";
  const displayAvatar =
    user?.avatar ||
    patientAvatar ||
    "https://api.dicebear.com/7.x/avataaars/svg?seed=patient1";

  // Mock data for recommended providers
  const recommendedProviders = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.9,
      reviewCount: 124,
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      availability: "Available Today",
      price: 150,
      distance: "3.2 km away",
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialty: "Physiotherapist",
      rating: 4.8,
      reviewCount: 89,
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      availability: "Available Tomorrow",
      price: 120,
      distance: "1.5 km away",
    },
    {
      id: "3",
      name: "Nurse Rebecca Taylor",
      specialty: "Home Care Nurse",
      rating: 4.7,
      reviewCount: 56,
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=rebecca",
      availability: "Available Today",
      price: 90,
      distance: "4.0 km away",
    },
  ];

  // Mock data for quick actions
  const quickActions = [
    {
      icon: <Search className="h-5 w-5" />,
      label: "Find Provider",
      action: () => setActiveTab("search"),
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Book Appointment",
      action: () => setActiveTab("search"),
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Messages",
      action: () => {},
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Appointment History",
      action: () => setActiveTab("appointments"),
    },
  ];

  // Mock data for upcoming appointments
  const upcomingAppointments = [
    {
      id: "APT-1234",
      providerName: "Dr. Jane Smith",
      serviceType: "General Checkup",
      date: "May 15, 2023",
      time: "10:00 AM - 11:00 AM",
      location: "Home Visit",
      status: "upcoming" as const,
    },
    {
      id: "APT-1237",
      providerName: "Dr. David Clark",
      serviceType: "Blood Test",
      date: "May 14, 2023",
      time: "9:00 AM - 9:30 AM",
      location: "Home Visit",
      status: "in-progress" as const,
    },
  ];

  const handleProviderSelect = (providerId: string) => {
    setSelectedProviderId(providerId);
    // In a real app, this would navigate to the provider detail page
    console.log(`Selected provider with ID: ${providerId}`);
  };

  const handleBookNow = (providerId: string) => {
    // In a real app, this would navigate to the booking flow
    console.log(`Booking provider with ID: ${providerId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/10">
              <AvatarImage src={displayAvatar} alt={displayName} />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">Welcome, {displayName}</h2>
              <p className="text-sm text-muted-foreground">Patient Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="search">Find Providers</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-shadow bg-white"
                  >
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        {action.icon}
                      </div>
                      <h3 className="font-medium">{action.label}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Upcoming Appointments */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("appointments")}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                className={
                                  appointment.status === "upcoming"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {appointment.status === "upcoming"
                                  ? "Upcoming"
                                  : "In Progress"}
                              </Badge>
                            </div>
                            <h3 className="font-semibold">
                              {appointment.serviceType}
                            </h3>
                            <div className="text-sm text-muted-foreground mt-1">
                              {appointment.providerName}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-4 w-4" />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm mt-1">
                              <Clock className="h-4 w-4" />
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm mt-1">
                              <Home className="h-4 w-4" />
                              <span>{appointment.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-3 gap-2">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          {appointment.status === "in-progress" ? (
                            <Button size="sm">Join Session</Button>
                          ) : (
                            <Button variant="destructive" size="sm">
                              Cancel
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-white border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">No upcoming appointments</p>
                    <Button
                      className="mt-4"
                      onClick={() => setActiveTab("search")}
                    >
                      Book an Appointment
                    </Button>
                  </Card>
                )}
              </div>
            </section>

            {/* Recommended Providers */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recommended Providers</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("search")}
                >
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedProviders.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    id={provider.id}
                    name={provider.name}
                    specialty={provider.specialty}
                    rating={provider.rating}
                    reviewCount={provider.reviewCount}
                    imageUrl={provider.imageUrl}
                    availability={provider.availability}
                    price={provider.price}
                    distance={provider.distance}
                    onViewProfile={handleProviderSelect}
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search">
            <ProviderSearch onProviderSelect={handleProviderSelect} />
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <AppointmentList userType="patient" />
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation (for mobile) */}
      <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
        <div className="grid grid-cols-3 h-16">
          <button
            className={`flex flex-col items-center justify-center ${activeTab === "overview" ? "text-primary" : "text-gray-500"}`}
            onClick={() => setActiveTab("overview")}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Overview</span>
          </button>
          <button
            className={`flex flex-col items-center justify-center ${activeTab === "search" ? "text-primary" : "text-gray-500"}`}
            onClick={() => setActiveTab("search")}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </button>
          <button
            className={`flex flex-col items-center justify-center ${activeTab === "appointments" ? "text-primary" : "text-gray-500"}`}
            onClick={() => setActiveTab("appointments")}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs mt-1">Appointments</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default PatientDashboard;
