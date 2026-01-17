'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../global/theme-provider';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 'md' }) => {
  const { theme, toggleTheme } = useTheme();
  
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      <div className="relative z-10">
        {theme === 'dark' ? (
          <Sun 
            size={iconSize} 
            className="text-yellow-400 group-hover:scale-110 transition-transform" 
          />
        ) : (
          <Moon 
            size={iconSize} 
            className="text-purple-600 group-hover:scale-110 transition-transform" 
          />
        )}
      </div>
    </button>
  );
};
