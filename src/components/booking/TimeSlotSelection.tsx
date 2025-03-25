import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addDays, isSameDay, startOfToday, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import { getAvailableDates, getAvailableTimeSlots } from "@/lib/api";

interface TimeSlotSelectionProps {
  onSelectTimeSlot?: (date: Date, time: string) => void;
  providerId?: string;
  serviceId?: string;
  availableDates?: Date[];
  availableTimeSlots?: Record<string, string[]>;
}

const TimeSlotSelection = ({
  onSelectTimeSlot = () => {},
  providerId = "1",
  serviceId = "1",
  availableDates = [],
  availableTimeSlots = {},
}: TimeSlotSelectionProps) => {
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"calendar" | "time">(
    "calendar",
  );
  const [dates, setDates] = useState<Date[]>(availableDates);
  const [timeSlots, setTimeSlots] =
    useState<Record<string, string[]>>(availableTimeSlots);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available dates and time slots from the API
  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Only fetch from API if no data was provided as props
        if (availableDates.length === 0) {
          const fetchedDates = await getAvailableDates(
            providerId,
            today,
            addMonths(today, 1),
          );
          setDates(fetchedDates);
        }

        if (Object.keys(availableTimeSlots).length === 0) {
          const fetchedTimeSlots = await getAvailableTimeSlots(
            providerId,
            today,
            addMonths(today, 1),
          );
          setTimeSlots(fetchedTimeSlots);
        }
      } catch (err) {
        console.error("Error fetching availability:", err);
        setError("Failed to load available time slots. Please try again.");

        // Fallback to mock data if API fails
        setDates([
          today,
          addDays(today, 1),
          addDays(today, 2),
          addDays(today, 3),
          addDays(today, 5),
          addDays(today, 7),
          addDays(today, 8),
        ]);

        setTimeSlots({
          [format(today, "yyyy-MM-dd")]: [
            "09:00",
            "10:00",
            "11:00",
            "14:00",
            "15:00",
          ],
          [format(addDays(today, 1), "yyyy-MM-dd")]: [
            "09:00",
            "10:00",
            "13:00",
            "14:00",
            "16:00",
          ],
          [format(addDays(today, 2), "yyyy-MM-dd")]: [
            "10:00",
            "11:00",
            "13:00",
            "15:00",
          ],
          [format(addDays(today, 3), "yyyy-MM-dd")]: [
            "09:00",
            "11:00",
            "14:00",
          ],
          [format(addDays(today, 5), "yyyy-MM-dd")]: [
            "10:00",
            "13:00",
            "16:00",
          ],
          [format(addDays(today, 7), "yyyy-MM-dd")]: [
            "09:00",
            "10:00",
            "11:00",
            "14:00",
          ],
          [format(addDays(today, 8), "yyyy-MM-dd")]: [
            "13:00",
            "14:00",
            "15:00",
            "16:00",
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [providerId, availableDates, availableTimeSlots]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
    if (date) {
      setCurrentView("time");
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSelectTimeSlot(selectedDate, time);
    }
  };

  const getAvailableTimesForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return timeSlots[dateKey] || [];
  };

  const isDateAvailable = (date: Date) => {
    return dates.some((availableDate) => isSameDay(availableDate, date));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm w-full max-w-3xl mx-auto">
      <Tabs
        defaultValue="calendar"
        value={currentView}
        onValueChange={(value) => setCurrentView(value as "calendar" | "time")}
      >
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-xl font-bold">
            Select Appointment Time
          </CardTitle>
          <TabsList>
            <TabsTrigger value="calendar">Date</TabsTrigger>
            <TabsTrigger value="time" disabled={!selectedDate}>
              Time
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="calendar" className="space-y-4">
          <CardDescription className="text-sm text-gray-500 mb-4">
            Select an available date for your appointment
          </CardDescription>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={{
              before: today,
              after: addDays(today, 30),
              dayOfWeek: [0], // Disable Sundays
              // Custom function to disable dates not in available dates
              custom: (date) => !isDateAvailable(date),
            }}
            className="rounded-md border"
          />

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => selectedDate && setCurrentView("time")}
              disabled={!selectedDate}
              className="flex items-center gap-2"
            >
              Select Time <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => setCurrentView("calendar")}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Calendar
            </Button>
            <CardDescription className="text-sm font-medium">
              {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : ""}
            </CardDescription>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Time Slots</CardTitle>
              <CardDescription>
                Select a time slot for your appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {getAvailableTimesForSelectedDate().length > 0 ? (
                  getAvailableTimesForSelectedDate().map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={`flex items-center justify-center gap-2 ${selectedTime === time ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"}`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      <Clock className="h-4 w-4" />
                      {time}
                    </Button>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 py-4">
                    No available time slots for this date
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end mt-4">
            <Button
              disabled={!selectedTime}
              className="flex items-center gap-2"
              onClick={() =>
                selectedDate &&
                selectedTime &&
                onSelectTimeSlot(selectedDate, selectedTime)
              }
            >
              Confirm Selection
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeSlotSelection;
