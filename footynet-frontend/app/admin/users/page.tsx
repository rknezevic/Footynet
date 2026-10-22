'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, UserCheck, UserX, Users } from 'lucide-react';
import { adminService } from '@/lib/admin';
import { useEnumLabels } from '@/i18n/useEnumLabels';
import { AdminUserDto, PaginatedResult, RoleType } from '@/types';
import PageShell from '@/components/PageShell';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import ErrorMessage from '@/components/ErrorMessage';
import Loading from '@/components/Loading';
import Pagination from '@/components/Pagination';

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
  const labels = useEnumLabels();

  const loadUsers = useCallback(async (p: number, s: string, r: string) => {
    try {
      setError('');
      const role = r !== '' ? Number(r) : undefined;
      setData(await adminService.getUsers(s || undefined, role, p, PAGE_SIZE));
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      if (status === 401 || status === 403) router.push('/login');
      else setError(t('loadFailed'));
    }
  }, [router, t]);

  useEffect(() => {
    loadUsers(page, search, roleFilter);
  }, [page, search, roleFilter, loadUsers]);

  const runAction = async (id: string, action: (id: string) => Promise<unknown>, failedKey: string) => {
    setActioningId(id);
    try {
      await action(id);
      await loadUsers(page, search, roleFilter);
    } catch {
      setError(t(failedKey));
    } finally {
      setActioningId(null);
    }
  };

  if (error && !data) return <PageShell><ErrorMessage message={error} /></PageShell>;
  if (!data) return <PageShell><Loading /></PageShell>;

  const users = data.items.filter(user => user.role !== 'Admin');

  return (
    <PageShell>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

      <Card>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="field pl-9"
            />
          </div>
          <div className="flex rounded-lg bg-ink-100 p-1">
            {ROLE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setRoleFilter(opt.value); setPage(1); }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${roleFilter === opt.value ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-900'}`}
              >
                {opt.value === '' ? t('allRoles') : labels.role(opt.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {users.length === 0 ? (
          <EmptyState icon={Users} title={t('empty')} />
        ) : (
          <div className="-mx-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-xs uppercase tracking-wider text-ink-500">
                  <th className="px-6 pb-3 font-semibold">{t('email')}</th>
                  <th className="px-6 pb-3 font-semibold">{t('role')}</th>
                  <th className="px-6 pb-3 font-semibold">{t('status')}</th>
                  <th className="px-6 pb-3 text-right font-semibold">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {users.map(user => (
                  <tr key={user.id} className="transition-colors hover:bg-ink-50/60">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.email} size="sm" />
                        <span className="font-medium text-ink-900">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3"><Badge tone={user.role === 'Club' ? 'blue' : 'green'}>{labels.role(user.role)}</Badge></td>
                    <td className="px-6 py-3"><Badge tone={user.isActive ? 'green' : 'gray'} dot>{user.isActive ? t('active') : t('inactive')}</Badge></td>
                    <td className="px-6 py-3 text-right">
                      {user.isActive ? (
                        <Button variant="danger" size="sm" onClick={() => runAction(user.id, adminService.deactivateUser, 'deactivateFailed')} disabled={actioningId === user.id}>
                          <UserX className="h-3.5 w-3.5" />{t('deactivate')}
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => runAction(user.id, adminService.reactivateUser, 'reactivateFailed')} disabled={actioningId === user.id}>
                          <UserCheck className="h-3.5 w-3.5" />{t('activate')}
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

      <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
    </PageShell>
  );
}
