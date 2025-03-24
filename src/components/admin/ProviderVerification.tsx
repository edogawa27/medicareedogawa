import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
} from "lucide-react";

interface Credential {
  id: string;
  name: string;
  issuer: string;
  date: string;
  verified: boolean;
  documentUrl: string;
}

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  experience: number;
  location: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  avatar: string;
  credentials: Credential[];
}

const ProviderVerification = ({
  providers = mockProviders,
}: {
  providers?: Provider[];
}) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [viewCredential, setViewCredential] = useState<Credential | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const pendingProviders = providers.filter(
    (provider) => provider.status === "pending",
  );
  const approvedProviders = providers.filter(
    (provider) => provider.status === "approved",
  );
  const rejectedProviders = providers.filter(
    (provider) => provider.status === "rejected",
  );

  const handleApprove = (providerId: string) => {
    // In a real implementation, this would call an API to update the provider status
    console.log(`Approving provider ${providerId}`);
  };

  const handleReject = (providerId: string) => {
    // In a real implementation, this would call an API to update the provider status
    console.log(`Rejecting provider ${providerId}`);
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Provider Verification</h1>
          <p className="text-muted-foreground">
            Review and verify healthcare provider applications
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            <span>{pendingProviders.length} Pending</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>{approvedProviders.length} Approved</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <XCircle className="h-4 w-4 text-red-500" />
            <span>{rejectedProviders.length} Rejected</span>
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingProviders.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No pending applications to review.
              </CardContent>
            </Card>
          ) : (
            pendingProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onView={() => {
                  setSelectedProvider(provider);
                  setIsDialogOpen(true);
                }}
                onApprove={() => handleApprove(provider.id)}
                onReject={() => handleReject(provider.id)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedProviders.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No approved providers yet.
              </CardContent>
            </Card>
          ) : (
            approvedProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onView={() => {
                  setSelectedProvider(provider);
                  setIsDialogOpen(true);
                }}
                showActions={false}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedProviders.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No rejected applications.
              </CardContent>
            </Card>
          ) : (
            rejectedProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onView={() => {
                  setSelectedProvider(provider);
                  setIsDialogOpen(true);
                }}
                showActions={false}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {selectedProvider && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Provider Application Details</DialogTitle>
              <DialogDescription>
                Review the provider's credentials and information before making
                a decision.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
              <div className="md:w-1/3 flex flex-col items-center p-4 border rounded-md">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage
                    src={selectedProvider.avatar}
                    alt={selectedProvider.name}
                  />
                  <AvatarFallback>
                    {selectedProvider.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">
                  {selectedProvider.name}
                </h3>
                <Badge className="mt-2 mb-4">
                  {selectedProvider.specialty}
                </Badge>

                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedProvider.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedProvider.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedProvider.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {selectedProvider.experience} years experience
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Submitted: {selectedProvider.submittedAt}
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3 overflow-hidden flex flex-col">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Credentials & Certifications
                </h3>
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {selectedProvider.credentials.map((credential) => (
                      <Card key={credential.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">
                                {credential.name}
                              </CardTitle>
                              <CardDescription>
                                Issued by {credential.issuer}
                              </CardDescription>
                            </div>
                            <Badge
                              variant={
                                credential.verified ? "success" : "outline"
                              }
                            >
                              {credential.verified ? "Verified" : "Unverified"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Issued: {credential.date}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => setViewCredential(credential)}
                            >
                              <FileText className="h-4 w-4" />
                              View Document
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <DialogFooter className="mt-6">
              {selectedProvider.status === "pending" && (
                <div className="flex gap-2 w-full justify-end">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedProvider.id)}
                  >
                    Reject Application
                  </Button>
                  <Button onClick={() => handleApprove(selectedProvider.id)}>
                    Approve Provider
                  </Button>
                </div>
              )}
              {selectedProvider.status === "approved" && (
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedProvider.id)}
                >
                  Revoke Approval
                </Button>
              )}
              {selectedProvider.status === "rejected" && (
                <Button onClick={() => handleApprove(selectedProvider.id)}>
                  Reconsider Application
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {viewCredential && (
        <Dialog
          open={!!viewCredential}
          onOpenChange={() => setViewCredential(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{viewCredential.name}</DialogTitle>
              <DialogDescription>
                Issued by {viewCredential.issuer} on {viewCredential.date}
              </DialogDescription>
            </DialogHeader>
            <div className="border rounded-md overflow-hidden">
              <img
                src={viewCredential.documentUrl}
                alt={viewCredential.name}
                className="w-full h-auto object-contain"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewCredential(null)}>
                Close
              </Button>
              <Button>Mark as Verified</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface ProviderCardProps {
  provider: Provider;
  onView: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}

const ProviderCard = ({
  provider,
  onView,
  onApprove,
  onReject,
  showActions = true,
}: ProviderCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={provider.avatar} alt={provider.name} />
              <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{provider.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{provider.specialty}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>{provider.experience} years exp.</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                provider.status === "pending"
                  ? "outline"
                  : provider.status === "approved"
                    ? "success"
                    : "destructive"
              }
            >
              {provider.status.charAt(0).toUpperCase() +
                provider.status.slice(1)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {provider.submittedAt}
            </span>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {provider.credentials.length} Credentials
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{provider.location}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onView}>
              View Details
            </Button>
            {showActions && (
              <>
                <Button variant="outline" size="sm" onClick={onReject}>
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button size="sm" onClick={onApprove}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Mock data for demonstration
const mockProviders: Provider[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    specialty: "Cardiologist",
    experience: 8,
    location: "New York, NY",
    status: "pending",
    submittedAt: "2023-06-15",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    credentials: [
      {
        id: "c1",
        name: "Medical License",
        issuer: "New York State Medical Board",
        date: "2015-05-10",
        verified: false,
        documentUrl:
          "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=800&q=80",
      },
      {
        id: "c2",
        name: "Board Certification - Cardiology",
        issuer: "American Board of Internal Medicine",
        date: "2017-09-22",
        verified: false,
        documentUrl:
          "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=800&q=80",
      },
      {
        id: "c3",
        name: "Medical Degree",
        issuer: "Johns Hopkins University",
        date: "2012-06-01",
        verified: true,
        documentUrl:
          "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=800&q=80",
      },
    ],
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 987-6543",
    specialty: "Physiotherapist",
    experience: 5,
    location: "San Francisco, CA",
    status: "pending",
    submittedAt: "2023-06-18",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    credentials: [
      {
        id: "c4",
        name: "Physical Therapy License",
        issuer: "California Physical Therapy Board",
        date: "2018-03-15",
        verified: false,
        documentUrl:
          "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=800&q=80",
      },
      {
        id: "c5",
        name: "Doctor of Physical Therapy",
        issuer: "University of California",
        date: "2017-05-20",
        verified: false,
        documentUrl:
          "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=800&q=80",
      },
    ],
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    phone: "+1 (555) 456-7890",
    specialty: "Pediatrician",
    experience: 12,
    location: "Chicago, IL",
    status: "approved",
    submittedAt: "2023-05-30",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    credentials: [
      {
        id: "c6",
        name: "Medical License",
        issuer: "Illinois Department of Financial and Professional Regulation",
        date: "2011-07-12",
        verified: true,
        documentUrl:
          "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=800&q=80",
      },
      {
        id: "c7",
        name: "Board Certification - Pediatrics",
        issuer: "American Board of Pediatrics",
        date: "2013-11-05",
        verified: true,
        documentUrl:
          "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=800&q=80",
      },
    ],
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    email: "james.wilson@example.com",
    phone: "+1 (555) 789-0123",
    specialty: "Nurse Practitioner",
    experience: 3,
    location: "Austin, TX",
    status: "rejected",
    submittedAt: "2023-06-10",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    credentials: [
      {
        id: "c8",
        name: "Nurse Practitioner License",
        issuer: "Texas Board of Nursing",
        date: "2020-02-28",
        verified: false,
        documentUrl:
          "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=800&q=80",
      },
    ],
  },
];

export default ProviderVerification;
