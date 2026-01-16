import { Variants } from 'framer-motion';

// Success animations
export const successVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    scale: 1.2,
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

// Error shake animation
export const shakeVariants: Variants = {
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },
};

// Gem counter animation
export const gemCounterVariants: Variants = {
  increment: {
    scale: [1, 1.3, 1],
    color: ['#fbbf24', '#fde047', '#fbbf24'],
    transition: { duration: 0.5 },
  },
  decrement: {
    scale: [1, 0.9, 1],
    color: ['#fbbf24', '#ef4444', '#fbbf24'],
    transition: { duration: 0.5 },
  },
};

// Hint button pulse
export const hintPulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    boxShadow: [
      '0 0 0 0 rgba(139, 92, 246, 0.7)',
      '0 0 0 10px rgba(139, 92, 246, 0)',
      '0 0 0 0 rgba(139, 92, 246, 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

// Card entrance
export const cardEntranceVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// Fade in/out
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Letter slot fill animation
export const letterSlotVariants: Variants = {
  empty: {
    borderColor: 'rgba(139, 92, 246, 0.3)',
    backgroundColor: 'rgba(30, 30, 30, 0.5)',
  },
  filled: {
    borderColor: 'rgba(139, 92, 246, 0.8)',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    scale: [1, 1.1, 1],
    transition: { duration: 0.2 },
  },
  correct: {
    borderColor: 'rgba(16, 185, 129, 0.8)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    scale: [1, 1.15, 1],
    transition: { duration: 0.3 },
  },
  incorrect: {
    borderColor: 'rgba(239, 68, 68, 0.8)',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
};
