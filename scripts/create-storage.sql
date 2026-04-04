-- Create storage bucket for prayer voice recordings
INSERT INTO storage.buckets (id, name, public) 
VALUES ('prayer-voices', 'prayer-voices', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policy to allow public access to voice files
CREATE POLICY "Anyone can view prayer voices" ON storage.objects
  FOR SELECT USING (bucket_id = 'prayer-voices');

-- Allow authenticated users to upload voice files
CREATE POLICY "Authenticated users can upload prayer voices" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'prayer-voices');

-- Allow users to delete their own voice files
CREATE POLICY "Users can delete their own prayer voices" ON storage.objects
  FOR DELETE USING (bucket_id = 'prayer-voices');
