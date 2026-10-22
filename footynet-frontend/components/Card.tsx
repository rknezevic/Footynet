import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  className?: string;
  // Optional header row with a title (and optional action on the right)
  title?: ReactNode;
  action?: ReactNode;
}

export default function Card({ children, hover = false, className = '', title, action }: CardProps) {
  return (
    <div className={`rounded-2xl border border-ink-200/70 bg-white p-6 shadow-card ${hover ? 'hover-lift' : ''} ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-4">
          {title && <h3 className="eyebrow">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
