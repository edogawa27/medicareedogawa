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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import ServiceSelection from "./ServiceSelection";
import TimeSlotSelection from "./TimeSlotSelection";
import PaymentOptions from "../payment/PaymentOptions";
import { createAppointment } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { format, addHours, parseISO } from "date-fns";

interface BookingFlowProps {
  providerId?: string;
  initialStep?: number;
  onComplete?: (bookingData: BookingData) => void;
  onCancel?: () => void;
}

interface BookingData {
  providerId: string;
  serviceId: string;
  serviceDuration: number;
  specialRequirements: string;
  appointmentDate: Date | null;
  appointmentTime: string | null;
  paymentMethod: string;
  appointmentId?: string; // Added for confirmation
}

const BookingFlow = ({
  providerId = "1",
  initialStep = 0,
  onComplete = () => {},
  onCancel = () => {},
}: BookingFlowProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [bookingData, setBookingData] = useState<BookingData>({
    providerId: providerId,
    serviceId: "",
    serviceDuration: 60,
    specialRequirements: "",
    appointmentDate: null,
    appointmentTime: null,
    paymentMethod: "credit_card",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: "service", title: "Service Selection" },
    { id: "time", title: "Time Slot" },
    { id: "payment", title: "Payment" },
    { id: "confirmation", title: "Confirmation" },
  ];

  const handleServiceSelection = (
    serviceId: string,
    duration: number,
    requirements: string,
  ) => {
    setBookingData((prev) => ({
      ...prev,
      serviceId,
      serviceDuration: duration,
      specialRequirements: requirements,
    }));
    setCurrentStep(1);
  };

  const handleTimeSelection = (date: Date, time: string) => {
    setBookingData((prev) => ({
      ...prev,
      appointmentDate: date,
      appointmentTime: time,
    }));
    setCurrentStep(2);
  };

  const handlePaymentSelection = (method: string) => {
    setBookingData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const handlePaymentComplete = async () => {
    if (!user) {
      setError("You must be logged in to book an appointment");
      return;
    }

    if (!bookingData.appointmentDate || !bookingData.appointmentTime) {
      setError("Please select a date and time for your appointment");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Calculate end time (add 1 hour by default or use service duration)
      const startTime = bookingData.appointmentTime;
      const appointmentDate = format(bookingData.appointmentDate, "yyyy-MM-dd");

      // Calculate end time by adding the service duration
      const startDateTime = new Date(`${appointmentDate}T${startTime}`);
      const endDateTime = addHours(
        startDateTime,
        bookingData.serviceDuration / 60,
      );
      const endTime = format(endDateTime, "HH:mm");

      // Create appointment in the database with proper patient and provider linking
      const result = await createAppointment({
        patient_id: user.id,
        provider_id: bookingData.providerId,
        service_id: bookingData.serviceId,
        appointment_date: appointmentDate,
        start_time: startTime,
        end_time: endTime,
        duration: bookingData.serviceDuration,
        special_requirements: bookingData.specialRequirements,
        payment_method: bookingData.paymentMethod,
        amount: calculateAmount(),
        patient_name: user.name,
        patient_email: user.email,
        provider_details_required: true,
      });

      // Update booking data with the appointment ID
      setBookingData((prev) => ({
        ...prev,
        appointmentId: result.id,
      }));

      // Move to confirmation step
      setCurrentStep(3);
      onComplete({
        ...bookingData,
        appointmentId: result.id,
      });
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAmount = () => {
    // Simple calculation based on service duration
    const baseRate = 75; // per hour
    return (bookingData.serviceDuration / 60) * baseRate;
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ServiceSelection onNext={handleServiceSelection} onBack={onCancel} />
        );
      case 1:
        return (
          <TimeSlotSelection
            onSelectTimeSlot={handleTimeSelection}
            providerId={bookingData.providerId}
            serviceId={bookingData.serviceId}
          />
        );
      case 2:
        return (
          <PaymentOptions
            onPaymentSelect={handlePaymentSelection}
            onPaymentComplete={handlePaymentComplete}
            amount={calculateAmount()}
            serviceName={getServiceName()}
          />
        );
      case 3:
        return (
          <BookingConfirmation
            bookingData={bookingData}
            onDone={() => (window.location.href = "/dashboard")}
          />
        );
      default:
        return null;
    }
  };

  const getServiceName = () => {
    const serviceNames: Record<string, string> = {
      "general-checkup": "General Health Checkup",
      "nursing-care": "Nursing Care",
      physiotherapy: "Physiotherapy Session",
      "home-monitoring": "Home Health Monitoring",
      "elderly-care": "Elderly Care Assistance",
    };

    return serviceNames[bookingData.serviceId] || "Healthcare Service";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-background">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Book Healthcare Service
          </CardTitle>
          <CardDescription className="text-center">
            Complete the following steps to book your healthcare service
          </CardDescription>

          <div className="flex justify-center mt-6">
            <div className="flex items-center">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${index <= currentStep ? "bg-primary border-primary text-primary-foreground" : "border-gray-300 text-gray-400"}`}
                    >
                      {index < currentStep ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs mt-1 ${index <= currentStep ? "text-primary font-medium" : "text-gray-500"}`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 sm:w-20 ${index < currentStep ? "bg-primary" : "bg-gray-300"}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>{getStepContent()}</CardContent>
      </Card>
    </div>
  );
};

interface BookingConfirmationProps {
  bookingData: BookingData;
  onDone: () => void;
}

const BookingConfirmation = ({
  bookingData,
  onDone = () => {},
}: BookingConfirmationProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">
          Your healthcare service has been successfully booked. A confirmation
          has been sent to your email.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-3">Booking Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Service:</span>
            <span className="font-medium">
              {getServiceName(bookingData.serviceId)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span className="font-medium">
              {bookingData.appointmentDate?.toLocaleDateString() ||
                "Not specified"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time:</span>
            <span className="font-medium">
              {bookingData.appointmentTime || "Not specified"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Duration:</span>
            <span className="font-medium">
              {bookingData.serviceDuration} minutes
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Method:</span>
            <span className="font-medium">
              {formatPaymentMethod(bookingData.paymentMethod)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <Button onClick={onDone} className="w-full">
          Go to Dashboard
        </Button>
        <Button variant="outline" className="w-full">
          Download Receipt
        </Button>
      </div>
    </div>
  );
};

// Helper functions
const getServiceName = (serviceId: string): string => {
  const serviceNames: Record<string, string> = {
    "general-checkup": "General Health Checkup",
    "nursing-care": "Nursing Care",
    physiotherapy: "Physiotherapy Session",
    "home-monitoring": "Home Health Monitoring",
    "elderly-care": "Elderly Care Assistance",
  };

  return serviceNames[serviceId] || "Healthcare Service";
};

const formatPaymentMethod = (method: string): string => {
  const methodNames: Record<string, string> = {
    credit_card: "Credit/Debit Card",
    digital_wallet: "Digital Wallet",
    bank_transfer: "Bank Transfer",
  };

  return methodNames[method] || method;
};

export default BookingFlow;
