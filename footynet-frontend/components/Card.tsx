import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  className?: string;
}

export default function Card({ children, hover = false, className = '' }: CardProps) {
  return (
    <div className={`bg-white border border-neutral-200 rounded-lg p-8 ${hover ? 'hover-lift' : ''} ${className}`}>
      {children}
    </div>
  );
}
