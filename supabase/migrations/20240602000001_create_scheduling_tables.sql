-- Create provider_availability table to store available time slots
CREATE TABLE IF NOT EXISTS provider_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table to store available healthcare services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  estimated_duration INTEGER NOT NULL, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table to store booked appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES users(id),
  provider_id UUID NOT NULL REFERENCES users(id),
  service_id UUID NOT NULL REFERENCES services(id),
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  special_requirements TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'upcoming', -- upcoming, in-progress, completed, cancelled
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed
  amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add realtime support
ALTER PUBLICATION supabase_realtime ADD TABLE provider_availability;
ALTER PUBLICATION supabase_realtime ADD TABLE services;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;

-- Insert sample services
INSERT INTO services (name, description, icon, estimated_duration)
VALUES 
  ('General Health Checkup', 'Basic health assessment including vital signs and general wellness evaluation', 'Stethoscope', 60),
  ('Nursing Care', 'Professional nursing services including wound care, injections, and monitoring', 'Heart', 90),
  ('Physiotherapy Session', 'Therapeutic exercises and physical treatments to improve mobility and function', 'User', 90),
  ('Home Health Monitoring', 'Regular monitoring of vital signs and health parameters for chronic conditions', 'Thermometer', 45),
  ('Elderly Care Assistance', 'Specialized care services for elderly patients including mobility assistance', 'Home', 120);

-- Insert sample provider availability for demo
DO $$
DECLARE
  provider_id UUID;
  current_date DATE := CURRENT_DATE;
  i INTEGER;
BEGIN
  -- Get a sample provider ID (assuming there's at least one provider in the users table)
  SELECT id INTO provider_id FROM users WHERE role = 'provider' LIMIT 1;
  
  -- If no provider exists, use a placeholder ID
  IF provider_id IS NULL THEN
    provider_id := '00000000-0000-0000-0000-000000000000';
  END IF;
  
  -- Insert availability for the next 14 days
  FOR i IN 0..14 LOOP
    -- Skip Sundays (assuming Sunday is day 0 in your week)
    IF EXTRACT(DOW FROM (current_date + i * INTERVAL '1 day')) != 0 THEN
      -- Morning slots
      INSERT INTO provider_availability (provider_id, date, start_time, end_time)
      VALUES 
        (provider_id, current_date + i * INTERVAL '1 day', '09:00:00', '10:00:00'),
        (provider_id, current_date + i * INTERVAL '1 day', '10:00:00', '11:00:00'),
        (provider_id, current_date + i * INTERVAL '1 day', '11:00:00', '12:00:00');
      
      -- Afternoon slots
      INSERT INTO provider_availability (provider_id, date, start_time, end_time)
      VALUES 
        (provider_id, current_date + i * INTERVAL '1 day', '13:00:00', '14:00:00'),
        (provider_id, current_date + i * INTERVAL '1 day', '14:00:00', '15:00:00'),
        (provider_id, current_date + i * INTERVAL '1 day', '15:00:00', '16:00:00'),
        (provider_id, current_date + i * INTERVAL '1 day', '16:00:00', '17:00:00');
    END IF;
  END LOOP;
END $$;