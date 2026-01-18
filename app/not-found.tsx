'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HelpCircle, Home, Play, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-midnight)] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[var(--bg-midnight)]" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-8"
        >
          {/* Large 404 with riddle theme */}
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-8xl md:text-9xl font-bold font-cinzel bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent"
            >
              404
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-4 -right-4 md:-top-8 md:-right-8"
            >
              <HelpCircle className="w-16 h-16 md:w-24 md:h-24 text-[var(--accent-primary)] opacity-30" />
            </motion.div>
          </div>

          {/* Riddle-themed message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-cinzel text-[var(--text-primary)]">
              This Page is a Mystery
            </h2>
            <div className="bg-[var(--bg-card)] backdrop-blur-sm border border-[var(--border-default)] rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
              <p className="text-lg md:text-xl text-[var(--text-primary)] font-inter mb-4">
                <span className="text-[var(--accent-primary)] font-semibold">I speak without a page,</span>
                <br />
                <span className="text-[var(--accent-secondary)] font-semibold">I exist without a route.</span>
                <br />
                <span className="text-[var(--text-secondary)]">What am I?</span>
              </p>
              <p className="text-[var(--text-muted)] text-sm md:text-base font-inter italic">
                (Answer: A 404 error)
              </p>
            </div>
            <p className="text-[var(--text-secondary)] text-base md:text-lg font-inter max-w-xl mx-auto">
              The page you're looking for seems to have vanished like a solved riddle.
              Let's get you back to the real challenges!
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-8"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-midnight)] rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-2 text-sm md:text-base"
              >
                <Home size={18} />
                <span>Back Home</span>
              </motion.button>
            </Link>
            <Link href="/game">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[var(--bg-midnight)] rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-2 text-sm md:text-base"
              >
                <Play size={18} />
                <span>Play Riddles</span>
                <ArrowRight size={16} />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
