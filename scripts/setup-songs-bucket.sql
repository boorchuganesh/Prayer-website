-- Create the songs storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('songs', 'songs', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policy to allow public reads
CREATE POLICY "Public can read songs"
ON storage.objects FOR SELECT
USING (bucket_id = 'songs');

-- Create RLS policy to allow public uploads
CREATE POLICY "Public can upload songs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'songs');

-- Create RLS policy to allow deletion of own uploads
CREATE POLICY "Anyone can delete songs"
ON storage.objects FOR DELETE
USING (bucket_id = 'songs');
