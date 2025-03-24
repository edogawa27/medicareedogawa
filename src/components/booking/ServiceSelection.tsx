import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Check,
  Clock,
  Heart,
  Home,
  Stethoscope,
  Thermometer,
  User,
} from "lucide-react";

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  estimatedDuration: string;
}

interface ServiceSelectionProps {
  onNext?: (
    selectedService: string,
    duration: number,
    requirements: string,
  ) => void;
  onBack?: () => void;
}

const ServiceSelection = ({
  onNext = () => {},
  onBack = () => {},
}: ServiceSelectionProps) => {
  const [selectedService, setSelectedService] =
    useState<string>("general-checkup");
  const [duration, setDuration] = useState<number>(60);
  const [requirements, setRequirements] = useState<string>("");

  const serviceOptions: ServiceOption[] = [
    {
      id: "general-checkup",
      name: "General Health Checkup",
      description:
        "Basic health assessment including vital signs and general wellness evaluation",
      icon: <Stethoscope className="h-6 w-6 text-primary" />,
      estimatedDuration: "30-60 min",
    },
    {
      id: "nursing-care",
      name: "Nursing Care",
      description:
        "Professional nursing services including wound care, injections, and monitoring",
      icon: <Heart className="h-6 w-6 text-primary" />,
      estimatedDuration: "45-90 min",
    },
    {
      id: "physiotherapy",
      name: "Physiotherapy Session",
      description:
        "Therapeutic exercises and physical treatments to improve mobility and function",
      icon: <User className="h-6 w-6 text-primary" />,
      estimatedDuration: "60-90 min",
    },
    {
      id: "home-monitoring",
      name: "Home Health Monitoring",
      description:
        "Regular monitoring of vital signs and health parameters for chronic conditions",
      icon: <Thermometer className="h-6 w-6 text-primary" />,
      estimatedDuration: "30-45 min",
    },
    {
      id: "elderly-care",
      name: "Elderly Care Assistance",
      description:
        "Specialized care services for elderly patients including mobility assistance",
      icon: <Home className="h-6 w-6 text-primary" />,
      estimatedDuration: "60-120 min",
    },
  ];

  const handleSubmit = () => {
    onNext(selectedService, duration, requirements);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-background">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Select Healthcare Service
          </CardTitle>
          <CardDescription>
            Choose the type of healthcare service you need and specify any
            special requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Service Type</Label>
            <RadioGroup
              value={selectedService}
              onValueChange={setSelectedService}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {serviceOptions.map((service) => (
                <div key={service.id} className="relative">
                  <RadioGroupItem
                    value={service.id}
                    id={service.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={service.id}
                    className="flex flex-col gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {service.icon}
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-muted peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {service.description}
                    </div>
                    <div className="mt-1 flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{service.estimatedDuration}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="duration" className="text-base font-medium">
                Service Duration (minutes)
              </Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  id="duration"
                  min={30}
                  max={180}
                  step={15}
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center font-medium">{duration}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Adjust the expected duration based on your needs
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-base font-medium">
              Special Requirements
            </Label>
            <Textarea
              id="requirements"
              placeholder="Please describe any special requirements or medical conditions the healthcare provider should know about"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleSubmit}>Continue to Time Selection</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ServiceSelection;
