import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader } from '../global';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className,
  ...props
}) => {
  const baseStyles = 'font-inter font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-purple text-white hover:bg-purple-dark glow-purple hover:glow-purple-strong',
    secondary: 'bg-midnight-light text-white border border-[var(--border-default)] hover:border-[var(--border-focus)] hover:glow-purple',
    danger: 'bg-[var(--accent-danger)] text-white hover:bg-red-600',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:text-white hover:bg-midnight-light',
    outline: 'bg-transparent border-2 border-purple text-purple hover:bg-purple hover:text-white',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading ? <Loader size="small" /> : children}
    </motion.button>
  );
};
