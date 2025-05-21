'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, PlusCircle, Zap, Image as ImageIcon, Edit3, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AdvancedAdBuilderDialogContent from "@/components/dashboard/AdvancedAdBuilderDialogContent";
import AdDraftDetailsDialog from "@/components/dashboard/AdDraftDetailsDialog";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import ExpandedImageView from "@/components/dashboard/ExpandedImageView";

// Define the structure of an Ad Draft, matching the backend
interface AdDraft {
  id: string; // Assuming Supabase provides an ID
  industry: string | null;
  house_style: string | null;
  generated_images: { view: string; src: string; alt: string }[];
  created_at: string; // Assuming Supabase provides this
}

export default function GenerateAdsPage() {
  const [isAdvancedBuilderOpen, setIsAdvancedBuilderOpen] = useState(false);
  const [recentDrafts, setRecentDrafts] = useState<AdDraft[]>([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
  const [draftsError, setDraftsError] = useState<string | null>(null);
  const [selectedDraft, setSelectedDraft] = useState<AdDraft | null>(null);
  const [isDraftDetailsOpen, setIsDraftDetailsOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const { toast } = useToast();

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
      setRecentDrafts(data.drafts || []);
    } catch (error) {
      console.error("Error fetching ad drafts:", error);
      setDraftsError(error instanceof Error ? error.message : "An unknown error occurred.");
      setRecentDrafts([]);
    } finally {
      setIsLoadingDrafts(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, [isAdvancedBuilderOpen]);

  const handleDeleteDraft = async (draftId: string) => {
    try {
      const response = await fetch(`/api/ad-drafts/${draftId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete draft');
      }

      // Remove the draft from the local state
      setRecentDrafts(drafts => drafts.filter(draft => draft.id !== draftId));
      toast({
        title: "Draft deleted",
        description: "The draft has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({
        title: "Error",
        description: "Failed to delete the draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDraftToDelete(null);
    }
  };

  const handleViewDetails = (draft: AdDraft) => {
    setSelectedDraft(draft);
    setIsDraftDetailsOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Generate New Ads
        </h1>
        <Dialog open={isAdvancedBuilderOpen} onOpenChange={setIsAdvancedBuilderOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> New Ad Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-0">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-2xl font-bold text-center">Advanced Ad Builder</DialogTitle>
            </DialogHeader>
            <AdvancedAdBuilderDialogContent onClose={() => setIsAdvancedBuilderOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Quick Ad Generation</h2>
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Generate a new ad quickly using our AI-powered templates.
          </p>
          <Button variant="outline" className="w-full">
            Start Quick Generation <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm hover:shadow-primary/20 transition-shadow cursor-pointer" onClick={() => setIsAdvancedBuilderOpen(true)}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Advanced Ad Builder</h2>
            <PlusCircle className="h-6 w-6 text-blue-500" />
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Use the advanced builder for full control over your ad creatives and targeting.
          </p>
          <Button variant="outline" className="w-full pointer-events-none">
            Open Advanced Builder <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">View Ad Templates</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Browse and manage your saved ad templates and creatives.
          </p>
          <Button variant="outline" className="w-full">
            Browse Templates <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Recent Ad Drafts</h2>
        {isLoadingDrafts && <p className="text-sm text-muted-foreground">Loading drafts...</p>}
        {draftsError && <p className="text-sm text-destructive">Error loading drafts: {draftsError}</p>}
        {!isLoadingDrafts && !draftsError && recentDrafts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You have no recent ad drafts. Start generating to see them here.
          </p>
        )}
        {!isLoadingDrafts && !draftsError && recentDrafts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentDrafts.map((draft) => (
              <div key={draft.id} className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm relative group">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Edit3 className="h-4 w-4" />
                    <span className="sr-only">Edit Draft</span>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setDraftToDelete(draft.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete Draft</span>
                  </Button>
                </div>
                {draft.generated_images && draft.generated_images.length > 0 && (
                  <div 
                    className="mb-4 h-40 w-full relative rounded-md overflow-hidden bg-muted cursor-pointer"
                    onClick={() => handleViewDetails(draft)}
                  >
                    <Image
                      src={draft.generated_images[0].src}
                      alt={draft.generated_images[0].alt || 'Ad draft preview'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-1 truncate">
                  {draft.industry} {draft.house_style ? `- ${draft.house_style}` : ''}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Created: {new Date(draft.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground mb-3 truncate">
                  {draft.generated_images?.length || 0} image{draft.generated_images?.length !== 1 ? 's' : ''} generated.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full text-sm"
                  onClick={() => handleViewDetails(draft)}
                >
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Draft Details Dialog */}
      <AdDraftDetailsDialog
        draft={selectedDraft}
        isOpen={isDraftDetailsOpen}
        onClose={() => {
          setIsDraftDetailsOpen(false);
          setSelectedDraft(null);
        }}
        expandedImage={expandedImage}
        onExpandImage={setExpandedImage}
      />

      {/* Expanded Image View */}
      {expandedImage && (
        <ExpandedImageView 
          src={expandedImage} 
          onClose={() => setExpandedImage(null)} 
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!draftToDelete} onOpenChange={() => setDraftToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the ad draft and all its generated images.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => draftToDelete && handleDeleteDraft(draftToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}