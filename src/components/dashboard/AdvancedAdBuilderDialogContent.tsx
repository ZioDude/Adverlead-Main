'use client';

import { Button } from "@/components/ui/button";
import { Bot, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image"; // For displaying images

// Typing Text Component (ensure key prop is handled for re-triggering)
interface TypingTextProps {
  text: string;
  startDelay?: number;
  typingSpeed?: number;
  onFinished?: () => void;
  className?: string;
  textKey?: string | number; // Changed from key to textKey
}

const TypingText: React.FC<TypingTextProps> = ({ 
  text, 
  startDelay = 0, 
  typingSpeed = 50, 
  onFinished,
  className,
  textKey // Changed from key to textKey
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setDisplayedText(""); 
    setIsTyping(false);
    const startTimer = setTimeout(() => {
      setIsTyping(true);
    }, startDelay);
    return () => clearTimeout(startTimer);
  }, [startDelay, text, textKey]); // Changed from key to textKey

  useEffect(() => {
    if (!isTyping || !text) return;
    if (displayedText.length < text.length) {
      const typingTimer = setTimeout(() => {
        setDisplayedText(text.substring(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(typingTimer);
    } else {
      if (onFinished) onFinished();
    }
  }, [displayedText, text, typingSpeed, isTyping, onFinished]);

  return <p className={cn("min-h-[1.5em] flex items-center justify-center", className)}>{displayedText}{displayedText.length === text.length ? "" : <span className="animate-pulse ml-1">|</span>}</p>;
};

const industries = [
  { id: "renovation", label: "Renovation" },
  { id: "pest_control", label: "Pest Control" },
  { id: "cleaning_services", label: "Cleaning Services" },
];

const houseStyles = [
  { id: "modern", label: "Modern House" },
  { id: "colonial", label: "Colonial House" },
  { id: "industrial", label: "Industrial House" },
  { id: "mediterranean", label: "Mediterranean House" },
];

const imageViews = ["Front View", "Kitchen", "Living Room", "Bathroom", "Bedroom"];

interface GeneratedImage {
  view: string;
  src: string;
  alt: string;
}

// Updated to call the backend API route
async function fetchGeneratedImages(houseStyleLabel: string): Promise<GeneratedImage[]> {
  console.log(`[Frontend] Calling API to generate images for: ${houseStyleLabel}`);
  try {
    const response = await fetch('/api/generate-images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ houseStyleLabel }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("[Frontend] Received images from API:", data.images);
    return data.images || []; // Ensure it returns an array
  } catch (error) {
    console.error("[Frontend] Error fetching generated images:", error);
    // Optionally, re-throw or return a specific error structure to be handled by the UI
    // For now, returning an empty array or could throw to be caught by handleNext
    throw error; // Re-throw to be caught by handleNext
  }
}

const step1Line1Text = "Hello! I'm your Adverlead Assistant. Let's get started.";
const step1Line2Text = "What is your industry?";

const step2Line1Text = "Great choice! For your renovation project...";
const step2Line2Text = "Which house style are you focusing on?";

const step3Line1TextInitial = (style: string) => `Alright! I'm now generating some visuals for your ${style}...`;
const step3Line2TextComplete = "Here are the generated images:";

interface AdvancedAdBuilderDialogContentProps {
  onClose?: () => void; 
}

export default function AdvancedAdBuilderDialogContent({ onClose }: AdvancedAdBuilderDialogContentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedHouseStyle, setSelectedHouseStyle] = useState<string | null>(null);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generationError, setGenerationError] = useState<string | null>(null); // For displaying errors
  // Track loading state of each image
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const [showBotStep, setShowBotStep] = useState(false);
  const [startTypingPrimary, setStartTypingPrimary] = useState(false);
  const [startTypingSecondary, setStartTypingSecondary] = useState(false);
  const [showChoiceButtons, setShowChoiceButtons] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);

  const totalSteps = useMemo(() => {
    return selectedIndustry === "renovation" ? 3 : 1;
  }, [selectedIndustry]);

  const houseStyleLabel = useMemo(() => 
    houseStyles.find(style => style.id === selectedHouseStyle)?.label || "selected style"
  , [selectedHouseStyle]);

  let primaryText = "";
  let secondaryText = "";
  let currentChoices: typeof industries | typeof houseStyles = [];
  let currentSelection: string | null = null;
  let setSelection: React.Dispatch<React.SetStateAction<string | null>> = () => {};

  if (currentStep === 1) {
    primaryText = step1Line1Text;
    secondaryText = step1Line2Text;
    currentChoices = industries;
    currentSelection = selectedIndustry;
    setSelection = setSelectedIndustry;
  } else if (currentStep === 2 && selectedIndustry === "renovation") {
    primaryText = step2Line1Text;
    secondaryText = step2Line2Text;
    currentChoices = houseStyles;
    currentSelection = selectedHouseStyle;
    setSelection = setSelectedHouseStyle;
  } else if (currentStep === 3 && selectedIndustry === "renovation") {
    primaryText = generationError ? "Oops! Something went wrong." : step3Line1TextInitial(houseStyleLabel);
    secondaryText = isGeneratingImages ? "" : (generationError ? generationError : step3Line2TextComplete);
  }

  // Animation Orchestration
  useEffect(() => {
    setShowBotStep(false);
    setStartTypingPrimary(false);
    setStartTypingSecondary(false);
    setShowChoiceButtons(false);
    setShowCarousel(false); // Reset carousel visibility
    if(currentStep !== 3) setGenerationError(null); // Clear error if not on step 3

    const timerBot = setTimeout(() => setShowBotStep(true), 100);
    const timerPrimary = setTimeout(() => setStartTypingPrimary(true), 600);

    return () => {
      clearTimeout(timerBot);
      clearTimeout(timerPrimary);
    };
  }, [currentStep]);

  const handlePrimaryTextFinished = () => {
    if (currentStep === 3 && isGeneratingImages) return; 
    if (currentStep === 3 && generationError) return; // Don't type secondary if error shown in primary
    setTimeout(() => setStartTypingSecondary(true), 200);
  };

  const handleSecondaryTextFinished = () => {
    if (currentStep === 1 || currentStep === 2) {
      setTimeout(() => setShowChoiceButtons(true), 300);
    } else if (currentStep === 3 && !isGeneratingImages && generatedImages.length > 0 && !generationError) {
      setTimeout(() => setShowCarousel(true), 300);
    }
  };
  
  const handleNext = async () => {
    setGenerationError(null); // Clear previous errors
    if (currentStep === 1) {
      if (selectedIndustry === "renovation") {
        setCurrentStep(2);
        setSelectedHouseStyle(null);
        setGeneratedImages([]); 
      } else {
        if (onClose) onClose();
      }
    } else if (currentStep === 2 && selectedIndustry === "renovation") {
      if (selectedHouseStyle) {
        setIsGeneratingImages(true);
        setShowChoiceButtons(false); 
        setStartTypingPrimary(true); 
        setStartTypingSecondary(false);
        setCurrentStep(3);
        try {
          const images = await fetchGeneratedImages(houseStyleLabel);
          setGeneratedImages(images);
        } catch (error) {
          console.error("Caught error in handleNext:", error);
          setGenerationError(error instanceof Error ? error.message : "Failed to generate images.");
          setGeneratedImages([]); // Clear any potentially partial image set
        } finally {
          setIsGeneratingImages(false);
        }
      }
    } else if (currentStep === 3 || currentStep === totalSteps) { // Modified condition to ensure it covers "Finish"
      // Save the draft before closing
      if (selectedIndustry && generatedImages.length > 0) {
        const draftPayload = {
          industry: selectedIndustry,
          house_style: selectedHouseStyle, // This can be null if not applicable
          generated_images: generatedImages,
        };
        try {
          console.log("[Frontend] Attempting to save ad draft:", draftPayload);
          const response = await fetch('/api/ad-drafts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(draftPayload),
          });
          if (!response.ok) {
            const errorData = await response.json();
            console.error("[Frontend] Failed to save draft:", errorData.error || response.statusText);
            // Optionally, show an error message to the user here
            setGenerationError(`Failed to save draft: ${errorData.error || response.statusText}`);
          } else {
            const result = await response.json();
            console.log("[Frontend] Draft saved successfully:", result);
            // Optionally, show a success message or clear form
          }
        } catch (error) {
          console.error("[Frontend] Error saving draft:", error);
          setGenerationError(error instanceof Error ? `Error saving draft: ${error.message}` : "An unknown error occurred while saving the draft.");
          // Optionally, show an error message to the user here
        }
      }
      if (onClose) onClose(); // Close the dialog regardless of save success for now
    }
  };

  const handlePrev = () => {
    setGenerationError(null); // Clear errors when navigating
    if (currentStep === 3) {
      setGeneratedImages([]); 
      setIsGeneratingImages(false);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };
  
  const isNextDisabled = 
    (currentStep === 1 && !selectedIndustry) ||
    (currentStep === 2 && selectedIndustry === "renovation" && !selectedHouseStyle) ||
    (currentStep === 3 && isGeneratingImages);

  // Helper function to mark an image as loaded
  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [src]: true
    }));
  };

  // Helper function to handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, view: string) => {
    console.log("Image failed to load, using placeholder:", view);
    const imgElement = e.currentTarget;
    const seed = Math.abs(view.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    imgElement.src = `https://picsum.photos/seed/${seed}/1024/1024`;
    // Also mark as loaded after setting the placeholder
    setTimeout(() => handleImageLoad(imgElement.src), 500);
  };

  return (
    <div className="max-w-xl mx-auto p-2 sm:p-4 md:p-6 min-h-[400px]">
      <div className="mb-6 text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      <div className="rounded-lg bg-card text-card-foreground">
        <div className="flex flex-col items-center space-y-6 text-center">
          <Bot 
            className={cn(
              "h-16 w-16 text-primary transition-opacity duration-500 ease-in-out",
              showBotStep ? "opacity-100" : "opacity-0",
              generationError && currentStep === 3 ? "text-destructive" : "text-primary" // Change bot color on error
            )}
          />
          <div className="flex flex-col items-center space-y-1 min-h-[4em]">
            {startTypingPrimary && (
              <TypingText 
                textKey={`primary-${currentStep}-${primaryText}`} 
                text={primaryText} 
                typingSpeed={40}
                className={cn("text-lg font-medium text-center", generationError && currentStep === 3 ? "text-destructive" : "")}
                onFinished={handlePrimaryTextFinished}
              />
            )}
            {/* Show loader or secondary text for Step 3 */}
            {currentStep === 3 && isGeneratingImages && showBotStep && !generationError && (
              <div className="flex items-center space-x-2 text-muted-foreground mt-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating images... please wait.</span>
              </div>
            )}
            {startTypingSecondary && !isGeneratingImages && secondaryText && (
              <TypingText 
                textKey={`secondary-${currentStep}-${secondaryText}`} 
                text={secondaryText} 
                typingSpeed={50}
                className={cn("text-xl font-semibold text-center", generationError && currentStep === 3 ? "text-destructive" : "")}
                onFinished={handleSecondaryTextFinished} 
              />
            )}
          </div>
          
          {/* Step 1 & 2 Buttons */}
          {(currentStep === 1 || currentStep === 2) && (
            <div 
              className={cn(
                "grid w-full grid-cols-1 gap-4 pt-4 transition-all duration-500 ease-in-out",
                currentStep === 1 ? "sm:grid-cols-3" : "sm:grid-cols-2 md:grid-cols-2",
                showChoiceButtons ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
            >
              {currentChoices.map((choice) => (
                <Button
                  key={choice.id}
                  variant={currentSelection === choice.id ? "default" : "outline"}
                  size="lg"
                  className={cn(
                    "h-auto py-4 text-base rounded-lg transition-all duration-200 ease-in-out transform focus:outline-none",
                    currentSelection === choice.id 
                      ? "border-2 border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                      : "border-2 border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground hover:shadow-md hover:scale-105 active:scale-95"
                  )}
                  onClick={() => setSelection(choice.id)}
                >
                  {choice.label}
                </Button>
              ))}
            </div>
          )}

          {/* Step 3 Carousel */}
          {currentStep === 3 && !isGeneratingImages && generatedImages.length > 0 && !generationError && (
            <div className={cn("w-full max-w-lg pt-4 transition-opacity duration-700 ease-in-out", showCarousel ? "opacity-100" : "opacity-0")}>
              <Carousel className="w-full">
                <CarouselContent>
                  {generatedImages.map((image) => (
                    <CarouselItem key={image.src} className="flex flex-col items-center justify-center">
                      <div className="p-1 w-full aspect-[3/2] relative bg-muted rounded-md flex items-center justify-center">
                        <Image 
                          src={image.src} 
                          alt={image.alt} 
                          fill 
                          className="rounded-md object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) => handleImageError(e, image.view)}
                          onLoad={() => handleImageLoad(image.src)}
                          loading="eager"
                          priority={true}
                        />
                        {!loadedImages[image.src] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-md opacity-50 pointer-events-none">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{image.view}</p>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-[-40px]" />
                <CarouselNext className="mr-[-40px]" />
              </Carousel>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-between">
        <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1 || isGeneratingImages}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={isNextDisabled}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {currentStep === totalSteps ? "Finish" : "Next"} <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 