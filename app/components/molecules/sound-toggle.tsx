'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '@/lib/utils/sound-manager';

interface SoundToggleProps {
  size?: 'sm' | 'md' | 'lg';
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ size = 'md' }) => {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Initialize sound manager and get mute state
    soundManager.init();
    setIsMuted(soundManager.getMuted());
  }, []);

  const handleToggle = () => {
    const newMutedState = soundManager.toggleMute();
    setIsMuted(newMutedState);
    
    // Play a test sound when unmuting
    if (!newMutedState) {
      soundManager.play('click');
    }
  };

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
      title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {isMuted ? (
        <VolumeX 
          size={iconSize} 
          className="text-white/60 group-hover:text-white transition-colors" 
        />
      ) : (
        <Volume2 
          size={iconSize} 
          className="text-purple group-hover:text-purple-light transition-colors" 
        />
      )}
    </button>
  );
};
