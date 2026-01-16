'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GitHubButtonProps {
  size?: 'sm' | 'md';
}

const GitHubButton = ({ size = 'md' }: GitHubButtonProps) => {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const res = await fetch(
          'https://api.github.com/repos/Victorola-coder/riddles'
        );
        if (res.ok) {
          const data = await res.json();
          setStars(data.stargazers_count);
        }
      } catch {
        // Silently fail
      }
    };
    fetchStars();
  }, []);

  const formatStars = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return count.toString();
  };

  const isSmall = size === 'sm';

  return (
    <a
      href="https://github.com/Victorola-coder/riddles"
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:scale-105 ${
        isSmall ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'
      }`}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
      <svg
        className="relative z-10 text-white/80 transition-colors group-hover:text-white"
        width={isSmall ? 16 : 20}
        height={isSmall ? 16 : 20}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
      <span className="relative z-10 font-medium text-white/80 transition-colors group-hover:text-white">
        Star
      </span>
      {stars !== null && (
        <>
          <div className="h-4 w-px bg-white/20" />
          <div className="relative z-10 flex items-center gap-1">
            <Star
              className="text-yellow-400 fill-yellow-400"
              size={isSmall ? 12 : 14}
            />
            <span className="font-semibold text-white/90 tabular-nums">
              {formatStars(stars)}
            </span>
          </div>
        </>
      )}
    </a>
  );
};

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#000000] py-4'
          : 'bg-transparent py-6'
      }`}
      style={{ boxShadow: 'none', filter: 'none' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            className={`font-bold bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent transition-all ${
              scrolled ? 'text-2xl' : 'text-3xl'
            }`}
          >
            🧩 Riddle Quest
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <Link
            href="https://github.com/Victorola-coder/riddles"
            target="_blank"
            className="hover:text-white transition-colors"
          >
            GitHub
          </Link>
          <Link
            href="https://github.com/Victorola-coder/riddles/blob/main/CONTRIBUTING.md"
            target="_blank"
            className="hover:text-white transition-colors"
          >
            Contribute
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <GitHubButton size="sm" />
          </div>
          <Link
            href="/game"
            className="hidden md:flex px-5 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors items-center gap-2 text-sm"
          >
            Play Game
          </Link>

          {!mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-[#000000] z-[60]"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <span className="text-2xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
                  🧩 Riddle Quest
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white/60 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col h-[calc(100%-80px)] px-6 pb-8">
              <div className="flex flex-col gap-2 flex-1">
                <Link
                  href="https://github.com/Victorola-coder/riddles"
                  target="_blank"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white transition-colors py-4 text-2xl font-medium border-b border-white/10"
                >
                  GitHub
                </Link>
                <Link
                  href="https://github.com/Victorola-coder/riddles/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white transition-colors py-4 text-2xl font-medium border-b border-white/10"
                >
                  Contribute
                </Link>
              </div>

              <div className="mt-auto pt-6 space-y-4">
                <div className="flex justify-center">
                  <GitHubButton size="md" />
                </div>
                <Link
                  href="/game"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full px-6 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  Play Game
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
