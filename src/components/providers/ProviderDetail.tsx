import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  MapPin,
  Clock,
  Award,
  Calendar as CalendarIcon,
  Phone,
  Mail,
  MessageSquare,
  Heart,
  Share2,
} from "lucide-react";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
}

interface Qualification {
  degree: string;
  institution: string;
  year: string;
}

interface ProviderDetailProps {
  id?: string;
  name?: string;
  specialty?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  experience?: string;
  avatar?: string;
  bio?: string;
  services?: Service[];
  qualifications?: Qualification[];
  languages?: string[];
  availability?: Date[];
}

const ProviderDetail = ({
  id = "p123",
  name = "Dr. Sarah Johnson",
  specialty = "General Physician",
  rating = 4.8,
  reviewCount = 124,
  location = "Jakarta, Indonesia",
  experience = "10 years",
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  bio = "Dr. Sarah Johnson is a dedicated general physician with over 10 years of experience in providing comprehensive healthcare services. She specializes in preventive care, chronic disease management, and geriatric medicine. Dr. Johnson is known for her patient-centered approach and takes time to listen to her patients' concerns.",
  services = [
    {
      id: "s1",
      name: "General Consultation",
      description: "Comprehensive health assessment and consultation",
      duration: "30 min",
      price: 250000,
    },
    {
      id: "s2",
      name: "Follow-up Visit",
      description: "Review of treatment progress and adjustments",
      duration: "20 min",
      price: 150000,
    },
    {
      id: "s3",
      name: "Home Visit",
      description: "Medical consultation in the comfort of your home",
      duration: "45 min",
      price: 350000,
    },
    {
      id: "s4",
      name: "Telemedicine Consultation",
      description: "Virtual consultation via video call",
      duration: "25 min",
      price: 200000,
    },
  ],
  qualifications = [
    {
      degree: "Doctor of Medicine",
      institution: "University of Indonesia",
      year: "2013",
    },
    {
      degree: "Residency in Internal Medicine",
      institution: "Jakarta General Hospital",
      year: "2016",
    },
    {
      degree: "Fellowship in Geriatric Medicine",
      institution: "National Geriatric Center",
      year: "2018",
    },
  ],
  languages = ["English", "Indonesian", "Mandarin"],
  availability = [
    new Date(2023, 5, 10),
    new Date(2023, 5, 11),
    new Date(2023, 5, 12),
    new Date(2023, 5, 15),
    new Date(2023, 5, 16),
    new Date(2023, 5, 17),
  ],
}: ProviderDetailProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isFavorite, setIsFavorite] = useState(false);

  // Format currency to Indonesian Rupiah
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          size={16}
          className={
            index < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }
        />
      ));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl bg-gray-50">
      {/* Provider Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white shadow-md">
              <img src={avatar} alt={name} className="object-cover" />
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {name}
                  </h1>
                  <p className="text-lg text-gray-600">{specialty}</p>

                  <div className="flex items-center mt-2">
                    <div className="flex mr-2">{renderStars(rating)}</div>
                    <span className="text-sm font-medium text-gray-700">
                      {rating}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={isFavorite ? "text-red-500" : "text-gray-500"}
                  >
                    <Heart
                      className={isFavorite ? "fill-red-500" : ""}
                      size={20}
                    />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 size={20} />
                  </Button>
                  <Button>Book Appointment</Button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock size={16} className="mr-2" />
                  <span>{experience} experience</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Award size={16} className="mr-2" />
                  <span>Verified Provider</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{bio}</p>

                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((language) => (
                        <Badge key={language} variant="secondary">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone size={16} className="mr-2 text-gray-500" />
                        <span className="text-gray-700">+62 812-3456-7890</span>
                      </div>
                      <div className="flex items-center">
                        <Mail size={16} className="mr-2 text-gray-500" />
                        <span className="text-gray-700">
                          dr.sarah.johnson@healthcare.com
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare
                          size={16}
                          className="mr-2 text-gray-500"
                        />
                        <span className="text-gray-700">
                          Available for chat consultation
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {service.name}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {service.description}
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Clock size={14} className="mr-1" />
                              <span>{service.duration}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(service.price)}
                            </p>
                            <Button size="sm" className="mt-2">
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qualifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Qualifications & Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {qualifications.map((qualification, index) => (
                      <div key={index} className="relative pl-8 pb-6">
                        {index !== qualifications.length - 1 && (
                          <div className="absolute left-3 top-2 bottom-0 w-0.5 bg-gray-200"></div>
                        )}
                        <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                          {qualification.year.slice(-2)}
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          {qualification.degree}
                        </h3>
                        <p className="text-gray-600">
                          {qualification.institution}
                        </p>
                        <p className="text-sm text-gray-500">
                          {qualification.year}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Certifications
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Board Certified in Internal Medicine</li>
                      <li>Advanced Cardiac Life Support (ACLS)</li>
                      <li>Certified in Geriatric Medicine</li>
                      <li>Telemedicine Certification</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <ReviewList showFilters={true} />
                  <Separator className="my-8" />
                  <ReviewForm providerId={id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Availability & Booking */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Book an Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Select a date
                </h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    // Disable dates in the past
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // Check if date is in the availability array
                    const isAvailable = availability.some(
                      (availableDate) =>
                        availableDate.getDate() === date.getDate() &&
                        availableDate.getMonth() === date.getMonth() &&
                        availableDate.getFullYear() === date.getFullYear(),
                    );

                    return date < today || !isAvailable;
                  }}
                  className="rounded-md border"
                />
              </div>

              {selectedDate && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Available time slots
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map(
                      (time) => (
                        <Button
                          key={time}
                          variant="outline"
                          className="justify-start"
                        >
                          <CalendarIcon size={14} className="mr-2" />
                          {time}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Button className="w-full">Book Appointment</Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  You won't be charged until after your appointment
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">09:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">09:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-red-500">Closed</span>
                </div>
              </div>
              <Separator className="my-4" />
              <p className="text-sm text-gray-600">
                <span className="font-medium">Note:</span> Home visits may be
                scheduled outside of regular hours based on availability.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;
