// src/components/magicui/globe.tsx
'use client';

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { cn } from "@/lib/utils";

interface GlobeProps {
  className?: string;
}

export default function Globe({ className }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeInstanceRef = useRef<any>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const lastPhi = useRef(0); // Store the last phi from interaction
  const lastTheta = useRef(0.3); // Store the last theta from interaction

  useEffect(() => {
    let width = 0;
    let phi = lastPhi.current; // Start with last known phi
    let theta = lastTheta.current; // Start with last known theta
    let isInteracting = false;
    let animationFrameId: number;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
        if (globeInstanceRef.current) {
          globeInstanceRef.current.onResize();
        }
      }
    };

    window.addEventListener('resize', onResize);
    onResize();

    if (!canvasRef.current) return;

    const onPointerDown = (e: PointerEvent) => {
      isInteracting = true;
      pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
      canvasRef.current!.style.cursor = 'grabbing';
    };

    const onPointerUp = () => {
      isInteracting = false;
      pointerInteracting.current = null;
      canvasRef.current!.style.cursor = 'grab';
      // Save the current phi/theta when interaction stops
      if (globeInstanceRef.current) {
        lastPhi.current = globeInstanceRef.current.phi;
        lastTheta.current = globeInstanceRef.current.theta;
      }
    };

    const onPointerOut = () => {
      if (isInteracting) { // Only reset if actively interacting
        isInteracting = false;
        pointerInteracting.current = null;
        canvasRef.current!.style.cursor = 'grab';
        if (globeInstanceRef.current) {
          lastPhi.current = globeInstanceRef.current.phi;
          lastTheta.current = globeInstanceRef.current.theta;
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        const delta = e.clientX - pointerInteracting.current;
        pointerInteractionMovement.current = delta;
        phi = lastPhi.current + (delta / 200); // Adjust rotation sensitivity
        // Optionally, you could add theta (vertical) rotation here too
        // theta = lastTheta.current + ( (e.clientY - pointerInteractingY.current) / 200 );
      }
    };

    canvasRef.current.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvasRef.current.addEventListener('pointerout', onPointerOut);

    const baseColor: [number, number, number] = [0.5, 0.2, 0.8]; 
    const markerColor: [number, number, number] = [0.95, 0.1, 0.5];
    const glowColor: [number, number, number] = [0.5, 0.2, 0.8];

    globeInstanceRef.current = createGlobe(canvasRef.current, {
      devicePixelRatio: 1.5,
      width: width * 2,
      height: width * 2, // Keep it square for a sphere
      phi: phi,
      theta: theta,
      dark: 0.8,
      diffuse: 1.2,
      mapSamples: 20000,
      mapBrightness: 3.2,
      baseColor: baseColor,
      markerColor: markerColor,
      glowColor: glowColor,
      markers: [
        { location: [37.7749, -122.4194], size: 0.08 },
        { location: [40.7128, -74.0060], size: 0.08 },
        { location: [51.5074, 0.1278], size: 0.08 },
        { location: [35.6895, 139.6917], size: 0.08 },
        { location: [48.8566, 2.3522], size: 0.08 },
        { location: [-33.8688, 151.2093], size: 0.08 },
        { location: [55.7558, 37.6173], size: 0.08 },
        { location: [19.4326, -99.1332], size: 0.08 },
      ],
      onRender: (state) => {
        if (!isInteracting) {
          phi += 0.003; // Auto-rotate
        }
        state.phi = phi;
        state.theta = theta; // Keep theta, or update if vertical drag is added
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 100);

    return () => {
      if (globeInstanceRef.current) {
        globeInstanceRef.current.destroy();
      }
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('pointerdown', onPointerDown);
        canvasRef.current.removeEventListener('pointerout', onPointerOut);
      }
    };
  }, []);

  return (
    <div className={cn("relative w-full h-full flex items-center justify-center overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%", 
          cursor: "grab",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    </div>
  );
}