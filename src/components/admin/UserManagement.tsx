import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  UserRound,
  UserCog,
  Shield,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Ban,
  CheckCircle,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "patient" | "provider" | "admin";
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  avatar: string;
}

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Mock data for users
  const users: User[] = [
    {
      id: "USR-1234",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      role: "patient",
      status: "active",
      joinDate: "Jan 15, 2023",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    {
      id: "USR-1235",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "(555) 987-6543",
      role: "provider",
      status: "active",
      joinDate: "Feb 10, 2023",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      id: "USR-1236",
      name: "Admin User",
      email: "admin@example.com",
      phone: "(555) 456-7890",
      role: "admin",
      status: "active",
      joinDate: "Dec 5, 2022",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    },
    {
      id: "USR-1237",
      name: "Emily Wilson",
      email: "emily.wilson@example.com",
      phone: "(555) 234-5678",
      role: "patient",
      status: "inactive",
      joinDate: "Mar 20, 2023",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    {
      id: "USR-1238",
      name: "Dr. Michael Chen",
      email: "michael.chen@example.com",
      phone: "(555) 876-5432",
      role: "provider",
      status: "suspended",
      joinDate: "Jan 8, 2023",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
  ];

  // Filter users based on active tab and search query
  const filteredUsers = users.filter((user) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "patients" && user.role === "patient") ||
      (activeTab === "providers" && user.role === "provider") ||
      (activeTab === "admins" && user.role === "admin");

    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Get the selected user details
  const selectedUserDetails = selectedUser
    ? users.find((user) => user.id === selectedUser)
    : null;

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "patient":
        return <UserRound className="h-4 w-4 text-blue-500" />;
      case "provider":
        return <UserCog className="h-4 w-4 text-green-500" />;
      case "admin":
        return <Shield className="h-4 w-4 text-purple-500" />;
      default:
        return <UserRound className="h-4 w-4" />;
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <UserRound className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="admins">Administrators</TabsTrigger>
            </TabsList>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      User
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Join Date
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className={`border-b hover:bg-gray-50 cursor-pointer ${selectedUser === user.id ? "bg-gray-50" : ""}`}
                        onClick={() => setSelectedUser(user.id)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {getRoleIcon(user.role)}
                            <span className="capitalize">{user.role}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusBadgeColor(user.status)}>
                            {user.status.charAt(0).toUpperCase() +
                              user.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{user.joinDate}</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-gray-500"
                      >
                        No users found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {selectedUserDetails && (
        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={selectedUserDetails.avatar} />
                    <AvatarFallback>
                      {selectedUserDetails.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">
                    {selectedUserDetails.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    {getRoleIcon(selectedUserDetails.role)}
                    <span className="capitalize text-gray-600">
                      {selectedUserDetails.role}
                    </span>
                  </div>
                  <Badge
                    className={`mt-3 ${getStatusBadgeColor(selectedUserDetails.status)}`}
                  >
                    {selectedUserDetails.status.charAt(0).toUpperCase() +
                      selectedUserDetails.status.slice(1)}
                  </Badge>

                  <div className="mt-6 space-y-2 w-full">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{selectedUserDetails.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{selectedUserDetails.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Joined {selectedUserDetails.joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Account Actions
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                      <Button variant="outline">
                        <UserRound className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      {selectedUserDetails.status === "active" ? (
                        <Button variant="destructive">
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend Account
                        </Button>
                      ) : selectedUserDetails.status === "suspended" ? (
                        <Button variant="default">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Reactivate Account
                        </Button>
                      ) : (
                        <Button variant="default">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate Account
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Activity Log</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-sm">
                          <span className="font-medium">Login</span> - User
                          logged in from New York, USA
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Today, 10:30 AM
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-sm">
                          <span className="font-medium">Profile Update</span> -
                          User updated their profile information
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Yesterday, 2:15 PM
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-sm">
                          <span className="font-medium">Appointment</span> -
                          User booked an appointment with Dr. Sarah Johnson
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          May 10, 2023, 9:45 AM
                        </p>
                      </div>
                    </div>
                    <Button variant="link" className="mt-2 p-0 h-auto">
                      View Full Activity Log
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
