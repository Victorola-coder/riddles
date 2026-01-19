import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer as TimerIcon } from 'lucide-react';
import clsx from 'clsx';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({
  timeLeft,
  totalTime,
  isActive,
  className,
}) => {
  // Calculate percentage for circular progress
  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 100;
  
  const isWarning = timeLeft <= 10 && totalTime > 0;
  const isCritical = timeLeft <= 5 && totalTime > 0;

  // Don't show numeric timer if it's infinite mode (totalTime = 0)
  if (totalTime === 0) return null;

  return (
    <div className={clsx("flex items-center gap-3", className)}>
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-muted/20"
            strokeWidth="3"
          />
          {/* Progress Circle */}
          <motion.circle
            initial={{ pathLength: 1 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 0.5, ease: "linear" }}
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className={clsx(
              "stroke-current transition-colors duration-300",
              isCritical ? "text-red-500" : isWarning ? "text-orange-500" : "text-primary"
            )}
            strokeWidth="3"
            strokeDasharray="100 100" 
            strokeLinecap="round"
          />
        </svg>
        
        {/* Timer Text inside */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={clsx(
            "text-sm font-bold",
            isWarning ? "text-red-500 animate-pulse" : "text-white"
          )}>
            {timeLeft}
          </span>
        </div>
      </div>
      
      <div className="hidden sm:flex flex-col">
        <span className={clsx(
          "text-xs font-medium uppercase tracking-wider",
          isWarning ? "text-red-500" : "text-[var(--text-muted)]"
        )}>
          Time Left
        </span>
      </div>
    </div>
  );
};
