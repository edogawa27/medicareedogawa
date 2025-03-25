import { supabase } from "./supabase";
import { format } from "date-fns";

// Types
export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  estimated_duration: number;
}

export interface TimeSlot {
  id: string;
  provider_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Appointment {
  id: string;
  patient_id: string;
  provider_id: string;
  service_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  special_requirements?: string;
  status: "upcoming" | "in-progress" | "completed" | "cancelled";
  payment_method?: string;
  payment_status?: string;
  amount?: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  provider_name?: string;
  service_name?: string;
  patient_name?: string;
}

// API functions
export const getServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase.from("services").select("*");

  if (error) {
    console.error("Error fetching services:", error);
    throw error;
  }

  return data || [];
};

export const getAvailableTimeSlots = async (
  providerId: string,
  startDate: Date,
  endDate: Date,
): Promise<Record<string, string[]>> => {
  const formattedStartDate = format(startDate, "yyyy-MM-dd");
  const formattedEndDate = format(endDate, "yyyy-MM-dd");

  const { data, error } = await supabase
    .from("provider_availability")
    .select("*")
    .eq("provider_id", providerId)
    .eq("is_available", true)
    .gte("date", formattedStartDate)
    .lte("date", formattedEndDate);

  if (error) {
    console.error("Error fetching time slots:", error);
    throw error;
  }

  // Group time slots by date
  const timeSlotsByDate: Record<string, string[]> = {};

  data?.forEach((slot: TimeSlot) => {
    const dateKey = slot.date;
    if (!timeSlotsByDate[dateKey]) {
      timeSlotsByDate[dateKey] = [];
    }
    // Just use the start time for simplicity
    timeSlotsByDate[dateKey].push(slot.start_time.substring(0, 5));
  });

  return timeSlotsByDate;
};

export const getAvailableDates = async (
  providerId: string,
  startDate: Date,
  endDate: Date,
): Promise<Date[]> => {
  const formattedStartDate = format(startDate, "yyyy-MM-dd");
  const formattedEndDate = format(endDate, "yyyy-MM-dd");

  const { data, error } = await supabase
    .from("provider_availability")
    .select("date")
    .eq("provider_id", providerId)
    .eq("is_available", true)
    .gte("date", formattedStartDate)
    .lte("date", formattedEndDate)
    .order("date")
    .distinct();

  if (error) {
    console.error("Error fetching available dates:", error);
    throw error;
  }

  // Convert string dates to Date objects
  return (data || []).map((item) => new Date(item.date));
};

export const createAppointment = async (appointmentData: {
  patient_id: string;
  provider_id: string;
  service_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  special_requirements?: string;
  payment_method: string;
  amount: number;
}): Promise<{ id: string }> => {
  const { data, error } = await supabase
    .from("appointments")
    .insert([
      {
        ...appointmentData,
        status: "upcoming",
        payment_status: "completed",
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }

  // Update the availability to mark the slot as unavailable
  await supabase
    .from("provider_availability")
    .update({ is_available: false })
    .eq("provider_id", appointmentData.provider_id)
    .eq("date", appointmentData.appointment_date)
    .eq("start_time", appointmentData.start_time);

  return data;
};

export const getAppointmentsByPatient = async (
  patientId: string,
): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      provider:provider_id(name),
      service:service_id(name)
    `,
    )
    .eq("patient_id", patientId)
    .order("appointment_date", { ascending: false });

  if (error) {
    console.error("Error fetching patient appointments:", error);
    throw error;
  }

  // Format the data to match the Appointment interface
  return (data || []).map((item) => ({
    ...item,
    provider_name: item.provider?.name,
    service_name: item.service?.name,
  }));
};

export const getAppointmentsByProvider = async (
  providerId: string,
): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      patient:patient_id(name),
      service:service_id(name)
    `,
    )
    .eq("provider_id", providerId)
    .order("appointment_date", { ascending: false });

  if (error) {
    console.error("Error fetching provider appointments:", error);
    throw error;
  }

  // Format the data to match the Appointment interface
  return (data || []).map((item) => ({
    ...item,
    patient_name: item.patient?.name,
    service_name: item.service?.name,
  }));
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: "upcoming" | "in-progress" | "completed" | "cancelled",
): Promise<void> => {
  const { error } = await supabase
    .from("appointments")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", appointmentId);

  if (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};

export const rescheduleAppointment = async (
  appointmentId: string,
  newDate: string,
  newStartTime: string,
  newEndTime: string,
): Promise<void> => {
  // First, get the current appointment to restore its time slot
  const { data: currentAppointment, error: fetchError } = await supabase
    .from("appointments")
    .select("provider_id, appointment_date, start_time")
    .eq("id", appointmentId)
    .single();

  if (fetchError) {
    console.error("Error fetching appointment:", fetchError);
    throw fetchError;
  }

  // Start a transaction to update everything
  const { error: updateError } = await supabase.rpc("reschedule_appointment", {
    p_appointment_id: appointmentId,
    p_new_date: newDate,
    p_new_start_time: newStartTime,
    p_new_end_time: newEndTime,
    p_provider_id: currentAppointment.provider_id,
    p_old_date: currentAppointment.appointment_date,
    p_old_start_time: currentAppointment.start_time,
  });

  if (updateError) {
    console.error("Error rescheduling appointment:", updateError);
    throw updateError;
  }
};
