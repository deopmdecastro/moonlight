-- Add optional image link to appointments.
ALTER TABLE "Appointment" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;

