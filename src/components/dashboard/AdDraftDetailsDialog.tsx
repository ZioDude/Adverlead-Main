'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Download, ExternalLink, Maximize2 } from "lucide-react";
import Image from "next/image";

interface AdDraft {
  id: string;
  industry: string | null;
  house_style: string | null;
  generated_images: { view: string; src: string; alt: string }[];
  created_at: string;
}

interface AdDraftDetailsDialogProps {
  draft: AdDraft | null;
  isOpen: boolean;
  onClose: () => void;
  expandedImage: string | null;
  onExpandImage: (src: string | null) => void;
}

export default function AdDraftDetailsDialog({ 
  draft, 
  isOpen,
  onClose,
  expandedImage: _expandedImage,
  onExpandImage
}: AdDraftDetailsDialogProps) {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  if (!draft) return null;

  const handleDownload = async (imageUrl: string, view: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${draft.industry}-${view}-${new Date().getTime()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [src]: true
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">
            {draft.industry} {draft.house_style ? `- ${draft.house_style}` : ''}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Created on {new Date(draft.created_at).toLocaleDateString()}
          </p>
        </DialogHeader>
        
        <div className="p-6">
          <Carousel className="w-full max-w-3xl mx-auto">
            <CarouselContent>
              {draft.generated_images.map((image) => (
                <CarouselItem key={image.src}>
                  <div className="relative aspect-[3/2] w-full">
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-background/50 backdrop-blur-sm hover:bg-background/80"
                        onClick={() => handleDownload(image.src, image.view)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-background/50 backdrop-blur-sm hover:bg-background/80"
                        onClick={() => window.open(image.src, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-background/50 backdrop-blur-sm hover:bg-background/80"
                        onClick={() => onExpandImage(image.src)}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="rounded-lg object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onLoad={() => handleImageLoad(image.src)}
                      priority
                    />
                    {!loadedImages[image.src] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
                        <div className="animate-pulse bg-muted h-full w-full rounded-lg" />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-background/50 backdrop-blur-sm px-2 py-1 rounded text-sm">
                      {image.view}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-4" />
            <CarouselNext className="mr-4" />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
} 