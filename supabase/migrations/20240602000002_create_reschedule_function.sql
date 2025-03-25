-- Create a function to handle appointment rescheduling in a transaction
CREATE OR REPLACE FUNCTION reschedule_appointment(
  p_appointment_id UUID,
  p_new_date DATE,
  p_new_start_time TIME,
  p_new_end_time TIME,
  p_provider_id UUID,
  p_old_date DATE,
  p_old_start_time TIME
) RETURNS void AS $$
BEGIN
  -- Mark the old time slot as available again
  UPDATE provider_availability
  SET is_available = true
  WHERE provider_id = p_provider_id
    AND date = p_old_date
    AND start_time = p_old_start_time;

  -- Mark the new time slot as unavailable
  UPDATE provider_availability
  SET is_available = false
  WHERE provider_id = p_provider_id
    AND date = p_new_date
    AND start_time = p_new_start_time;

  -- Update the appointment with the new schedule
  UPDATE appointments
  SET appointment_date = p_new_date,
      start_time = p_new_start_time,
      end_time = p_new_end_time,
      updated_at = NOW()
  WHERE id = p_appointment_id;

END;
$$ LANGUAGE plpgsql;