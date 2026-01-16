'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../atoms';
import { Lightbulb, Eye, SkipForward } from 'lucide-react';
import { GAME_CONFIG } from '@/lib/constants/game-config';
import { hintPulseVariants } from '@/lib/constants/animations';

interface HintPanelProps {
  onHint1: () => void;
  onHint2: () => void;
  onReveal: () => void;
  onSkip: () => void;
  hint1Used: boolean;
  hint2Used: boolean;
  userGems: number;
  disabled?: boolean;
}

export const HintPanel: React.FC<HintPanelProps> = ({
  onHint1,
  onHint2,
  onReveal,
  onSkip,
  hint1Used,
  hint2Used,
  userGems,
  disabled = false,
}) => {
  const canAffordHint1 = userGems >= GAME_CONFIG.GEM_COSTS.hint1;
  const canAffordHint2 = userGems >= GAME_CONFIG.GEM_COSTS.hint2;
  const canAffordReveal = userGems >= GAME_CONFIG.GEM_COSTS.hint3;
  const canAffordSkip = userGems >= GAME_CONFIG.GEM_COSTS.skip;

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Hint 1 */}
      <motion.div
        variants={!hint1Used && canAffordHint1 ? hintPulseVariants : undefined}
        animate={!hint1Used && canAffordHint1 ? 'pulse' : undefined}
      >
        <Button
          variant="secondary"
          size="md"
          onClick={onHint1}
          disabled={disabled || hint1Used || !canAffordHint1}
          className="w-full"
        >
          <Lightbulb size={16} />
          <span className="hidden sm:inline">Hint</span>
          <span className="text-gold text-xs">-{GAME_CONFIG.GEM_COSTS.hint1}</span>
        </Button>
      </motion.div>

      {/* Hint 2 */}
      <Button
        variant="secondary"
        size="md"
        onClick={onHint2}
        disabled={disabled || hint2Used || !canAffordHint2}
        className="w-full"
      >
        <Lightbulb size={16} />
        <span className="hidden sm:inline">Length</span>
        <span className="text-gold text-xs">-{GAME_CONFIG.GEM_COSTS.hint2}</span>
      </Button>

      {/* Reveal */}
      <Button
        variant="danger"
        size="md"
        onClick={onReveal}
        disabled={disabled || !canAffordReveal}
        className="w-full"
      >
        <Eye size={16} />
        <span className="hidden sm:inline">Reveal</span>
        <span className="text-gold text-xs">-{GAME_CONFIG.GEM_COSTS.hint3}</span>
      </Button>

      {/* Skip */}
      <Button
        variant="ghost"
        size="md"
        onClick={onSkip}
        disabled={disabled || !canAffordSkip}
        className="w-full"
      >
        <SkipForward size={16} />
        <span className="hidden sm:inline">Skip</span>
        <span className="text-gold text-xs">-{GAME_CONFIG.GEM_COSTS.skip}</span>
      </Button>
    </div>
  );
};
