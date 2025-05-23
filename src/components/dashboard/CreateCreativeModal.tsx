'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label }
from '@/components/ui/label';
import { Loader2, Sparkles, Home, Building } from 'lucide-react'; // Added Building for Industrial
// Assuming Carousel components are from shadcn/ui
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { v4 as uuidv4 } from 'uuid'; // For unique filenames
import { dataURLtoFile } from '@/lib/utils'; // Import the utility
import { useToast } from "@/components/ui/use-toast" // For showing success/error messages

import { useAutoEdit } from '@/hooks/useAutoEdit';

interface CreateCreativeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GeneratedImage {
  src: string;
  view: string;
  alt: string;
}

export function CreateCreativeModal({ isOpen, onClose }: CreateCreativeModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(null);
  const [websiteText, setWebsiteText] = useState<string>('');
  const [editedBrandedImage, setEditedBrandedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Combined error state
  const { toast } = useToast();

  const { autoEditImage, isEditing: isAutoEditing, error: autoEditErrorHook, setError: setErrorFromHook } = useAutoEdit();

  const renovationStyles = [
    { id: 'modern-house', label: 'Modern House', icon: <Home className="mr-2 h-5 w-5" />, promptLabel: "Modern House" },
    { id: 'industrial-house', label: 'Industrial House', icon: <Building className="mr-2 h-5 w-5" />, promptLabel: "Industrial House" },
    // Add more styles here if needed
  ];

  useEffect(() => {
    // Reset state when modal is closed/reopened
    if (isOpen) {
      setCurrentStep(1);
      setSelectedService(null);
      setSelectedStyle(null);
      setGeneratedImages([]);
      setUploadedLogoUrl(null);
      setWebsiteText('');
      setEditedBrandedImage(null);
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen]);

  const handleNextStep = () => setCurrentStep(prev => prev + 1);
  // const handlePreviousStep = () => setCurrentStep(prev => prev - 1);

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    if (service === 'renovation') {
      handleNextStep();
    }
    // Handle "other" or different services later
  };

  const handleStyleSelect = async (stylePromptLabel: string) => {
    setSelectedStyle(stylePromptLabel);
    setCurrentStep(3); // Move to loading step for image generation
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]); // Clear previous images

    try {
      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ houseStyleLabel: stylePromptLabel }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to generate images (status: ${response.status})`);
      }

      const data = await response.json();
      if (data.images && data.images.length > 0) {
        setGeneratedImages(data.images);
        setCurrentStep(4); // Move to branding step
      } else {
        throw new Error('No images were returned from the generation service.');
      }
    } catch (err: unknown) {
      console.error('Error generating images:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during image generation.');
      }
      // Optionally, move back to style selection or show error in modal
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true); // Indicate loading state for upload
    setError(null); // Clear general error
    setErrorFromHook(null); // Clear hook-specific error
    setUploadedLogoUrl(null); // Clear previous logo URL

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
        // Note: 'Content-Type' header is automatically set by the browser for FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to upload logo (status: ${response.status})`);
      }

      const data = await response.json();
      if (data.imageUrl) {
        setUploadedLogoUrl(data.imageUrl);
        console.log("Logo uploaded successfully:", data.imageUrl);
      } else {
        throw new Error('No image URL returned from logo upload service.');
      }
    } catch (err: unknown) {
      console.error('Error uploading logo:', err);
      if (err instanceof Error) {
        setError(`Logo upload failed: ${err.message}`);
      } else {
        setError('An unknown error occurred during logo upload.');
      }
      setUploadedLogoUrl(null); // Ensure logo URL is cleared on error
    } finally {
      setIsLoading(false); // Clear loading state
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Service Choice
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">More services coming soon!</p>
            <Button
              onClick={() => handleServiceSelect('renovation')}
              className="w-full justify-start text-left"
              variant="outline"
              size="lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Renovation
            </Button>
            <Button
              className="w-full justify-start text-left"
              variant="outline"
              size="lg"
              disabled
            >
              Other (Coming Soon)
            </Button>
          </div>
        );
      case 2: // Style Choice (Renovation)
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Choose a renovation style:</p>
            {renovationStyles.map(style => (
              <Button
                key={style.id}
                onClick={() => handleStyleSelect(style.promptLabel)}
                className="w-full justify-start text-left"
                variant="outline"
              >
                {style.icon}
                {style.label}
              </Button>
            ))}
          </div>
        );
      case 3: // Loading for Image Generation
        return (
          <div className="flex flex-col items-center justify-center space-y-4 h-40">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating your creative images...</p>
            <p className="text-xs text-muted-foreground">(This may take a moment)</p>
          </div>
        );
      case 4: // Add Branding
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="logo-upload" className="mb-2 block font-medium">Upload Your Logo</Label>
              <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} />
              {uploadedLogoUrl && <Image src={uploadedLogoUrl} alt="Uploaded logo preview" width={64} height={64} className="mt-2 h-16 w-auto border rounded object-contain" />}
            </div>
            <div>
              <Label htmlFor="website-url" className="mb-2 block font-medium">Your Website URL</Label>
              <Input 
                id="website-url" 
                type="text" 
                placeholder="e.g., www.example.com" 
                value={websiteText}
                onChange={(e) => setWebsiteText(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              The first generated image will be automatically branded with your logo, website, and default text.
            </p>
          </div>
        );
      case 5: // Display Carousel & Save
        return (
          <div>
            <p className="text-center text-lg font-semibold mb-4">Your Creative is Ready!</p>
            {/* Placeholder for Carousel - Will be implemented with actual shadcn/ui Carousel later */}
            <div className="h-64 bg-muted rounded-md flex items-center justify-center mb-4 overflow-auto p-2">
              {generatedImages.length > 0 ? (
                <div className="flex space-x-2">
                  {editedBrandedImage && (
                    <Image src={editedBrandedImage} alt="Branded Creative" width={224} height={224} className="h-56 w-auto object-contain rounded-md border" />
                  )}
                  {generatedImages.map((img, index) => (
                    (editedBrandedImage && index === 0) ? null : // Skip first original if branded one is shown
                    <Image key={img.src + index} src={img.src} alt={img.alt} width={224} height={224} className="h-56 w-auto object-contain rounded-md border" />
                  ))}
                </div>
              ) : (
                <p>No images generated yet.</p>
              )}
            </div>
            {/* <Carousel className="w-full max-w-md mx-auto">
              <CarouselContent>
                {editedBrandedImage && (
                  <CarouselItem className="flex justify-center">
                    <img src={editedBrandedImage} alt="Branded Creative" className="max-h-80 w-auto object-contain rounded-md" />
                  </CarouselItem>
                )}
                {generatedImages.map((img, index) => (
                  // If showing branded image, and it's the first original, skip it if you only want to show originals after the branded one.
                  // Or, always show all originals if that's preferred.
                  // This logic assumes the first image in generatedImages is the one that gets branded.
                  (editedBrandedImage && index === 0) ? null : 
                  <CarouselItem key={img.src + index} className="flex justify-center">
                    <img src={img.src} alt={img.alt} className="max-h-80 w-auto object-contain rounded-md" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              { (editedBrandedImage ? generatedImages.length : generatedImages.length > 1) && // Show prev/next if more than one item in effective carousel
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              }
            </Carousel> */}
            {error && <p className="text-sm text-red-500 mt-2 text-center">{error}</p>}
          </div>
        );
      default:
        return <p>Unknown step</p>;
    }
  };

  const getDialogTitle = () => {
    switch (currentStep) {
      case 1: return "Choose Service";
      case 2: return "Choose Style";
      case 3: return "Generating Images";
      case 4: return "Add Your Branding";
      case 5: return "Creative Ready";
      default: return "Generate Creative";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="py-6 min-h-[200px]"> {/* Added min-height for content area */}
          {renderStepContent()}
        </div>

        <DialogFooter className="mt-4 flex flex-row justify-end space-x-2"> {/* Ensure footer items are in a row and spaced */}
          {currentStep > 1 && currentStep < 3 && ( // Show Back button for step 2
             <Button variant="outline" onClick={() => setCurrentStep(prev => prev -1)}>Back</Button>
          )}
          {currentStep === 4 && ( // Branding step
            <Button 
              onClick={async () => {
                if (!generatedImages[0]?.src || !uploadedLogoUrl || !websiteText) {
                  setError("Missing generated image, logo, or website text for branding.");
                  return;
                }
                setIsLoading(true);
                setError(null);
                setErrorFromHook(null);
                try {
                  const brandedDataUrl = await autoEditImage(generatedImages[0].src, {
                    logoUrl: uploadedLogoUrl,
                    websiteText: websiteText,
                    // Title, subtitle, overlay opacity will use defaults from CanvasEditor
                  });
                  if (brandedDataUrl) {
                    setEditedBrandedImage(brandedDataUrl); // Store the data URL
                    setCurrentStep(5);
                  } else {
                    throw new Error(autoEditErrorHook || "Auto-editing failed to return an image.");
                  }
                } catch (editErr) {
                  console.error("Error during auto-edit:", editErr);
                  setError(editErr instanceof Error ? `Branding failed: ${editErr.message}` : "Branding failed due to an unknown error.");
                } finally {
                  setIsLoading(false);
                }
              }} 
              disabled={isLoading || isAutoEditing || !uploadedLogoUrl || !websiteText || generatedImages.length === 0}
            >
              {(isLoading || isAutoEditing) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Apply Branding & View
            </Button>
          )}
          {currentStep === 5 && ( // Final step
            <>
              <Button variant="outline" onClick={() => setCurrentStep(4)} disabled={isLoading || isAutoEditing}>Back to Branding</Button>
              <Button 
                onClick={async () => {
                  if (!editedBrandedImage || !selectedService || !selectedStyle || generatedImages.length === 0) {
                    setError("Cannot save creative, essential data is missing.");
                    toast({ title: "Error", description: "Cannot save creative, essential data is missing.", variant: "destructive" });
                    return;
                  }
                  setIsLoading(true);
                  setError(null);
                  try {
                    // 1. Convert data URL to File
                    const brandedImageFile = await dataURLtoFile(editedBrandedImage, `branded-${uuidv4()}.png`);
                    
                    // 2. Upload branded image file to get a persistent URL
                    const formData = new FormData();
                    formData.append('file', brandedImageFile);
                    
                    const uploadResponse = await fetch('/api/upload-logo', { // Re-using upload-logo for simplicity
                      method: 'POST',
                      body: formData,
                    });

                    if (!uploadResponse.ok) {
                      const uploadErrorData = await uploadResponse.json();
                      throw new Error(uploadErrorData.error || "Failed to upload branded image.");
                    }
                    const uploadData = await uploadResponse.json();
                    const persistentBrandedImageUrl = uploadData.imageUrl;

                    if (!persistentBrandedImageUrl) {
                        throw new Error("Failed to get a persistent URL for the branded image.");
                    }

                    // 3. Prepare payload for /api/creatives
                    const creativePayload = {
                      service_type: selectedService,
                      style_label: selectedStyle,
                      edited_image_url: persistentBrandedImageUrl,
                      original_image_urls: generatedImages.map(img => img.src),
                      logo_image_url: uploadedLogoUrl,
                      website_text: websiteText,
                      // TODO: Get these actual default values from canvasEditor.ts or pass them through options
                      title_text_used: "Personalized Renovations\nFor Your Unique\nLifestyle", 
                      subtitle_text_used: "Where quality meets innovation\nin home renovation",
                      overlay_opacity_used: 0.9, 
                    };

                    // 4. Call POST /api/creatives
                    const saveResponse = await fetch('/api/creatives', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(creativePayload),
                    });

                    if (!saveResponse.ok) {
                      const saveErrorData = await saveResponse.json();
                      throw new Error(saveErrorData.error || "Failed to save creative details.");
                    }
                    
                    toast({ title: "Success!", description: "Creative saved successfully." });
                    onClose(); // Close modal on success
                    // TODO: Optionally trigger a refresh of the creatives list on the main page

                  } catch (saveErr) {
                    console.error("Error saving creative:", saveErr);
                    const errorMessage = saveErr instanceof Error ? saveErr.message : "An unknown error occurred while saving.";
                    setError(errorMessage);
                    toast({ title: "Save Failed", description: errorMessage, variant: "destructive" });
                  } finally {
                    setIsLoading(false);
                  }
                }} 
                disabled={isLoading || isAutoEditing}
              >
                {(isLoading || isAutoEditing) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Creative
              </Button>
            </>
          )}
          {currentStep < 3 && currentStep !== 1 && ( // Hide Next for step 1 (handled by service buttons) and step 3+
            <Button onClick={handleNextStep} disabled={isLoading || (currentStep === 2 && !selectedStyle)}>
              Next
            </Button>
          )}
           <DialogClose asChild>
            {(currentStep === 1 || currentStep === 5) && <Button variant="ghost" onClick={onClose}>Cancel</Button>}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
