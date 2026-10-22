'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminService } from '@/lib/admin';
import { AdminUserDto, PaginatedResult, RoleType } from '@/types';
import UnifiedNavBar from '@/components/UnifiedNavBar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEnumLabels } from '@/i18n/useEnumLabels';

const PAGE_SIZE = 10;

// labelKey is looked up in the "enums.roles" namespace ("All" has its own key)
const ROLE_OPTIONS = [
  { labelKey: 'All', value: '' },
  { labelKey: 'Player', value: String(RoleType.Player) },
  { labelKey: 'Club', value: String(RoleType.Club) },
];

export default function AdminUsers() {
  const [data, setData] = useState<PaginatedResult<AdminUserDto> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('adminUsers');
  const tCommon = useTranslations('common');
  const labels = useEnumLabels();

  const loadUsers = useCallback(async (p: number, s: string, r: string) => {
    try {
      setError('');
      const role = r !== '' ? Number(r) : undefined;
      const result = await adminService.getUsers(s || undefined, role, p, PAGE_SIZE);
      setData(result);
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      if (status === 401 || status === 403) {
        router.push('/login');
      } else {
        setError(t('loadFailed'));
      }
    }
  }, [router]);

  useEffect(() => {
    loadUsers(page, search, roleFilter);
  }, [page, search, roleFilter, loadUsers]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    setPage(1);
  };

  const handleDeactivate = async (id: string) => {
    setActioningId(id);
    try {
      await adminService.deactivateUser(id);
      await loadUsers(page, search, roleFilter);
    } catch {
      setError(t('deactivateFailed'));
    } finally {
      setActioningId(null);
    }
  };

  const handleReactivate = async (id: string) => {
    setActioningId(id);
    try {
      await adminService.reactivateUser(id);
      await loadUsers(page, search, roleFilter);
    } catch {
      setError(t('reactivateFailed'));
    } finally {
      setActioningId(null);
    }
  };

  if (error && !data) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <UnifiedNavBar />
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="bg-red-50 border-l-2 border-red-500 px-3 py-2 text-sm text-red-700 rounded-r">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-sm text-neutral-400">{tCommon('loading')}</div>;

  const { items, totalPages } = data;

  return (
    <div className="min-h-screen bg-neutral-50">
      <UnifiedNavBar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <PageHeader title={t('title')} subtitle={t('subtitle')} />

        {error && (
          <div className="bg-red-50 border-l-2 border-red-500 px-3 py-2 text-sm text-red-700 rounded-r mb-6">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 max-w-xs px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-400 bg-white text-neutral-900 placeholder-neutral-400"
          />
          <select
            value={roleFilter}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-400 bg-white text-neutral-700"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.value === '' ? t('allRoles') : labels.role(opt.labelKey)}
              </option>
            ))}
          </select>
        </div>

        <Card>
          {items.length === 0 ? (
            <p className="text-sm text-neutral-500">{t('empty')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide">{t('email')}</th>
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide">{t('role')}</th>
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide">{t('status')}</th>
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide text-right">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.filter((user) => user.role !== 'Admin').map((user) => (
                    <tr key={user.id} className="border-b border-neutral-100 last:border-0">
                      <td className="py-4 text-neutral-900 font-medium">{user.email}</td>
                      <td className="py-4 text-neutral-600">{labels.role(user.role)}</td>
                      <td className="py-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                            user.isActive
                              ? 'bg-green-50 text-green-700'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          {user.isActive ? t('active') : t('inactive')}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {user.isActive ? (
                          <Button
                            variant="danger"
                            onClick={() => handleDeactivate(user.id)}
                            disabled={actioningId === user.id}
                            className="px-3 py-1.5 text-xs"
                          >
                            {t('deactivate')}
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            onClick={() => handleReactivate(user.id)}
                            disabled={actioningId === user.id}
                            className="px-3 py-1.5 text-xs"
                          >
                            {t('activate')}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-xs text-neutral-500">
              {tCommon('pageOf', { page, totalPages })}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs"
              >
                {tCommon('previous')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-xs"
              >
                {tCommon('next')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
