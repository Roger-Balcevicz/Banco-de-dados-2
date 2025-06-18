
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export function Loading({ size = 'md', message = 'Carregando...', className }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  const hatSizeClasses = {
    sm: 'h-4 w-4 mt-1',
    md: 'h-8 w-8 mt-2',
    lg: 'h-12 w-12 mt-3'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-4 border-orange-600 border-t-transparent mx-auto mb-4 relative",
        sizeClasses[size]
      )}>
        {/* Chapéu de Chef */}
        <div className={cn(
          "bg-orange-600 rounded-full mx-auto relative animate-bounce",
          hatSizeClasses[size]
        )}>
          {/* Base do chapéu */}
          <div className="absolute inset-1 bg-white rounded-full"></div>
          {/* Topo do chapéu */}
          <div className={cn(
            "absolute top-0 left-1/2 transform -translate-x-1/2 bg-orange-600 rounded-t",
            size === 'sm' ? 'w-1 h-2' : size === 'md' ? 'w-2 h-3' : 'w-3 h-4'
          )}></div>
          {/* Dobra do chapéu */}
          <div className={cn(
            "absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-orange-700 rounded-b",
            size === 'sm' ? 'w-5 h-1' : size === 'md' ? 'w-10 h-2' : 'w-14 h-3'
          )}></div>
        </div>
      </div>
      <p className={cn(
        "text-gray-600 animate-pulse font-medium",
        textSizeClasses[size]
      )}>
        {message}
      </p>
    </div>
  );
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("animate-spin rounded-full h-6 w-6 border-2 border-orange-600 border-t-transparent", className)} />
  );
}

export function ChefHatIcon({ className, animate = true }: { className?: string, animate?: boolean }) {
  return (
    <div className={cn(
      "relative inline-block",
      animate && "animate-bounce",
      className
    )}>
      {/* Base do chapéu */}
      <div className="w-8 h-8 bg-white rounded-full border-2 border-orange-600 relative">
        {/* Topo do chapéu */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-white border-2 border-orange-600 rounded-t"></div>
        {/* Dobra do chapéu */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-orange-600 rounded-b"></div>
      </div>
    </div>
  );
}
