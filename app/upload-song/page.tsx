import { SongUploadForm } from '@/components/song-upload-form';

export const metadata = {
  title: 'Upload Song - Faithybites',
  description: 'Upload your favorite worship songs or spiritual music to share with our community.',
};

export default function UploadSongPage() {
  return (
    <main className="min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <SongUploadForm />
      </div>
    </main>
  );
}
