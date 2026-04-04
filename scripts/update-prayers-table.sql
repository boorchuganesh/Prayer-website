-- Update prayers table to remove area_village and add voice_url
ALTER TABLE prayers
DROP COLUMN IF EXISTS area_village,
ADD COLUMN IF NOT EXISTS voice_url TEXT,
ADD COLUMN IF NOT EXISTS voice_duration NUMERIC,
ADD COLUMN IF NOT EXISTS prayer_text TEXT;

-- Create an index for easier querying
CREATE INDEX IF NOT EXISTS idx_prayers_voice_url ON prayers(voice_url) WHERE voice_url IS NOT NULL;

-- Add delete policy
CREATE POLICY "Allow all deletes on prayers" ON prayers FOR DELETE USING (true);
