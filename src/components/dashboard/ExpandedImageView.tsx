'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Image from 'next/image';

interface ExpandedImageViewProps {
  src: string;
  onClose: () => void;
}

export default function ExpandedImageView({ src, onClose }: ExpandedImageViewProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const handlePointerDownCapture = (e: PointerEvent) => {
      if (e.target === overlayRef.current || closeButtonRef.current?.contains(e.target as Node)) {
        e.stopPropagation();
      }
    };

    overlay.addEventListener('pointerdown', handlePointerDownCapture, true); // Capture phase

    return () => {
      overlay.removeEventListener('pointerdown', handlePointerDownCapture, true);
    };
  }, []); // Empty dependency array, runs once

  const handleBackdropClick = (e: React.MouseEvent) => {
    // e.stopPropagation() is no longer strictly needed here for the original problem,
    // but good practice to keep if other listeners might be on the overlay.
    // The pointerdown capture listener already stops propagation to the document.
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCloseClick = (_e: React.MouseEvent) => {
    // e.stopPropagation() is no longer strictly needed here for the original problem.
    // The pointerdown capture listener already stops propagation to the document.
    onClose();
  };

  const handleImageContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-background/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <button
        ref={closeButtonRef}
        className="absolute top-4 right-4 z-[1000] rounded-full p-2 bg-background/50 backdrop-blur-sm hover:bg-background/80"
        onClick={handleCloseClick}
      >
        <X className="h-6 w-6" />
      </button>
      <div
        className="relative max-h-[90vh] max-w-[90vw] p-4"
        onClick={handleImageContainerClick}
      >
        <Image
          src={src}
          alt="Expanded view"
          width={1920}
          height={1080}
          className="rounded-lg object-contain"
          style={{ maxHeight: '85vh', width: 'auto', height: 'auto' }}
          priority
          quality={100}
        />
      </div>
    </div>,
    document.body
  );
} 