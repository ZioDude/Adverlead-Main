'use client';

import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  PlusCircle, 
  Zap,
  Grid,
  Home,
  Facebook,
  Users,
  Settings,
  LogOut
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdvancedAdBuilderDialogContent from "@/components/dashboard/AdvancedAdBuilderDialogContent";
import AdDraftDetailsDialog from "@/components/dashboard/AdDraftDetailsDialog";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import ExpandedImageView from "@/components/dashboard/ExpandedImageView";
// import { cn } from "@/lib/utils"; // Removed unused import

// Define the structure of an Ad Draft, matching the backend
interface AdDraft {
  id: string;
  industry: string | null;
  house_style: string | null;
  generated_images: { view: string; src: string; alt: string }[];
  created_at: string;
}

export default function GenerateAdsPage() {
  const [isAdvancedBuilderOpen, setIsAdvancedBuilderOpen] = useState(false);
  const [recentDrafts, setRecentDrafts] = useState<AdDraft[]>([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
  const [draftsError, setDraftsError] = useState<string | null>(null);
  const [selectedDraft, setSelectedDraft] = useState<AdDraft | null>(null);
  const [isDraftDetailsOpen, setIsDraftDetailsOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  // const { toast } = useToast(); // Removed unused variable

  // Updated navigation items with correct paths
  // const navigationItems = [ // Removed unused variable
  //   { icon: Grid, label: "Overview", href: "/" },
  //   { icon: Home, label: "Homepage", href: "/" },
  //   { icon: Zap, label: "Generate Ads", href: "/generate-ads", active: true },
  //   { icon: Facebook, label: "Facebook", href: "/facebook" },
  //   { icon: Users, label: "Leads", href: "/leads" },
  //   { icon: Settings, label: "Settings", href: "/settings" },
  //   { icon: LogOut, label: "Logout", href: "/logout" },
  // ];

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

  const handleViewDetails = (draft: AdDraft) => {
    setSelectedDraft(draft);
    setIsDraftDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-black/95">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight text-[#bf5af2]">
              Generate New Ads
            </h1>
            <Dialog open={isAdvancedBuilderOpen} onOpenChange={setIsAdvancedBuilderOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="bg-transparent hover:bg-[#bf5af2]/10 text-[#bf5af2] rounded-full px-6 border border-[#bf5af2] transition-colors"
                >
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
          <p className="text-lg text-zinc-400 max-w-3xl">
            Create stunning ad creatives using our AI-powered tools. Choose from quick generation or advanced builder for more control.
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {/* Quick Ad Generation */}
          <div className="group relative rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm border border-white/5 p-6 hover:border-[#bf5af2]/20 transition-colors">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Quick Ad Generation</h2>
              <Zap className="h-6 w-6 text-[#bf5af2]" />
            </div>
            <p className="mb-6 text-sm text-zinc-400">
              Generate a new ad quickly using our AI-powered templates. Perfect for rapid testing and iteration.
            </p>
            <Button 
              variant="outline" 
              className="w-full bg-transparent border-white/10 hover:bg-[#bf5af2] hover:text-white transition-colors rounded-lg"
            >
              Start Quick Generation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Advanced Ad Builder */}
          <div 
            onClick={() => setIsAdvancedBuilderOpen(true)}
            className="group relative rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm border border-white/5 p-6 hover:border-[#bf5af2]/20 transition-colors cursor-pointer"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Advanced Ad Builder</h2>
              <div className="h-8 w-8 rounded-full bg-[#bf5af2]/10 flex items-center justify-center">
                <PlusCircle className="h-5 w-5 text-[#bf5af2] group-hover:rotate-90 transition-transform duration-300" />
              </div>
            </div>
            <p className="mb-6 text-sm text-zinc-400">
              Use the advanced builder for full control over your ad creatives and targeting options.
            </p>
            <Button 
              variant="outline" 
              className="w-full bg-transparent border-white/10 hover:bg-[#bf5af2] hover:text-white transition-colors rounded-lg pointer-events-none"
            >
              Open Advanced Builder <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* View Ad Templates */}
          <div className="group relative rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm border border-white/5 p-6 hover:border-[#bf5af2]/20 transition-colors">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">View Ad Templates</h2>
              <ArrowRight className="h-6 w-6 text-[#bf5af2]" />
            </div>
            <p className="mb-6 text-sm text-zinc-400">
              Browse and manage your saved ad templates and creatives. Reuse successful designs.
            </p>
            <Button 
              variant="outline" 
              className="w-full bg-transparent border-white/10 hover:bg-[#bf5af2] hover:text-white transition-colors rounded-lg"
            >
              Browse Templates <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Recent Ad Drafts */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-8">Recent Ad Drafts</h2>
          
          {isLoadingDrafts && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#bf5af2] border-t-transparent"></div>
              <p className="mt-4 text-sm text-zinc-400">Loading drafts...</p>
            </div>
          )}

          {draftsError && (
            <div className="text-center py-12">
              <p className="text-sm text-red-500">Error loading drafts: {draftsError}</p>
            </div>
          )}

          {!isLoadingDrafts && !draftsError && recentDrafts.length === 0 && (
            <div className="text-center py-12 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5">
              <p className="text-sm text-zinc-400">
                You have no recent ad drafts. Start generating to see them here.
              </p>
            </div>
          )}

          {!isLoadingDrafts && !draftsError && recentDrafts.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentDrafts.map((draft) => (
                <div 
                  key={draft.id} 
                  className="rounded-xl bg-black/20 backdrop-blur-sm border border-white/5 p-6 hover:border-[#bf5af2]/20 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(draft)}
                >
                  {draft.generated_images && draft.generated_images.length > 0 && (
                    <div className="mb-4 h-48 w-full relative rounded-lg overflow-hidden">
                      <Image
                        src={draft.generated_images[0].src}
                        alt={draft.generated_images[0].alt || 'Ad draft preview'}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-white truncate mb-2">
                    {draft.industry} {draft.house_style ? `- ${draft.house_style}` : ''}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    {new Date(draft.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
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

      {expandedImage && (
        <ExpandedImageView 
          src={expandedImage} 
          onClose={() => setExpandedImage(null)} 
        />
      )}
    </div>
  );
}