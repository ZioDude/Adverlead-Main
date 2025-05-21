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
  key?: string | number; 
}

const TypingText: React.FC<TypingTextProps> = ({ 
  text, 
  startDelay = 0, 
  typingSpeed = 50, 
  onFinished,
  className,
  key 
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
  }, [startDelay, text, key]);

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

// Simulate API call for image generation
async function fetchGeneratedImages(houseStyleLabel: string): Promise<GeneratedImage[]> {
  console.log(`Simulating image generation for: ${houseStyleLabel}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const images = imageViews.map((view, index) => ({
        view,
        // Use a consistent seed for picsum.photos based on style and view for more deterministic placeholders
        src: `https://picsum.photos/seed/${encodeURIComponent(houseStyleLabel)}-${encodeURIComponent(view)}/600/400`,
        alt: `${houseStyleLabel} - ${view}`,
      }));
      console.log("Simulated images:", images);
      resolve(images);
    }, 3000); // Simulate 3-second generation time
  });
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
    primaryText = step3Line1TextInitial(houseStyleLabel);
    secondaryText = isGeneratingImages ? "" : step3Line2TextComplete;
    // No choices for step 3, it's for display
  }

  // Animation Orchestration
  useEffect(() => {
    setShowBotStep(false);
    setStartTypingPrimary(false);
    setStartTypingSecondary(false);
    setShowChoiceButtons(false);
    setShowCarousel(false); // Reset carousel visibility

    const timerBot = setTimeout(() => setShowBotStep(true), 100);
    const timerPrimary = setTimeout(() => setStartTypingPrimary(true), 600);

    return () => {
      clearTimeout(timerBot);
      clearTimeout(timerPrimary);
    };
  }, [currentStep]);

  const handlePrimaryTextFinished = () => {
    if (currentStep === 3 && isGeneratingImages) return; // Don't type secondary if generating
    setTimeout(() => setStartTypingSecondary(true), 200);
  };

  const handleSecondaryTextFinished = () => {
    if (currentStep === 1 || currentStep === 2) {
      setTimeout(() => setShowChoiceButtons(true), 300);
    } else if (currentStep === 3 && !isGeneratingImages && generatedImages.length > 0) {
      setTimeout(() => setShowCarousel(true), 300);
    }
  };
  
  const handleNext = async () => {
    if (currentStep === 1) {
      if (selectedIndustry === "renovation") {
        setCurrentStep(2);
        setSelectedHouseStyle(null);
        setGeneratedImages([]); // Clear previous images
      } else {
        if (onClose) onClose();
      }
    } else if (currentStep === 2 && selectedIndustry === "renovation") {
      if (selectedHouseStyle) {
        setIsGeneratingImages(true);
        setShowChoiceButtons(false); // Hide choices while generating
        setStartTypingPrimary(true); // Re-trigger primary typing for step 3 initial message
        setStartTypingSecondary(false);
        setCurrentStep(3);
        const images = await fetchGeneratedImages(houseStyleLabel);
        setGeneratedImages(images);
        setIsGeneratingImages(false);
        // Secondary text (completion message) and carousel will be triggered via useEffect/onFinished
      }
    } else if (currentStep === 3) {
      if (onClose) onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep === 3) {
      setGeneratedImages([]); // Clear images when going back from step 3
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
              showBotStep ? "opacity-100" : "opacity-0"
            )}
          />
          <div className="flex flex-col items-center space-y-1 min-h-[4em]">
            {startTypingPrimary && (
              <TypingText 
                key={`primary-${currentStep}-${primaryText}`} 
                text={primaryText} 
                typingSpeed={40}
                className="text-lg font-medium text-center"
                onFinished={handlePrimaryTextFinished}
              />
            )}
            {/* Show loader or secondary text for Step 3 */}
            {currentStep === 3 && isGeneratingImages && showBotStep && (
              <div className="flex items-center space-x-2 text-muted-foreground mt-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating images... please wait.</span>
              </div>
            )}
            {startTypingSecondary && !isGeneratingImages && secondaryText && (
              <TypingText 
                key={`secondary-${currentStep}-${secondaryText}`} 
                text={secondaryText} 
                typingSpeed={50}
                className="text-xl font-semibold text-center"
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
          {currentStep === 3 && !isGeneratingImages && generatedImages.length > 0 && (
            <div className={cn("w-full max-w-lg pt-4 transition-opacity duration-700 ease-in-out", showCarousel ? "opacity-100" : "opacity-0")}>
              <Carousel className="w-full">
                <CarouselContent>
                  {generatedImages.map((image, index) => (
                    <CarouselItem key={index} className="flex flex-col items-center justify-center">
                      <div className="p-1 w-full aspect-[3/2] relative">
                        <Image 
                          src={image.src} 
                          alt={image.alt} 
                          fill 
                          className="rounded-md object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
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