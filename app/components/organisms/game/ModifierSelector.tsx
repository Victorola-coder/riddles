"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EyeOff, Timer, RotateCcw, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { DIFFICULTY_MODIFIERS, type ModifierKey } from "@/lib/constants/difficulty-modifiers";

const iconMap = {
  EyeOff,
  Timer,
  RotateCcw,
} as const;

interface ModifierSelectorProps {
  activeModifier: ModifierKey | null;
  onSelect: (modifier: ModifierKey | null) => void;
  disabled?: boolean;
}

export const ModifierSelector: React.FC<ModifierSelectorProps> = ({
  activeModifier,
  onSelect,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const modifiers = Object.entries(DIFFICULTY_MODIFIERS) as [ModifierKey, typeof DIFFICULTY_MODIFIERS[ModifierKey]][];

  return (
    <div className="glass-card p-3">
      {/* Toggle Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm font-inter text-[var(--text-secondary)] hover:text-white transition-colors"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[var(--accent-secondary)]" />
          <span className="font-medium">
            {activeModifier
              ? `Modifier: ${DIFFICULTY_MODIFIERS[activeModifier].label} (${DIFFICULTY_MODIFIERS[activeModifier].gemMultiplier}x gems)`
              : "Challenge Modifiers"}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* Modifier Options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-2 mt-3">
              {modifiers.map(([key, mod]) => {
                const Icon = iconMap[mod.icon as keyof typeof iconMap];
                const isActive = activeModifier === key;

                return (
                  <button
                    key={key}
                    onClick={() => onSelect(isActive ? null : key)}
                    disabled={disabled}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center ${
                      isActive
                        ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-white"
                        : "border-[var(--border-default)] bg-transparent text-[var(--text-muted)] hover:border-[var(--accent-primary)]/50 hover:text-white"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span className="text-xs font-medium">{mod.label}</span>
                    <span className="text-[10px] text-[var(--accent-secondary)] font-semibold">
                      {mod.gemMultiplier}x gems
                    </span>
                  </button>
                );
              })}
            </div>
            {activeModifier && (
              <p className="text-xs text-[var(--text-muted)] mt-2 text-center font-inter">
                {DIFFICULTY_MODIFIERS[activeModifier].description}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
