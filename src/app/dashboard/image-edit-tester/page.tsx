'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input'; // Removed unused import
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertTriangle, ImagePlus, UploadCloud } from 'lucide-react';
import Image from 'next/image';

export default function ImageEditTesterPage() {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImagePreviewUrl, setOriginalImagePreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOriginalImageFile(file);
      setOriginalImagePreviewUrl(URL.createObjectURL(file));
      setEditedImageUrl(null); // Clear previous edit result
      setError(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!originalImageFile || !prompt.trim()) {
      setError('Please select an image and enter a prompt.');
      return;
    }

    setError(null);
    setEditedImageUrl(null);
    setIsLoadingUpload(true);
    let tempImageUrl = '';

    // Step 1: Upload the original image to get a temporary URL
    try {
      const formData = new FormData();
      formData.append('image', originalImageFile);

      const uploadResponse = await fetch('/api/upload-image-for-edit', {
        method: 'POST',
        body: formData,
      });

      setIsLoadingUpload(false);
      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || 'Failed to upload image.');
      }
      tempImageUrl = uploadResult.imageUrl;
      console.log('Temporary image URL:', tempImageUrl);

    } catch (uploadError) {
      setIsLoadingUpload(false);
      console.error('Upload error:', uploadError);
      setError(uploadError instanceof Error ? uploadError.message : 'An unknown error occurred during upload.');
      return;
    }

    // Step 2: Call the edit API with the temporary URL and prompt
    setIsLoadingEdit(true);
    try {
      const editResponse = await fetch('/api/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: tempImageUrl, prompt }),
      });
      
      setIsLoadingEdit(false);
      const editResult = await editResponse.json();

      if (!editResponse.ok) {
        throw new Error(editResult.error || editResult.details || 'Failed to edit image.');
      }
      setEditedImageUrl(editResult.editedImageUrl);

    } catch (editError) {
      setIsLoadingEdit(false);
      console.error('Edit error:', editError);
      setError(editError instanceof Error ? editError.message : 'An unknown error occurred during editing.');
    }
  };

  const isLoading = isLoadingUpload || isLoadingEdit;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">OpenAI Image Edit Tester</h1>
        <p className="text-muted-foreground mt-2">
          Upload an image, provide a prompt, and see the AI-edited result.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-sm border">
        <div>
          <label htmlFor="imageUpload" className="block text-sm font-medium mb-1">
            Upload Image (PNG, JPG, WebP - max 10MB)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-primary transition-colors">
            <div className="space-y-1 text-center">
              <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="flex text-sm text-muted-foreground">
                <label
                  htmlFor="imageUploadInput"
                  className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                >
                  <span>Upload a file</span>
                  <input id="imageUploadInput" name="image" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-muted-foreground">{originalImageFile ? originalImageFile.name : 'No file chosen'}</p>
            </div>
          </div>
        </div>

        {originalImagePreviewUrl && (
          <div>
            <h3 className="text-lg font-medium mb-2">Original Image Preview:</h3>
            <div className="aspect-square w-full max-w-md mx-auto relative bg-muted rounded overflow-hidden border">
              <Image src={originalImagePreviewUrl} alt="Original preview" fill style={{ objectFit: 'contain' }} sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-1">
            Editing Prompt
          </label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Make this image look like a watercolor painting."
            rows={3}
            className="max-h-40"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || !originalImageFile || !prompt.trim()}>
          {isLoadingUpload && <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>}
          {isLoadingEdit && <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Edit...</>}
          {!isLoading && <><UploadCloud className="mr-2 h-4 w-4" /> Generate Edited Image</>}
        </Button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-md border border-destructive/30">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="font-medium">Error:</span>
          </div>
          <p className="text-sm ml-7">{error}</p>
        </div>
      )}

      {editedImageUrl && !isLoading && !error && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-center">Edited Image:</h3>
          <div className="aspect-square w-full max-w-md mx-auto relative bg-muted rounded-lg overflow-hidden border shadow-lg">
            <Image src={editedImageUrl} alt="Edited result" fill style={{ objectFit: 'contain' }} sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>
      )}
    </div>
  );
}
