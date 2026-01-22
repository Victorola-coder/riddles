import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

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
  // Don't show numeric timer if it's infinite mode (totalTime = 0)
  if (totalTime === 0) return null;

  // Clamp to keep rendering stable even if state briefly goes out of bounds.
  const clampedTimeLeft = Math.max(0, Math.min(timeLeft, totalTime));
  const percentage = totalTime > 0 ? (clampedTimeLeft / totalTime) * 100 : 100;
  const isWarning = clampedTimeLeft <= 10 && totalTime > 0;
  const isCritical = clampedTimeLeft <= 5 && totalTime > 0;

  // SVG circle math (r=16 matches viewBox 0..36 with padding)
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percentage / 100);

  return (
    <div className={clsx("flex items-center gap-3", className)}>
      <div className="relative flex h-12 w-12 items-center justify-center">
        {/* Background Circle */}
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 36 36"
          aria-hidden="true"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-white/15"
            strokeWidth="3"
          />
          {/* Progress Circle */}
          <motion.circle
            initial={false}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.35, ease: "linear" }}
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className={clsx(
              "stroke-current transition-colors duration-300",
              !isActive
                ? "text-white/30"
                : isCritical
                  ? "text-red-500"
                  : isWarning
                    ? "text-orange-500"
                    : "text-primary"
            )}
            strokeWidth="3"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Timer Text inside */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={clsx(
              "text-sm font-bold tabular-nums",
              !isActive
                ? "text-white/60"
                : isWarning
                  ? "text-red-500 animate-pulse"
                  : "text-white"
            )}
          >
            {clampedTimeLeft}
          </span>
        </div>
      </div>
      
      <div className="hidden sm:flex flex-col">
        <span
          className={clsx(
            "text-xs font-medium uppercase tracking-wider",
            isWarning ? "text-red-500" : "text-[var(--text-muted)]"
          )}
        >
          Time Left
        </span>
      </div>
    </div>
  );
};
