'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import ToolPanel from './ToolPanel';
import PropertiesPanel from './PropertiesPanel';

interface EditorState {
  title: string;
  subtitle: string;
  titleColor: string;
  subtitleColor: string;
  overlayOpacity: number;
  logoUrl: string;
  websiteText: string;
  websiteTextColor: string;
  brightness: number;
  contrast: number;
  saturation: number;
}

interface ImageData {
  originalImage: HTMLImageElement | null;
  processedImageUrl: string | null; 
}

interface ImageEditorProps {
  directOutputMode?: boolean;
  onProcessingComplete?: (dataUrl: string) => void;
  initialImageUrl?: string;
}

export default function ImageEditor({ 
  directOutputMode = false, 
  onProcessingComplete, 
  initialImageUrl 
}: ImageEditorProps) {
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imageData, setImageData] = useState<ImageData>({
    originalImage: null,
    processedImageUrl: null,
  });
  
  const initialEditorState: EditorState = {
    title: 'Personalized Renovations\nFor Your Unique\nLifestyle',
    subtitle: 'Where quality meets innovation\nin home renovation',
    titleColor: '#ffffff',
    subtitleColor: '#ffffff',
    overlayOpacity: 90,
    logoUrl: 'https://pvvvbzllhtfrdirafduh.supabase.co/storage/v1/object/public/ad-images/3e252d62-6306-49d4-9ae2-611f68ffa331/temp-edit-3e252d62-6306-49d4-9ae2-611f68ffa331-adverlead_logo-1747952117957.png',
    websiteText: 'www.adverlead-renovations.com',
    websiteTextColor: '#ffffff',
    brightness: 0,
    contrast: 0,
    saturation: 0,
  };
  const [editorState, setEditorState] = useState<EditorState>(initialEditorState);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateOutput = useCallback(() => {
    console.log('[ImageEditor] generateOutput called. directOutputMode:', directOutputMode);
    if (!canvasRef.current) {
      console.error('[ImageEditor] generateOutput: canvasRef is null.');
      if (directOutputMode && onProcessingComplete) {
        console.warn('[ImageEditor] generateOutput: Canvas ref missing, calling onProcessingComplete with empty string.');
        onProcessingComplete(""); // Signal error
      }
      return;
    }
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      console.log('[ImageEditor] generateOutput: Data URL generated (length):', dataUrl.length);
      if (directOutputMode && onProcessingComplete) {
        console.log('[ImageEditor] generateOutput: Calling onProcessingComplete with dataUrl.');
        onProcessingComplete(dataUrl);
      }
    } catch (error) {
      console.error('[ImageEditor] generateOutput: Error during toDataURL or calling onProcessingComplete:', error);
      if (directOutputMode && onProcessingComplete) {
        console.warn('[ImageEditor] generateOutput: Caught error, calling onProcessingComplete with empty string.');
        // It's crucial to call this so AutomatedImageProcessor doesn't hang
        onProcessingComplete(""); // Signal error (e.g., CORS issue)
      }
    }
  }, [directOutputMode, onProcessingComplete]);
  
  const processImage = useCallback((img: HTMLImageElement, state: EditorState, onDone?: () => void) => {
    console.log('[ImageEditor] processImage BEGIN. directOutputMode:', directOutputMode);
    if (!canvasRef.current || !img) {
      console.error('[ImageEditor] processImage: canvasRef or img is null/undefined.');
      if (onDone) onDone();
      if (directOutputMode && onProcessingComplete) {
        console.warn('[ImageEditor] processImage: Canvas ref or image missing, calling onProcessingComplete with empty string.');
        onProcessingComplete(""); // Signal error to AutomatedImageProcessor
      }
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('[ImageEditor] processImage: Failed to get 2D context.');
      if (onDone) onDone();
      if (directOutputMode && onProcessingComplete) {
        console.warn('[ImageEditor] processImage: No context, calling onProcessingComplete with empty string.');
        onProcessingComplete(""); // Signal error to AutomatedImageProcessor
      }
      return;
    }

    canvas.width = img.width;
    canvas.height = img.height;

    let filterString = '';
    if (state.brightness !== 0) filterString += `brightness(${1 + state.brightness / 100}) `;
    if (state.contrast !== 0) filterString += `contrast(${1 + state.contrast / 100}) `;
    if (state.saturation !== 0) filterString += `saturate(${1 + state.saturation / 100}) `;
    ctx.filter = filterString.trim() || 'none';
    ctx.drawImage(img, 0, 0);
    ctx.filter = 'none';

    const gradientEndX = canvas.width * 0.9;
    const gradient = ctx.createLinearGradient(0, 0, gradientEndX, 0);
    gradient.addColorStop(0, `rgba(0, 0, 0, ${state.overlayOpacity / 100})`);
    gradient.addColorStop(0.5, `rgba(0, 0, 0, ${state.overlayOpacity * 0.7 / 100})`);
    gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const titleFontSize = Math.max(28, canvas.width * 0.065);
    const subtitleFontSize = Math.max(20, canvas.width * 0.035);
    const websiteFontSize = Math.max(14, canvas.width * 0.02);

    ctx.textAlign = 'left';
    const lineHeightMultiplier = 1.2;
    const leftPadding = canvas.width * 0.05;
    let currentY = canvas.height * 0.30;

    const titleLines = state.title.split('\n');
    ctx.fillStyle = state.titleColor;
    ctx.font = `bold ${titleFontSize}px system-ui, -apple-system, sans-serif`;
    titleLines.forEach(line => {
      ctx.fillText(line, leftPadding, currentY);
      currentY += titleFontSize * lineHeightMultiplier;
    });

    if (titleLines.length > 0 && state.subtitle.split('\n').length > 0) {
      currentY += subtitleFontSize * 0.5;
    }

    const subtitleLines = state.subtitle.split('\n');
    ctx.fillStyle = state.subtitleColor;
    ctx.font = `${subtitleFontSize}px system-ui, -apple-system, sans-serif`;
    subtitleLines.forEach(line => {
      ctx.fillText(line, leftPadding, currentY);
      currentY += subtitleFontSize * lineHeightMultiplier;
    });

    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;

    if (state.websiteText) {
      ctx.font = `${websiteFontSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = state.websiteTextColor;
      const bottomPaddingValue = canvas.height * 0.1; // Renamed to avoid conflict
      ctx.fillText(state.websiteText, leftPadding, canvas.height - (bottomPaddingValue * 0.5));
    }

    const finalizeProcessing = () => {
      console.log('[ImageEditor] finalizeProcessing. directOutputMode:', directOutputMode);
      if (directOutputMode && onProcessingComplete) {
        generateOutput();
      } else {
        canvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setImageData(prev => {
              if (prev.processedImageUrl) URL.revokeObjectURL(prev.processedImageUrl);
              return { ...prev, processedImageUrl: url };
            });
          }
        });
      }
      if (onDone) onDone();
    };

    if (state.logoUrl) {
      let logoLoadTimeoutId: NodeJS.Timeout | null = null;
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';

      const cleanupLogoTimeout = () => {
        if (logoLoadTimeoutId) {
          clearTimeout(logoLoadTimeoutId);
          logoLoadTimeoutId = null;
        }
      };

      let finalizeCalled = false; // Prevent multiple calls to finalizeProcessing
      const callFinalizeOnce = () => {
        if (!finalizeCalled) {
          finalizeCalled = true;
          cleanupLogoTimeout();
          finalizeProcessing();
        }
      };

      logoImg.onload = () => {
        console.log('[ImageEditor] Logo loaded:', state.logoUrl);
        const logoMaxHeight = canvas.height * 0.1;
        const scale = Math.min(logoMaxHeight / logoImg.height, (canvas.width * 0.3) / logoImg.width);
        const logoWidth = logoImg.width * scale;
        const logoHeight = logoImg.height * scale;
        ctx.drawImage(logoImg, (canvas.width - logoWidth) / 2, canvas.height * 0.05, logoWidth, logoHeight);
        callFinalizeOnce();
      };
      logoImg.onerror = () => {
        console.error("Failed to load logo image:", state.logoUrl);
        callFinalizeOnce();
      };
      logoImg.src = state.logoUrl;

      // Timeout for logo loading, only in directOutputMode to prevent hangs
      if (directOutputMode) {
        logoLoadTimeoutId = setTimeout(() => {
          if (!logoImg.complete || !logoImg.naturalWidth) {
            console.warn(`[ImageEditor] processImage: Logo load timeout for ${state.logoUrl}.`);
            toast({ title: "Timeout", description: "Loading logo image timed out.", variant: "default" });
          }
          // Ensure finalizeProcessing is called even on timeout
          callFinalizeOnce();
        }, 10000); // 10-second timeout for logo
      }
    } else {
      console.log('[ImageEditor] No logoUrl, calling finalizeProcessing.');
      finalizeProcessing();
    }
  }, [generateOutput, directOutputMode, onProcessingComplete]);

  const loadImageFromUrl = useCallback((url: string) => {
    if (directOutputMode) setIsProcessing(true);
    console.log('[ImageEditor] loadImageFromUrl called with URL:', url);

    let imageLoadTimeoutId: NodeJS.Timeout | null = null;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const cleanupTimeout = () => {
      if (imageLoadTimeoutId) {
        clearTimeout(imageLoadTimeoutId);
        imageLoadTimeoutId = null;
      }
    };

    img.onload = () => {
      cleanupTimeout();
      console.log('[ImageEditor] Base image loaded (img.onload):', url);
      setImageData(prev => ({ ...prev, originalImage: img }));
      // Note: setIsProcessing(false) for directOutputMode is handled after processImage completes
    };

    img.onerror = (e) => {
      cleanupTimeout();
      console.error('[ImageEditor] Base img.onerror triggered for URL:', url, 'Error event:', e);
      toast({ title: "Error", description: "Failed to load base image.", variant: "destructive" });
      if (directOutputMode) {
        setIsProcessing(false);
        if (onProcessingComplete) {
          console.warn('[ImageEditor] loadImageFromUrl (onerror): Calling onProcessingComplete with empty string.');
          onProcessingComplete("");
        }
      }
    };

    img.src = url;

    if (directOutputMode) {
      imageLoadTimeoutId = setTimeout(() => {
        // If neither onload nor onerror has fired by now, assume a timeout
        if (!img.complete || !img.naturalWidth) { // Check if image actually loaded
          console.warn(`[ImageEditor] loadImageFromUrl: Image load timeout for ${url}.`);
          toast({ title: "Timeout", description: "Loading base image timed out.", variant: "destructive" });
          setIsProcessing(false);
          if (onProcessingComplete) {
            console.warn('[ImageEditor] loadImageFromUrl (timeout): Calling onProcessingComplete with empty string.');
            onProcessingComplete("");
          }
        }
      }, 15000); // 15-second timeout
    }
  }, [directOutputMode, onProcessingComplete]);

  useEffect(() => {
    const imageUrlFromParams = searchParams?.get('imageUrl');
    const effectiveImageUrl = initialImageUrl || imageUrlFromParams;
    if (effectiveImageUrl && !imageData.originalImage && !isProcessing) { 
        console.log('[ImageEditor] useEffect (initial load): Loading image from', effectiveImageUrl)
      loadImageFromUrl(decodeURIComponent(effectiveImageUrl));
    }
  }, [searchParams, initialImageUrl, loadImageFromUrl, imageData.originalImage, isProcessing]);

  useEffect(() => {
    if (imageData.originalImage && canvasRef.current) {
      console.log('[ImageEditor] useEffect (image/state change): Conditions met, calling processImage. directOutputMode:', directOutputMode);
      processImage(imageData.originalImage, editorState, () => {
        if (directOutputMode) {
          console.log('[ImageEditor] processImage callback in directOutputMode: setIsProcessing(false)');
          setIsProcessing(false); 
        }
      });
    } else {
        if(!imageData.originalImage) console.log("[ImageEditor] useEffect (image/state change): No original image to process yet.");
        if(!canvasRef.current) console.log("[ImageEditor] useEffect (image/state change): Canvas not ready yet.");
    }
  }, [imageData.originalImage, editorState, processImage, directOutputMode ]); // Removed canvasRef from here, it's checked inside

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: "Invalid file type", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please select an image smaller than 10MB.", variant: "destructive" });
      return;
    }
    
    if (!directOutputMode) setIsProcessing(true); // Set isProcessing for interactive mode file uploads

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload-image-for-edit', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Upload failed');
      const { imageUrl: uploadedUrl } = await response.json();
      console.log('[ImageEditor] Received from API, imageUrl:', uploadedUrl);
      loadImageFromUrl(uploadedUrl);
    } catch (error) {
      console.error('[ImageEditor] handleFileUpload error:', error);
      toast({ title: "Upload processing failed", description: "Could not process image upload.", variant: "destructive" });
      if (!directOutputMode) setIsProcessing(false);
    }
    // In directOutputMode, setIsProcessing is handled by the processImage callback
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `edited-image-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
  };

  const resetImage = () => {
    setEditorState(initialEditorState); // Revert to initial default state
    // If an image is loaded, it will be reprocessed by the useEffect watching editorState
    // If no image is loaded, and an initialImageUrl was provided, we might want to reload it.
    if (!imageData.originalImage) {
        const imageUrlFromParams = searchParams?.get('imageUrl');
        const effectiveImageUrl = initialImageUrl || imageUrlFromParams;
        if (effectiveImageUrl) {
            loadImageFromUrl(decodeURIComponent(effectiveImageUrl));
        }
    }
  };

  if (directOutputMode && isProcessing) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Applying edits...</p>
        </div>
      </div>
    );
  }
  if (directOutputMode && !isProcessing && !imageData.originalImage && initialImageUrl) {
    return <div>Error: Could not load initial image for automated processing.</div>;
  }
   if (directOutputMode && !isProcessing && imageData.originalImage) {
      // In direct output mode, once processing is done (isProcessing is false)
      // and onProcessingComplete should have been called by generateOutput,
      // this component has fulfilled its role for the automated flow.
      // AutomatedImageProcessor will handle navigation.
      return null; 
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Canvas</h2>
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <Button
                onClick={downloadImage}
                disabled={!imageData.processedImageUrl}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={resetImage}
                variant="outline"
                disabled={isProcessing}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 min-h-96 flex items-center justify-center">
            {imageData.processedImageUrl ? (
              <div className="w-full h-full overflow-hidden rounded-lg flex items-center justify-center"> 
                <img
                  src={imageData.processedImageUrl}
                  alt="Processed"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500 mb-4">
                  No image loaded. Upload an image or use a URL parameter.
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Choose Image'}
                </Button>
              </div>
            )}
          </div>
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </Card>
      </div>
      <div className="space-y-6">
        <ToolPanel /> 
        <PropertiesPanel
          editorState={editorState}
          onChange={setEditorState}
        />
      </div>
    </div>
  );
}
