'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CreateCreativeModal } from '@/components/dashboard/CreateCreativeModal';
import { CreativeDetailsModal } from '@/components/dashboard/CreativeDetailsModal'; // Import the new modal
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image'; // For optimized image display

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

export default function CreativesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreatives = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/creatives');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch creatives');
      }
      const data = await response.json();
      setCreatives(data);
    } catch (err) {
      console.error("Error fetching creatives:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreatives();
  }, [fetchCreatives]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchCreatives(); // Refresh creatives when modal is closed (especially after a save)
  };

  const handleViewDetails = (creative: Creative) => {
    setSelectedCreative(creative);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Creatives</h1>
          <p className="text-muted-foreground">
            Generate and manage your creative assets.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="lg">
          Generate New Creative
        </Button>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Your Creatives</h2>
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}
        {error && (
          <div className="p-6 border rounded-lg bg-destructive/10 text-destructive text-center">
            <p>Error loading creatives: {error}</p>
            <Button onClick={fetchCreatives} variant="outline" className="mt-4">Try Again</Button>
          </div>
        )}
        {!isLoading && !error && creatives.length === 0 && (
          <div className="p-6 border rounded-lg bg-card text-card-foreground text-center">
            <p className="text-muted-foreground">
              You haven&apos;t generated any creatives yet. Click the button above to get started!
            </p>
          </div>
        )}
        {!isLoading && !error && creatives.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {creatives.map((creative) => (
              <Card key={creative.id} className="overflow-hidden flex flex-col">
                <CardHeader className="p-0">
                  <div className="aspect-square w-full relative">
                    <Image 
                      src={creative.edited_image_url} 
                      alt={`Creative for ${creative.style_label}`} 
                      layout="fill"
                      objectFit="cover" 
                      className="bg-muted"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="text-lg mb-1 truncate" title={creative.style_label}>
                    {creative.style_label}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    {new Date(creative.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                   <Button variant="outline" size="sm" className="w-full" onClick={() => handleViewDetails(creative)}>View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {isModalOpen && (
        <CreateCreativeModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}

      {selectedCreative && (
        <CreativeDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedCreative(null);
          }}
          creative={selectedCreative}
        />
      )}
    </div>
  );
}
