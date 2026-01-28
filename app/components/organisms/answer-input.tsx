'use client';

import React, { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../atoms';
import { Send } from 'lucide-react';
import { shakeVariants } from '@/lib/constants/animations';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  showError?: boolean;
  placeholder?: string;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  onSubmit,
  disabled = false,
  showError = false,
  placeholder = 'Type your answer...',
}) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer.trim());
      setAnswer('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled) {
      handleSubmit();
    }
  };

  return (
    <motion.div
      className="w-full flex flex-col sm:flex-row gap-3"
      variants={showError ? shakeVariants : undefined}
      animate={showError ? 'shake' : undefined}
    >
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-lg font-inter text-base sm:text-lg
          bg-midnight-light text-white
          border-2 transition-all duration-200
          focus:outline-none focus:ring-0
          disabled:opacity-50 disabled:cursor-not-allowed
          placeholder:text-[var(--text-muted)]
          ${
            showError
              ? 'border-[var(--accent-danger)] bg-red-500/10'
              : 'border-[var(--border-default)] focus:border-[var(--border-focus)] focus:glow-purple'
          }
        `}
      />
      <Button
        variant="primary"
        size="lg"
        onClick={handleSubmit}
        disabled={disabled || !answer.trim()}
        className="w-full sm:w-auto px-6 sm:px-8"
      >
        <Send size={20} />
        Submit
      </Button>
    </motion.div>
  );
};
