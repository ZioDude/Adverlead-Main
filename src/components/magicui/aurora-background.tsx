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
          `bg-gradient-to-br from-accent/70 via-primary/50 to-secondary/30 opacity-60 animate-pulse`,
          `absolute -inset-x-1/4 -inset-y-1/4 will-change-transform`,
          showRadialGradient &&
          `[mask-image:radial-gradient(ellipse_at_30%_30%,black_0%,transparent_70%)]`
        )}
      ></div>
    </div>
  );
}; 