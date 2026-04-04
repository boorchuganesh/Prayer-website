-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  uploaded_by VARCHAR(100) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(20) NOT NULL, -- 'audio' or 'pdf'
  file_size INT,
  duration INT, -- for audio files in seconds
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Create policies for songs
CREATE POLICY "Allow all to read songs" ON songs
  FOR SELECT USING (true);

CREATE POLICY "Allow all to insert songs" ON songs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all to update songs" ON songs
  FOR UPDATE USING (true);

CREATE POLICY "Allow all to delete songs" ON songs
  FOR DELETE USING (true);
