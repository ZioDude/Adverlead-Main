'use client';

import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  maxOpacity?: number;
  duration?: number;
  numSquares?: number;
  className?: string;
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  maxOpacity = 0.5, // Adjusted for better visibility on dark theme
  duration = 3,
  numSquares = 8,  // Reduced for a less busy look
  className,
}: AnimatedGridPatternProps) {
  const columns = useMemo(() => {
    return Array(width).fill(0);
  }, [width]);
  const rows = useMemo(() => {
    return Array(height).fill(0);
  }, [height]);

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        "[mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]", // Softer fade at edges
        "animate-grid-fade-in", // Custom animation for fade-in
        className,
      )}
      style={{
        "--max-opacity": maxOpacity,
        "--duration": duration,
      } as React.CSSProperties}
    >
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 h-[200%] w-[200%]", // Make it larger to ensure coverage during animation
          "-translate-x-1/2 -translate-y-1/2",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox={`0 0 ${width} ${height}`}
          className="absolute left-1/2 top-1/2 h-full w-full"
          style={{
            transform: `translate(-50%, -50%)`,
          }}
        >
          <pattern
            id="grid-pattern"
            width={width / numSquares}
            height={height / numSquares}
            x="50%"
            y="50%"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(-${width / (numSquares * 2)}, -${height / (numSquares * 2)}) scale(1)`}
          >
            <rect
              width={width / numSquares}
              height={height / numSquares}
              className="fill-[--grid-color,theme(colors.primary/0.2)] opacity-0 transition-opacity duration-[var(--duration,3s)] ease-in-out [animation-delay:calc(var(--delay)*100ms)] [animation-duration:calc(var(--duration,3s)*1000ms)] [animation-name:fade-in]"
              style={{ "--delay": Math.floor(Math.random() * numSquares * numSquares) } as React.CSSProperties} // Random delay
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
    </div>
  );
}

export default AnimatedGridPattern; 