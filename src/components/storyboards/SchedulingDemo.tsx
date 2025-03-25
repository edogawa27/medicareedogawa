import React from "react";
import BookingFlow from "../booking/BookingFlow";

const SchedulingDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Scheduling Interface Demo
      </h1>
      <BookingFlow
        providerId="1"
        onComplete={(bookingData) => {
          console.log("Booking completed:", bookingData);
        }}
      />
    </div>
  );
};

export default SchedulingDemo;
