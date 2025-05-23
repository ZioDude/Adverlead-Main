'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DownloadIcon, Edit3Icon, ArrowLeftIcon } from 'lucide-react';

export default function EditSuccessPage() {
  const router = useRouter();
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedDataUrl = localStorage.getItem('processedAdImageDataUrl');
      if (storedDataUrl) {
        setImageDataUrl(storedDataUrl);
        // Optional: Remove item after retrieving to prevent reuse if not desired
        // localStorage.removeItem('processedAdImageDataUrl'); 
      } else {
        setError('No processed image data found. Please try the editing process again.');
      }
    } catch (e) {
      console.error("Error accessing localStorage:", e);
      setError('Could not retrieve processed image. Your browser might be blocking local storage access.');
    }
  }, []);

  const handleDownload = () => {
    if (imageDataUrl) {
      const link = document.createElement('a');
      link.href = imageDataUrl;
      link.download = `adverlead-edited-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFurtherEdit = () => {
    // To enable further editing, we'd need to pass the image data back to the editor.
    // If the imageDataUrl is a Supabase URL (after re-upload), we can pass it as a query param.
    // If it's a Data URL, it's too long for a query param.
    // For now, this button could navigate to the editor, and the user would re-upload or use a saved URL.
    // A more advanced flow would involve re-uploading the Data URL to get a shareable link.
    if (imageDataUrl && !imageDataUrl.startsWith('data:')) { // Assuming it's a public URL
        router.push(`/dashboard/image-editor?imageUrl=${encodeURIComponent(imageDataUrl)}`);
    } else {
        // If it's a data URL, direct navigation for further editing is complex without re-upload.
        // For now, just navigate to the editor. User can upload the downloaded image.
        router.push('/dashboard/image-editor');
        // Consider prompting user to download and re-upload for further edits if it's a data URL.
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={() => router.push('/dashboard/generate-ads')} className="mt-6">
              <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Ad Generation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!imageDataUrl) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading processed image...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Edited Image</CardTitle>
          <CardDescription>
            The default edits have been applied. You can download your image or go back to edit further.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-lg overflow-hidden">
            <img src={imageDataUrl} alt="Processed Ad Image" className="w-full h-auto object-contain" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleDownload} className="w-full sm:w-auto">
              <DownloadIcon className="mr-2 h-4 w-4" /> Download Image
            </Button>
            <Button onClick={handleFurtherEdit} variant="outline" className="w-full sm:w-auto">
              <Edit3Icon className="mr-2 h-4 w-4" /> Edit Further
            </Button>
            <Button onClick={() => router.push('/dashboard/generate-ads')} variant="ghost" className="w-full sm:w-auto">
               <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Ad Generation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
