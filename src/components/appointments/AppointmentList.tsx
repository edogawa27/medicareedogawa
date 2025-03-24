import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, MoreVertical, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppointmentProps {
  id: string;
  patientName?: string;
  providerName?: string;
  serviceType: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled" | "in-progress";
  userType?: "patient" | "provider" | "admin";
}

interface AppointmentListProps {
  appointments?: AppointmentProps[];
  userType?: "patient" | "provider" | "admin";
}

const getStatusColor = (status: AppointmentProps["status"]) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "in-progress":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const AppointmentCard = ({
  appointment,
  userType = "patient",
}: {
  appointment: AppointmentProps;
  userType?: "patient" | "provider" | "admin";
}) => {
  return (
    <Card className="mb-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </Badge>
              <span className="text-sm text-gray-500">{appointment.id}</span>
            </div>

            <h3 className="text-lg font-semibold mb-1">
              {appointment.serviceType}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {userType === "patient"
                    ? appointment.providerName || "Dr. Jane Smith"
                    : appointment.patientName || "John Doe"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{appointment.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{appointment.time}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{appointment.location}</span>
              </div>
            </div>
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                {appointment.status === "upcoming" && (
                  <>
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Cancel
                    </DropdownMenuItem>
                  </>
                )}
                {appointment.status === "completed" && (
                  <DropdownMenuItem>Leave Review</DropdownMenuItem>
                )}
                {userType === "provider" &&
                  appointment.status === "upcoming" && (
                    <DropdownMenuItem>Start Session</DropdownMenuItem>
                  )}
                {userType === "provider" &&
                  appointment.status === "in-progress" && (
                    <DropdownMenuItem>Complete Session</DropdownMenuItem>
                  )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          {appointment.status === "upcoming" && (
            <>
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
              <Button variant="destructive" size="sm">
                Cancel
              </Button>
            </>
          )}
          {appointment.status === "completed" && userType === "patient" && (
            <Button variant="outline" size="sm">
              Leave Review
            </Button>
          )}
          {userType === "provider" && appointment.status === "upcoming" && (
            <Button variant="default" size="sm">
              Start Session
            </Button>
          )}
          {userType === "provider" && appointment.status === "in-progress" && (
            <Button variant="default" size="sm">
              Complete Session
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const AppointmentList = ({
  appointments = [],
  userType = "patient",
}: AppointmentListProps) => {
  // Default appointments if none provided
  const defaultAppointments: AppointmentProps[] = [
    {
      id: "APT-1234",
      patientName: "John Doe",
      providerName: "Dr. Jane Smith",
      serviceType: "General Checkup",
      date: "May 15, 2023",
      time: "10:00 AM - 11:00 AM",
      location: "Home Visit",
      status: "upcoming",
    },
    {
      id: "APT-1235",
      patientName: "Sarah Johnson",
      providerName: "Dr. Michael Brown",
      serviceType: "Physiotherapy Session",
      date: "May 12, 2023",
      time: "2:00 PM - 3:00 PM",
      location: "Home Visit",
      status: "completed",
    },
    {
      id: "APT-1236",
      patientName: "Robert Wilson",
      providerName: "Nurse Emily Davis",
      serviceType: "Wound Dressing",
      date: "May 18, 2023",
      time: "4:30 PM - 5:00 PM",
      location: "Home Visit",
      status: "cancelled",
    },
    {
      id: "APT-1237",
      patientName: "Lisa Thompson",
      providerName: "Dr. David Clark",
      serviceType: "Blood Test",
      date: "May 14, 2023",
      time: "9:00 AM - 9:30 AM",
      location: "Home Visit",
      status: "in-progress",
    },
  ];

  const displayAppointments =
    appointments.length > 0 ? appointments : defaultAppointments;

  return (
    <div className="w-full bg-gray-50 p-4 rounded-lg">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold">Appointments</CardTitle>
      </CardHeader>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {displayAppointments.filter((apt) => apt.status === "upcoming")
            .length > 0 ? (
            displayAppointments
              .filter((apt) => apt.status === "upcoming")
              .map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  userType={userType}
                />
              ))
          ) : (
            <Card className="bg-white border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No upcoming appointments</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="in-progress">
          {displayAppointments.filter((apt) => apt.status === "in-progress")
            .length > 0 ? (
            displayAppointments
              .filter((apt) => apt.status === "in-progress")
              .map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  userType={userType}
                />
              ))
          ) : (
            <Card className="bg-white border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No appointments in progress</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {displayAppointments.filter((apt) => apt.status === "completed")
            .length > 0 ? (
            displayAppointments
              .filter((apt) => apt.status === "completed")
              .map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  userType={userType}
                />
              ))
          ) : (
            <Card className="bg-white border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No completed appointments</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {displayAppointments.filter((apt) => apt.status === "cancelled")
            .length > 0 ? (
            displayAppointments
              .filter((apt) => apt.status === "cancelled")
              .map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  userType={userType}
                />
              ))
          ) : (
            <Card className="bg-white border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No cancelled appointments</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentList;
