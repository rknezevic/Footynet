import { ReactNode } from 'react';
import UnifiedNavBar from '@/components/UnifiedNavBar';

// Common frame for logged-in pages: navbar + centred content column
export default function PageShell({ children, width = 'wide' }: { children: ReactNode; width?: 'wide' | 'narrow' | 'medium' }) {
  const max = width === 'narrow' ? 'max-w-3xl' : width === 'medium' ? 'max-w-5xl' : 'max-w-7xl';
  return (
    <div className="min-h-screen">
      <UnifiedNavBar />
      <main className={`mx-auto ${max} animate-fade-in-up px-4 py-8 sm:px-6 lg:px-8`}>
        {children}
      </main>
    </div>
  );
}
