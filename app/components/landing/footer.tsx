"use client";

import Link from "next/link";
import { Github, Heart, ExternalLink } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--border-default)] bg-[var(--bg-midnight)] mt-20 md:mt-32">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                🧩 Riddle Quest
              </span>
            </Link>
            <p className="text-base font-medium text-[var(--text-primary)]">
              Riddles, not jokes
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Riddle Quest is a gamified platform where you solve riddles, earn
              gems, and progress through difficulty levels. Test your wits and
              unlock new challenges!
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-2">
              <span>Made with</span>
              😠
              <span>by VickyJay</span>
            </div>
          </div>

          {/* Links Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Resources
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                href="https://github.com/Victorola-coder/riddles"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="https://github.com/Victorola-coder/riddles/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
              >
                <span>Contribute</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/game"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Play Game
              </Link>
              <Link
                href="/leaderboard"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Leaderboard
              </Link>
            </div>
          </div>

          {/* Legal Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Legal
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                href="https://github.com/Victorola-coder/riddles/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
              >
                <span>License</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="https://github.com/Victorola-coder/riddles/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
              >
                <span>Documentation</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border-default)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--text-secondary)] text-center md:text-left">
            © {currentYear} Riddle Quest. All wrongs reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-[var(--text-secondary)]">
            <span>Open Source</span>
            <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)]" />
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
