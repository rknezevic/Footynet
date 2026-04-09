import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}

export default function Button({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }: ButtonProps) {
  const baseStyles = 'px-5 py-2.5 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-700 disabled:hover:bg-neutral-900',
    secondary: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:hover:bg-transparent',
    danger: 'border border-red-300 text-red-600 hover:bg-red-50 disabled:hover:bg-transparent'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
