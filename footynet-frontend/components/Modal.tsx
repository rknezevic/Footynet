'use client';

import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

interface ModalProps {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg';
}

export default function Modal({ title, onClose, children, footer, size = 'md' }: ModalProps) {
  const t = useTranslations('common');

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Rendered into <body> so no transformed/filtered ancestor can clip or offset the overlay
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={`flex max-h-[90vh] w-full animate-fade-in-up flex-col rounded-2xl bg-white shadow-lift ${size === 'lg' ? 'max-w-2xl' : 'max-w-lg'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-ink-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-900" aria-label={t('close')}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-ink-100 px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
