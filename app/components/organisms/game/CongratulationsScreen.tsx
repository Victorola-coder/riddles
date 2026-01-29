'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Crown,
  Gem,
  Flame,
  Star,
  Sparkles,
  RotateCcw,
  ShoppingBag,
  Medal,
  Zap,
  ChevronRight,
} from 'lucide-react';

interface CongratulationsScreenProps {
  totalSolved: number;
  totalGems: number;
  currentStreak?: number;
  onPlayAgain?: () => void;
}

const CONFETTI_COLORS = ['#8b5cf6', '#fbbf24', '#10b981', '#ec4899', '#06b6d4'];

export const CongratulationsScreen: React.FC<CongratulationsScreenProps> = ({
  totalSolved,
  totalGems,
  currentStreak = 0,
  onPlayAgain,
}) => {
  const hasConfettiFired = useRef(false);

  // Fire confetti celebration on mount
  useEffect(() => {
    if (hasConfettiFired.current) return;
    hasConfettiFired.current = true;

    const duration = 4000;
    const animationEnd = Date.now() + duration;

    const fireConfetti = () => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return;

      const particleCount = 50 * (timeLeft / duration);

      // Fire from both sides
      confetti({
        particleCount: Math.floor(particleCount / 2),
        startVelocity: 30,
        spread: 60,
        origin: { x: 0.1, y: 0.6 },
        colors: CONFETTI_COLORS,
        ticks: 200,
      });
      confetti({
        particleCount: Math.floor(particleCount / 2),
        startVelocity: 30,
        spread: 60,
        origin: { x: 0.9, y: 0.6 },
        colors: CONFETTI_COLORS,
        ticks: 200,
      });

      requestAnimationFrame(fireConfetti);
    };

    // Initial burst from center
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors: CONFETTI_COLORS,
      ticks: 300,
    });

    setTimeout(fireConfetti, 500);
  }, []);

  const stats = [
    {
      icon: Zap,
      label: 'Riddles Solved',
      value: totalSolved,
      color: 'text-[var(--accent-primary)]',
      bgColor: 'bg-[var(--accent-primary)]/20',
    },
    {
      icon: Gem,
      label: 'Total Gems',
      value: totalGems.toLocaleString(),
      color: 'text-[var(--accent-secondary)]',
      bgColor: 'bg-[var(--accent-secondary)]/20',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: currentStreak,
      color: 'text-[#f59e0b]',
      bgColor: 'bg-[#f59e0b]/20',
    },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-full max-w-2xl"
      >
        {/* Main Card */}
        <div className="relative glass-card p-8 md:p-12 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 via-transparent to-[var(--accent-secondary)]/10 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.15),transparent_50%)] pointer-events-none" />

          {/* Floating Sparkles */}
          <motion.div
            className="absolute top-6 right-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="text-[var(--accent-secondary)]/30" size={32} />
          </motion.div>
          <motion.div
            className="absolute bottom-6 left-6"
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            <Star className="text-[var(--accent-primary)]/30" size={24} />
          </motion.div>

          <div className="relative z-10">
            {/* Trophy Animation */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] blur-3xl opacity-40 scale-150" />

                {/* Trophy Container */}
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[var(--accent-secondary)]/30 to-[var(--accent-primary)]/30 flex items-center justify-center border-2 border-[var(--accent-secondary)]/50"
                >
                  <Trophy className="text-[var(--accent-secondary)] w-14 h-14 md:w-20 md:h-20" />
                </motion.div>

                {/* Crown */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2"
                >
                  <Crown className="text-[var(--accent-secondary)] w-10 h-10 md:w-12 md:h-12" />
                </motion.div>

                {/* Medals */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}
                  className="absolute -left-4 top-1/2 -translate-y-1/2"
                >
                  <Medal className="text-[#94a3b8] w-8 h-8" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: 'spring', stiffness: 300 }}
                  className="absolute -right-4 top-1/2 -translate-y-1/2"
                >
                  <Medal className="text-[#f59e0b] w-8 h-8" />
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-cinzel font-bold bg-gradient-to-r from-[var(--accent-secondary)] via-[var(--text-primary)] to-[var(--accent-primary)] bg-clip-text text-transparent mb-3">
                Congratulations!
              </h1>
              <p className="text-lg md:text-xl text-[var(--text-secondary)] font-inter">
                You've conquered every riddle!
              </p>
            </motion.div>

            {/* Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-32 h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent mx-auto mb-8"
            />

            {/* Stats Grid */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-[var(--bg-card)] backdrop-blur-xl rounded-xl p-4 border border-[var(--border-default)] text-center"
                >
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <stat.icon className={stat.color} size={20} />
                  </div>
                  <div className={`text-2xl md:text-3xl font-cinzel font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] font-inter">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Achievement Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 rounded-xl p-4 mb-8 border border-[var(--accent-primary)]/20"
            >
              <p className="text-center text-[var(--text-secondary)] font-inter">
                You've proven yourself a true <span className="text-[var(--accent-secondary)] font-semibold">Riddle Master</span>!
                Check back soon for new challenges.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              {onPlayAgain && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onPlayAgain}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl font-inter font-semibold shadow-lg shadow-[var(--accent-primary)]/30 hover:shadow-xl hover:shadow-[var(--accent-primary)]/40 transition-shadow"
                >
                  <RotateCcw size={20} />
                  Play Again
                </motion.button>
              )}

              <Link href="/leaderboard" className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] rounded-xl font-inter font-semibold hover:border-[var(--accent-primary)]/50 transition-colors"
                >
                  <Trophy size={20} />
                  Leaderboard
                  <ChevronRight size={18} className="text-[var(--text-muted)]" />
                </motion.div>
              </Link>

              <Link href="/shop" className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-primary)] rounded-xl font-inter font-semibold hover:border-[var(--accent-secondary)]/50 transition-colors"
                >
                  <ShoppingBag size={20} />
                  Shop
                  <ChevronRight size={18} className="text-[var(--text-muted)]" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom Tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-[var(--text-muted)] text-sm font-inter mt-6"
        >
          New riddles are added regularly. Stay tuned!
        </motion.p>
      </motion.div>
    </div>
  );
};
