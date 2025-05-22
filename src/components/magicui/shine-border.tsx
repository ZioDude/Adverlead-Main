'use client';

import { cn } from "@/lib/utils";
import React, { CSSProperties } from "react";

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  duration?: number;
  shineColor?: string | string[];
  borderWidth?: number;
  className?: string;
  containerClassName?: string;
}

export function ShineBorder({
  children,
  duration = 14,
  shineColor = "rgba(168, 85, 247, 0.4)", // More subtle purple
  borderWidth = 1,
  className,
  containerClassName,
  ...props
}: ShineBorderProps) {
  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm border border-white/5",
        containerClassName
      )}
      {...props}
    >
      {/* Shine effect container */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${shineColor}, transparent)`,
          transform: "translateX(-100%)",
          animation: `shine ${duration}s linear infinite`,
          opacity: 0.5,
        } as CSSProperties}
      />

      {/* Content container */}
      <div
        className={cn(
          "relative rounded-xl bg-transparent",
          className
        )}
      >
        {children}
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes shine {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
} 