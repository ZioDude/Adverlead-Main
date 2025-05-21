'use client';

import { cn } from "@/lib/utils";
import React, { CSSProperties, FC, ReactNode } from "react";

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
}

const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
}) => {
  return (
    <p
      style={{
        "--shimmer-width": `${shimmerWidth}px`,
      } as CSSProperties}
      className={cn(
        "mx-auto max-w-md text-neutral-600/dark:text-neutral-400",
        // Shimmer effect
        "animate-shimmer bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%] dark:bg-[linear-gradient(110deg,transparent,45%,var(--primary),55%,transparent)]",
        className
      )}
    >
      {children}
    </p>
  );
};

export default AnimatedShinyText; 