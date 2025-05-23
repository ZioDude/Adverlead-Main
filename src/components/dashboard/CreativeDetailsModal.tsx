'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from 'next/image';

interface Creative {
  id: string;
  created_at: string;
  service_type: string;
  style_label: string;
  edited_image_url: string;
  original_image_urls: string[];
  logo_image_url?: string | null;
  website_text?: string | null;
  title_text_used: string;
  subtitle_text_used: string;
  overlay_opacity_used: number;
}

interface CreativeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void; // This will now also be called after a successful delete to trigger refresh
  creative: Creative | null;
}

export function CreativeDetailsModal({ isOpen, onClose, creative }: CreativeDetailsModalProps) {
  const { toast } = useToast();

  if (!creative) {
    return null;
  }

  const handleDelete = async () => {
    if (!creative) return;

    try {
      const response = await fetch(`/api/creatives?id=${creative.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete creative');
      }

      toast({
        title: "Success",
        description: "Creative deleted successfully.",
      });
      onClose(); // Close the modal and trigger refresh on the parent page
    } catch (error) {
      console.error("Error deleting creative:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  const imagesToShow = [
    { src: creative.edited_image_url, alt: `Edited: ${creative.style_label}` },
    ...creative.original_image_urls.map((url, index) => ({
      src: url,
      alt: `Original ${index + 1}: ${creative.style_label}`,
    })),
  ];

  // Filter out the first original image if it's identical to the edited_image_url
  // This can happen if no actual branding was applied or if the source was the same
  if (imagesToShow.length > 1 && imagesToShow[0].src === imagesToShow[1].src) {
    imagesToShow.splice(1, 1);
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Creative Details: {creative.style_label}</DialogTitle>
        </DialogHeader>
        
        <div className="py-6 flex-grow overflow-y-auto"> {/* Make this area scrollable and grow */}
          {imagesToShow.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
                loop: imagesToShow.length > 1,
              }}
              className="w-full"
            >
              <CarouselContent>
                {imagesToShow.map((image, index) => (
                  <CarouselItem key={index} className="flex justify-center items-center">
                    <div className="relative w-full aspect-[16/9] max-h-[70vh]">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {imagesToShow.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
                </>
              )}
            </Carousel>
          ) : (
            <p className="text-center text-muted-foreground">No images available for this creative.</p>
          )}
          <div className="mt-6 text-sm text-muted-foreground space-y-1">
            <p><strong>Service:</strong> {creative.service_type}</p>
            <p><strong>Style:</strong> {creative.style_label}</p>
            <p><strong>Title Used:</strong> {creative.title_text_used.replace(/\n/g, ', ')}</p>
            <p><strong>Subtitle Used:</strong> {creative.subtitle_text_used.replace(/\n/g, ', ')}</p>
            {creative.logo_image_url && <p><strong>Logo:</strong> <a href={creative.logo_image_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Logo</a></p>}
            {creative.website_text && <p><strong>Website:</strong> {creative.website_text}</p>}
            <p><strong>Created:</strong> {new Date(creative.created_at).toLocaleString()}</p>
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-between">
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Creative
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this creative.
                    Associated images in storage will not be deleted automatically by this action.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                    Yes, delete creative
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
           <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
