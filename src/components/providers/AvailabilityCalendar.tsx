import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Save, Trash2 } from "lucide-react";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  daysOfWeek?: string[];
}

interface AvailabilityCalendarProps {
  initialDate?: Date;
  availableTimeSlots?: TimeSlot[];
  onSaveAvailability?: (slots: TimeSlot[]) => void;
}

const AvailabilityCalendar = ({
  initialDate = new Date(),
  availableTimeSlots = [
    {
      id: "1",
      startTime: "09:00",
      endTime: "10:30",
      isRecurring: true,
      daysOfWeek: ["Mon", "Wed", "Fri"],
    },
    {
      id: "2",
      startTime: "13:00",
      endTime: "15:00",
      isRecurring: true,
      daysOfWeek: ["Tue", "Thu"],
    },
    { id: "3", startTime: "18:00", endTime: "19:30", isRecurring: false },
  ],
  onSaveAvailability = () => {},
}: AvailabilityCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(availableTimeSlots);
  const [activeTab, setActiveTab] = useState("daily");

  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  });

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: "09:00",
      endTime: "10:00",
      isRecurring: activeTab === "recurring",
      daysOfWeek: activeTab === "recurring" ? ["Mon"] : undefined,
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
  };

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: any) => {
    setTimeSlots(
      timeSlots.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot,
      ),
    );
  };

  const handleSave = () => {
    onSaveAvailability(timeSlots);
  };

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDayOfWeek = (slotId: string, day: string) => {
    const slot = timeSlots.find((s) => s.id === slotId);
    if (!slot) return;

    const currentDays = slot.daysOfWeek || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    updateTimeSlot(slotId, "daysOfWeek", newDays);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Availability Calendar</CardTitle>
              <CardDescription>
                Select dates to view or set your availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />

              <div className="mt-4 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm">Available</span>

                <div className="w-4 h-4 rounded-full bg-gray-300 ml-4"></div>
                <span className="text-sm">Unavailable</span>

                <div className="w-4 h-4 rounded-full bg-blue-500 ml-4"></div>
                <span className="text-sm">Selected</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Time Slots</CardTitle>
              <CardDescription>
                Manage your available time slots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="recurring">Recurring</TabsTrigger>
                </TabsList>

                <TabsContent value="daily" className="space-y-4">
                  <div className="py-2">
                    <h3 className="text-sm font-medium mb-2">
                      {date
                        ? date.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Select a date"}
                    </h3>

                    {timeSlots
                      .filter((slot) => !slot.isRecurring)
                      .map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center gap-2 mb-3 p-3 border rounded-md"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <div className="grid grid-cols-2 gap-2 w-full">
                                <Select
                                  value={slot.startTime}
                                  onValueChange={(value) =>
                                    updateTimeSlot(slot.id, "startTime", value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Start time" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeOptions.map((time) => (
                                      <SelectItem
                                        key={`start-${time}`}
                                        value={time}
                                      >
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <Select
                                  value={slot.endTime}
                                  onValueChange={(value) =>
                                    updateTimeSlot(slot.id, "endTime", value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="End time" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeOptions.map((time) => (
                                      <SelectItem
                                        key={`end-${time}`}
                                        value={time}
                                      >
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTimeSlot(slot.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={addTimeSlot}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Time Slot
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="recurring" className="space-y-4">
                  {timeSlots
                    .filter((slot) => slot.isRecurring)
                    .map((slot) => (
                      <div key={slot.id} className="mb-4 p-3 border rounded-md">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <div className="grid grid-cols-2 gap-2 w-full">
                            <Select
                              value={slot.startTime}
                              onValueChange={(value) =>
                                updateTimeSlot(slot.id, "startTime", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Start time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem
                                    key={`recur-start-${time}`}
                                    value={time}
                                  >
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={slot.endTime}
                              onValueChange={(value) =>
                                updateTimeSlot(slot.id, "endTime", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="End time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem
                                    key={`recur-end-${time}`}
                                    value={time}
                                  >
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTimeSlot(slot.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <Separator className="my-2" />

                        <div className="mt-2">
                          <Label className="text-sm font-medium">
                            Repeat on days:
                          </Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {daysOfWeek.map((day) => {
                              const isSelected =
                                slot.daysOfWeek?.includes(day) || false;
                              return (
                                <Badge
                                  key={day}
                                  variant={isSelected ? "default" : "outline"}
                                  className={`cursor-pointer ${isSelected ? "bg-primary" : ""}`}
                                  onClick={() => toggleDayOfWeek(slot.id, day)}
                                >
                                  {day}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}

                  <Button variant="outline" size="sm" onClick={addTimeSlot}>
                    <Plus className="h-4 w-4 mr-2" /> Add Recurring Slot
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <Button onClick={handleSave} className="w-full">
                  <Save className="h-4 w-4 mr-2" /> Save Availability
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
