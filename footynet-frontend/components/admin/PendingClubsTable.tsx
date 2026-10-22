'use client';

import { useTranslations } from 'next-intl';
import { Check, X } from 'lucide-react';
import { PendingClubDto } from '@/types';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';

interface PendingClubsTableProps {
  clubs: PendingClubDto[];
  actioningId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

// Shared by the admin dashboard and the pending clubs page
export default function PendingClubsTable({ clubs, actioningId, onApprove, onReject }: PendingClubsTableProps) {
  const t = useTranslations('adminClubs');

  return (
    <div className="-mx-6 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-xs uppercase tracking-wider text-ink-500">
            <th className="px-6 pb-3 font-semibold">{t('name')}</th>
            <th className="px-6 pb-3 font-semibold">{t('league')}</th>
            <th className="px-6 pb-3 font-semibold">{t('city')}</th>
            <th className="px-6 pb-3 text-right font-semibold">{t('actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {clubs.map(club => (
            <tr key={club.id} className="transition-colors hover:bg-ink-50/60">
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={club.name} size="sm" />
                  <div>
                    <p className="font-semibold text-ink-900">{club.name}</p>
                    <p className="text-xs text-ink-500">{club.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-3 text-ink-600">{club.leagueName}</td>
              <td className="px-6 py-3 text-ink-600">{club.city}</td>
              <td className="px-6 py-3">
                <div className="flex justify-end gap-2">
                  <Button size="sm" onClick={() => onApprove(club.id)} disabled={actioningId === club.id}><Check className="h-3.5 w-3.5" />{t('approve')}</Button>
                  <Button size="sm" variant="danger" onClick={() => onReject(club.id)} disabled={actioningId === club.id}><X className="h-3.5 w-3.5" />{t('reject')}</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
