/**
 * Sound Manager for Riddle Quest
 * Handles all game sound effects with volume control and mute functionality
 */

type SoundType = 'success' | 'error' | 'hint' | 'gem' | 'achievement' | 'click';

class SoundManager {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;
  private volume: number = 0.5;

  constructor() {
    if (typeof window !== 'undefined') {
      // Load mute preference from localStorage
      const savedMute = localStorage.getItem('riddle-quest-sound-muted');
      this.isMuted = savedMute === 'true';

      const savedVolume = localStorage.getItem('riddle-quest-sound-volume');
      this.volume = savedVolume ? parseFloat(savedVolume) : 0.5;
    }
  }

  /**
   * Initialize sound files
   * Call this once when the app loads
   */
  init() {
    if (typeof window === 'undefined') return;

    const soundFiles: Record<SoundType, string> = {
      success: '/sounds/success.mp3',
      error: '/sounds/error.mp3',
      hint: '/sounds/hint.mp3',
      gem: '/sounds/gem.mp3',
      achievement: '/sounds/achievement.mp3',
      click: '/sounds/click.mp3',
    };

    Object.entries(soundFiles).forEach(([type, path]) => {
      const audio = new Audio(path);
      audio.volume = this.volume;
      audio.preload = 'auto';
      this.sounds.set(type as SoundType, audio);
    });
  }

  /**
   * Play a sound effect
   */
  play(type: SoundType) {
    if (this.isMuted || typeof window === 'undefined') return;

    const sound = this.sounds.get(type);
    if (sound) {
      // Clone the audio to allow overlapping sounds
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = this.volume;
      clone.play().catch(() => {
        // Silently fail if audio playback is blocked
      });
    }
  }

  /**
   * Toggle mute on/off
   */
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('riddle-quest-sound-muted', String(this.isMuted));
    }
    return this.isMuted;
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (typeof window !== 'undefined') {
      localStorage.setItem('riddle-quest-sound-volume', String(this.volume));
    }
    this.sounds.forEach((sound) => {
      sound.volume = this.volume;
    });
  }

  /**
   * Get current mute state
   */
  getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.volume;
  }
}

// Export singleton instance
export const soundManager = new SoundManager();
