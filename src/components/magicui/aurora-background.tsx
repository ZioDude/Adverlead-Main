'use client';

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  showRadialGradient?: boolean;
  className?: string;
}

export const AuroraBackground = ({
  className,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[-1] overflow-hidden transition-bg",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          `bg-gradient-to-br from-accent/90 via-primary/70 to-secondary/60 opacity-80 animate-pulse`,
          `absolute inset-0 w-full h-full will-change-transform`,
          showRadialGradient &&
          `[mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]`
        )}
      ></div>
    </div>
  );
}; 