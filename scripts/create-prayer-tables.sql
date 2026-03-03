-- Create prayers table
CREATE TABLE IF NOT EXISTS prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_name VARCHAR(255) NOT NULL,
  area_village VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  prayer_reason TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, prayed, completed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  prayed_by UUID,
  prayed_at TIMESTAMP
);

-- Create prayer_prayers table for tracking who prayed
CREATE TABLE IF NOT EXISTS prayer_prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_id UUID NOT NULL REFERENCES prayers(id) ON DELETE CASCADE,
  prayed_by_name VARCHAR(255) NOT NULL,
  prayed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_prayers_status ON prayers(status);
CREATE INDEX IF NOT EXISTS idx_prayers_created_at ON prayers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prayer_prayers_prayer_id ON prayer_prayers(prayer_id);

-- Add RLS policies
ALTER TABLE prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_prayers ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (public access for this platform)
CREATE POLICY "Allow all reads on prayers" ON prayers FOR SELECT USING (true);
CREATE POLICY "Allow all inserts on prayers" ON prayers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on prayers" ON prayers FOR UPDATE USING (true);

CREATE POLICY "Allow all reads on prayer_prayers" ON prayer_prayers FOR SELECT USING (true);
CREATE POLICY "Allow all inserts on prayer_prayers" ON prayer_prayers FOR INSERT WITH CHECK (true);
