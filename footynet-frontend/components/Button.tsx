import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const VARIANTS = {
  primary: 'bg-pitch-600 text-white shadow-sm shadow-pitch-600/20 hover:bg-pitch-700 active:bg-pitch-800',
  secondary: 'bg-white text-ink-700 border border-ink-200 shadow-sm hover:bg-ink-50 hover:border-ink-300',
  danger: 'bg-white text-red-600 border border-red-200 shadow-sm hover:bg-red-50 hover:border-red-300',
  ghost: 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-base gap-2',
};

export default function Button({ children, onClick, type = 'button', variant = 'primary', size = 'md', className = '', disabled = false }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-pitch-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </button>
  );
}
