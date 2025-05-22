'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ShinyBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  borderWidth?: number;
  duration?: number;
  className?: string;
  containerClassName?: string;
}

export function ShinyBorder({
  children,
  borderWidth = 1,
  duration = 2,
  className,
  containerClassName,
  ...props
}: ShinyBorderProps) {
  return (
    <div
      className={cn(
        'group relative rounded-lg p-[1px] overflow-hidden',
        containerClassName
      )}
      style={{
        background: `linear-gradient(
          var(--border-angle, 0deg),
          hsl(var(--primary)),
          transparent 40%
        )`,
      }}
      {...props}
    >
      <style jsx>{`
        @property --border-angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        @keyframes rotate {
          to {
            --border-angle: 360deg;
          }
        }
      `}</style>
      <div
        className={cn(
          'relative rounded-lg bg-background',
          className
        )}
        style={{
          animation: `rotate ${duration}s linear infinite`,
        }}
      >
        {children}
      </div>
    </div>
  );
} 