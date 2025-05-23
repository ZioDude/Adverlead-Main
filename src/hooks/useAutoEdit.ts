// hooks/useAutoEdit.ts
'use client';

import { useState, useCallback } from 'react';
import { CanvasEditor } from '../services/canvasEditor'; // Ensure path is correct

interface AutoEditOptions {
  title?: string;
  subtitle?: string;
  logoUrl?: string;
  titleColor?: string;
  subtitleColor?: string;
  websiteText?: string;
  websiteTextColor?: string;
  overlayOpacity?: number;
  logoText?: string;
  logoTextColor?: string;
}

export const useAutoEdit = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const autoEditImage = useCallback(async (imageUrl: string, options: AutoEditOptions = {}) => {
    setIsEditing(true);
    setError(null);
    setEditedImage(null); // Clear previous image

    try {
      // Create a temporary canvas element in memory
      // This canvas is not added to the DOM, it's used purely for offscreen rendering
      const canvas = document.createElement('canvas');
      const editor = new CanvasEditor(canvas);
      
      // Apply default edits using the service
      const editedImageUrl = await editor.applyDefaultEdit(imageUrl, options);
      
      setEditedImage(editedImageUrl);
      return editedImageUrl; // Return for immediate use if needed
    } catch (err: any) {
      console.error('Auto-edit failed in useAutoEdit:', err);
      setError(err.message || 'An unknown error occurred during image editing.');
      throw err; // Re-throw to allow caller to handle
    } finally {
      setIsEditing(false);
    }
  }, []);

  return {
    isEditing,
    editedImage,
    error,
    autoEditImage,
    setError, // Allow manually setting error if needed from component
    setEditedImage // Allow manually clearing/setting image if needed
  };
};
