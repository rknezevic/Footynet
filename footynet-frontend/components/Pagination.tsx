'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/Button';

// Renders nothing when everything fits on one page
export default function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  const t = useTranslations('common');
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <Button variant="secondary" size="sm" onClick={() => onChange(page - 1)} disabled={page <= 1}>
        <ChevronLeft className="h-4 w-4" />{t('previous')}
      </Button>
      <span className="text-sm text-ink-500">{t('pageOf', { page, totalPages })}</span>
      <Button variant="secondary" size="sm" onClick={() => onChange(page + 1)} disabled={page >= totalPages}>
        {t('next')}<ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
