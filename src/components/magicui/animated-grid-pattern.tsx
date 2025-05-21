'use client';

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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
  maxOpacity = 0.5,
  duration = 3,
  numSquares = 8,
  className,
}: AnimatedGridPatternProps) {
  const [clientDelay, setClientDelay] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Generate a single random delay for the pattern on the client
    setClientDelay(Math.floor(Math.random() * numSquares * numSquares));
  }, [numSquares]); // Re-calc if numSquares changes

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        "[mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]",
        "animate-grid-fade-in",
        className,
      )}
      style={{
        "--max-opacity": maxOpacity,
        "--duration": duration,
      } as React.CSSProperties}
    >
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 h-[200%] w-[200%]",
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
              className="fill-[--grid-color,theme(colors.primary/0.2)] opacity-0 transition-opacity duration-[var(--duration,3s)] ease-in-out [animation-delay:calc(var(--delay,0)*100ms)] [animation-duration:calc(var(--duration,3s)*1000ms)] [animation-name:fade-in]"
              // Only set the --delay CSS variable on the client after mount
              style={isClient ? { "--delay": clientDelay } as React.CSSProperties : { "--delay": 0 } as React.CSSProperties}
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
    </div>
  );
}

export default AnimatedGridPattern; 