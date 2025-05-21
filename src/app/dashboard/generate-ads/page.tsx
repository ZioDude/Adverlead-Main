'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, PlusCircle, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdvancedAdBuilderDialogContent from "@/components/dashboard/AdvancedAdBuilderDialogContent";
import { useState } from "react";

export default function GenerateAdsPage() {
  const [isAdvancedBuilderOpen, setIsAdvancedBuilderOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Generate New Ads
        </h1>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <PlusCircle className="mr-2 h-5 w-5" /> New Ad Campaign
        </Button>
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

        <Dialog open={isAdvancedBuilderOpen} onOpenChange={setIsAdvancedBuilderOpen}>
          <DialogTrigger asChild>
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm hover:shadow-primary/20 transition-shadow cursor-pointer">
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
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-0">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-2xl font-bold text-center">Advanced Ad Builder</DialogTitle>
            </DialogHeader>
            
            <AdvancedAdBuilderDialogContent onClose={() => setIsAdvancedBuilderOpen(false)} />
          </DialogContent>
        </Dialog>

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
        {/* Placeholder for recent drafts list */}
        <p className="text-sm text-muted-foreground">
          You have no recent ad drafts. Start generating to see them here.
        </p>
      </div>
    </div>
  );
} 