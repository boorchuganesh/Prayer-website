-- Create songs storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('songs', 'songs', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public access to read songs
CREATE POLICY "Public can read songs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'songs');

-- Create policy to allow public to upload songs
CREATE POLICY "Anyone can upload songs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'songs');

-- Create policy to allow anyone to delete songs
CREATE POLICY "Anyone can delete songs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'songs');
