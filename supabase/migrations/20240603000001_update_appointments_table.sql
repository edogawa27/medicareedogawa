-- Add new columns to appointments table
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS provider_name TEXT,
ADD COLUMN IF NOT EXISTS provider_email TEXT,
ADD COLUMN IF NOT EXISTS patient_name TEXT,
ADD COLUMN IF NOT EXISTS patient_email TEXT;

-- Skip adding to realtime publication since it's already a member
-- The previous error was: relation "appointments" is already member of publication "supabase_realtime"
