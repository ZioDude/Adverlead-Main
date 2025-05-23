'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Loader2, AlertTriangle, Download, Edit, XCircle } from 'lucide-react';
import { useAutoEdit } from '@/hooks/useAutoEdit';
import { toast } from '@/components/ui/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Import Carousel components

// Define the structure of an Ad Draft, matching the backend
interface AdDraft {
  id: string;
  industry: string | null;
  house_style: string | null;
  generated_images: { view: string; src: string; alt: string }[];
  created_at: string;
}

interface ImageEditingDialogContentProps {
  onClose: () => void;
}

type EditingStep = "selectDraft" | "confirmAndEdit" | "showResult";

export default function ImageEditingDialogContent({ onClose }: ImageEditingDialogContentProps) {
  const router = useRouter();
  const { 
    isEditing, 
    editedImage, 
    error: autoEditError, 
    autoEditImage,
    setEditedImage,
    setError: setAutoEditError 
  } = useAutoEdit();

  const [currentStep, setCurrentStep] = useState<EditingStep>("selectDraft");
  const [drafts, setDrafts] = useState<AdDraft[]>([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
  const [draftsError, setDraftsError] = useState<string | null>(null);
  const [selectedDraft, setSelectedDraft] = useState<AdDraft | null>(null);

  const fetchDrafts = async () => {
    setIsLoadingDrafts(true);
    setDraftsError(null);
    try {
      const response = await fetch('/api/ad-drafts');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch drafts: ${response.statusText}`);
      }
      const data = await response.json();
      setDrafts(data.drafts || []);
    } catch (error) {
      console.error("Error fetching ad drafts:", error);
      setDraftsError(error instanceof Error ? error.message : "An unknown error occurred.");
      setDrafts([]);
    } finally {
      setIsLoadingDrafts(false);
    }
  };

  useEffect(() => {
    if (currentStep === "selectDraft") {
      fetchDrafts();
    }
  }, [currentStep]);

  const handleSelectDraft = (draft: AdDraft) => {
    setSelectedDraft(draft);
  };

  const handleProceedToEditStep = () => {
    if (selectedDraft) {
      setEditedImage(null); // Clear any previous results
      setAutoEditError(null); // Clear any previous errors
      setCurrentStep("confirmAndEdit");
    }
  };

  const handleStartAutomaticEditing = async () => {
    if (selectedDraft && selectedDraft.generated_images && selectedDraft.generated_images.length > 0) {
      const imageUrl = selectedDraft.generated_images[0].src;
      if (imageUrl) {
        try {
          // Call autoEditImage without custom options to use the defaults from CanvasEditor
          await autoEditImage(imageUrl);
          setCurrentStep("showResult");
        } catch (err) {
          // Error is already set by useAutoEdit hook, can show toast here
          toast({
            title: "Editing Failed",
            description: autoEditError || "An unexpected error occurred.",
            variant: "destructive",
          });
        }
      } else {
        toast({ title: "Error", description: "No image URL found in selected draft.", variant: "destructive" });
      }
    } else {
      toast({ title: "Error", description: "No ad draft selected or draft has no images.", variant: "destructive" });
    }
  };
  
  const handleBack = () => {
    if (currentStep === "showResult") {
      setEditedImage(null);
      setAutoEditError(null);
      setCurrentStep("confirmAndEdit");
    } else if (currentStep === "confirmAndEdit") {
      setSelectedDraft(null); // Deselect draft
      setCurrentStep("selectDraft");
    }
  };

  const handleDownload = () => {
    if (editedImage) {
      const link = document.createElement('a');
      link.download = `edited-ad-${Date.now()}.png`;
      link.href = editedImage;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Success", description: "Image download started." });
    }
  };

  const handleAdvancedEdit = () => {
    if (editedImage) {
      // Store in localStorage for the editor page to pick up
      try {
        localStorage.setItem('advancedEditImageUrl', editedImage);
        router.push(`/dashboard/image-editor?source=autoedit`); // Add a source param
        onClose(); // Close the dialog
      } catch (e) {
        console.error("Error storing image for advanced edit:", e);
        toast({ title: "Error", description: "Could not prepare image for advanced editor.", variant: "destructive"});
      }
    }
  };


  // Step 1: Select Draft
  if (currentStep === "selectDraft") {
    return (
      <div className="p-6 flex flex-col gap-6 min-h-[400px] max-h-[80vh]">
        <div>
          <h2 className="text-xl font-semibold text-center mb-2">Select Ad to Edit</h2>
          <p className="text-sm text-muted-foreground text-center">
            Choose one of your previously generated ads to start editing.
          </p>
        </div>
        <div className="flex-grow overflow-y-auto -mr-2 pr-2 space-y-3">
          {isLoadingDrafts && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-muted-foreground">Loading your generations...</p>
            </div>
          )}
          {draftsError && (
            <div className="flex flex-col items-center justify-center h-full text-destructive">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <p className="font-semibold">Error loading drafts</p>
              <p className="text-xs">{draftsError}</p>
            </div>
          )}
          {!isLoadingDrafts && !draftsError && drafts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-muted-foreground">You have no ad generations yet.</p>
              <p className="text-xs text-muted-foreground">Create an ad first to see it here.</p>
            </div>
          )}
          {!isLoadingDrafts && !draftsError && drafts.length > 0 && (
            drafts.map((draft) => (
              <div
                key={draft.id}
                onClick={() => handleSelectDraft(draft)}
                className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md
                  ${selectedDraft?.id === draft.id ? 'border-primary ring-2 ring-primary shadow-lg' : 'border-border hover:border-primary/50'}`}
              >
                <div className="flex items-center gap-4">
                {draft.generated_images && draft.generated_images.length > 0 && draft.generated_images[0].src && typeof draft.generated_images[0].src === 'string' && draft.generated_images[0].src.trim() !== '' && (
                  <div className="w-16 h-16 relative rounded overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={draft.generated_images[0].src}
                      alt={draft.generated_images[0].alt || 'Ad preview'}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div className="flex-grow overflow-hidden">
                    <h3 className="font-semibold truncate text-sm">
                      {draft.industry} {draft.house_style ? `- ${draft.house_style}` : ''}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(draft.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {draft.generated_images.length} image(s)
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-auto pt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleProceedToEditStep} disabled={!selectedDraft || isLoadingDrafts}>Next</Button>
        </div>
      </div>
    );
  }

  // Step 2: Confirm Image and Start Editing
  if (currentStep === "confirmAndEdit" && selectedDraft) {
    const originalImageSrc = selectedDraft.generated_images?.[0]?.src;
    const isValidOriginalSrc = originalImageSrc && typeof originalImageSrc === 'string' && originalImageSrc.trim() !== '';
    
    return (
      <div className="p-6 flex flex-col gap-4 min-h-[400px] max-h-[80vh] items-center">
        <h2 className="text-xl font-semibold text-center mb-1">Confirm Image Edit</h2>
        
        {isEditing ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Applying edits, please wait...</p>
          </div>
        ) : autoEditError ? (
          <div className="flex flex-col items-center justify-center h-64 text-destructive bg-destructive/10 p-6 rounded-lg">
            <AlertTriangle className="h-12 w-12 mb-4" />
            <p className="font-semibold text-lg">Editing Failed</p>
            <p className="text-sm text-center">{autoEditError}</p>
            <Button variant="outline" onClick={handleBack} className="mt-6">Try Again</Button>
          </div>
        ) : (
          <>
            {isValidOriginalSrc ? (
              <div className="w-full max-w-sm aspect-square relative rounded-lg overflow-hidden bg-muted border">
                <Image src={originalImageSrc} alt="Selected image to edit" fill className="object-contain" sizes="400px" />
              </div>
            ) : (
              <div className="w-full max-w-sm aspect-square flex items-center justify-center bg-muted rounded-lg border border-dashed">
                <p className="text-muted-foreground text-center p-4">
                  No valid image available in the selected draft.
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center mt-1 max-w-md">
              A default set of professional enhancements (dark overlay, title, subtitle, logo) will be applied to this image.
            </p>
            <div className="mt-auto pt-4 w-full flex justify-between gap-2">
              <Button variant="outline" onClick={handleBack} disabled={isEditing}>Back</Button>
              <Button onClick={handleStartAutomaticEditing} disabled={!isValidOriginalSrc || isEditing}>
                {isEditing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit className="mr-2 h-4 w-4" />}
                Start Auto-Editing
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Step 3: Show Result
  if (currentStep === "showResult") {
    const carouselImages = [];
    if (editedImage) {
      carouselImages.push({ src: editedImage, alt: "Edited Version", id: "edited-image" });
    }
    if (selectedDraft && selectedDraft.generated_images) {
      selectedDraft.generated_images.slice(1).forEach((img, index) => { // Start from 2nd image
        if (img.src) {
          carouselImages.push({ src: img.src, alt: img.alt || `Original Image ${index + 2}`, id: `original-${index + 1}` });
        }
      });
    }

    return (
      <div className="p-6 flex flex-col gap-4 min-h-[500px] max-h-[90vh] items-center"> {/* Increased min-h for carousel */}
        <h2 className="text-xl font-semibold text-center mb-1">
          {editedImage ? "Image Edited Successfully!" : "Review Images"}
        </h2>
        
        {carouselImages.length > 0 ? (
          <Carousel className="w-full max-w-md"> {/* Adjusted max-width */}
            <CarouselContent>
              {carouselImages.map((image) => (
                <CarouselItem key={image.id}>
                  <div className="p-1">
                    <div className="aspect-square relative bg-muted rounded-lg overflow-hidden border">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-1">{image.alt}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {carouselImages.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2" />
              </>
            )}
          </Carousel>
        ) : (
          <div className="w-full max-w-sm aspect-square flex items-center justify-center bg-muted rounded-lg border border-dashed">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-muted-foreground text-center p-4">
              No images to display.
            </p>
          </div>
        )}

         <p className="text-xs text-muted-foreground text-center mt-2 max-w-md">
          You can download the edited version or proceed to the advanced editor for more detailed adjustments.
        </p>
        <div className="mt-auto pt-4 w-full space-y-2">
          <Button onClick={handleDownload} disabled={!editedImage} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download Edited Image
          </Button>
          <Button onClick={handleAdvancedEdit} disabled={!editedImage} variant="outline" className="w-full">
            <Edit className="mr-2 h-4 w-4" /> Advanced Edit (Edited Image)
          </Button>
           <Button variant="ghost" onClick={handleBack} className="w-full text-muted-foreground">
            Back to Edit Selection
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
             <XCircle className="mr-2 h-4 w-4" /> Close
          </Button>
        </div>
      </div>
    );
  }

  return null; 
}
