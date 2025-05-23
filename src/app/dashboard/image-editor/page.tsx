'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ImageEditor from '@/components/image-editor/ImageEditor';
import { Card } from '@/components/ui/card';

// Wrapper component to handle client-side logic for searchParams
function ImageEditorLoader() {
  const searchParams = useSearchParams();
  const [initialImageUrl, setInitialImageUrl] = useState<string | undefined>(undefined);
  const [isLoadingUrl, setIsLoadingUrl] = useState(true);

  useEffect(() => {
    const source = searchParams?.get('source');
    let imageUrlFromStorage: string | null = null;

    if (source === 'autoedit') {
      try {
        imageUrlFromStorage = localStorage.getItem('advancedEditImageUrl');
        if (imageUrlFromStorage) {
          setInitialImageUrl(imageUrlFromStorage);
          // Clean up localStorage item once read
          localStorage.removeItem('advancedEditImageUrl'); 
        }
      } catch (error) {
        console.error("Error accessing localStorage for advancedEditImageUrl:", error);
      }
    }
    // Also check for direct imageUrl param if not coming from autoedit or if localStorage fails
    if (!imageUrlFromStorage) {
        const directUrl = searchParams?.get('imageUrl');
        if (directUrl) {
            setInitialImageUrl(decodeURIComponent(directUrl));
        }
    }
    setIsLoadingUrl(false);
  }, [searchParams]);

  if (isLoadingUrl) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Preparing editor...</p>
        </div>
      </Card>
    );
  }

  return <ImageEditor initialImageUrl={initialImageUrl} />;
}


export default function ImageEditorPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Image Editor</h1>
        <p className="text-muted-foreground">
          Edit your AI-generated images or upload new ones for customization.
        </p>
      </div>
      
      <Suspense fallback={
        <Card className="w-full h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading editor...</p>
          </div>
        </Card>
      }>
        <ImageEditorLoader />
      </Suspense>
    </div>
  );
}
