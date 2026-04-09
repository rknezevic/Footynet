'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminService } from '@/lib/admin';
import { AdminUserDto, PaginatedResult, RoleType } from '@/types';
import UnifiedNavBar from '@/components/UnifiedNavBar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

const PAGE_SIZE = 10;

const ROLE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Player', value: String(RoleType.Player) },
  { label: 'Club', value: String(RoleType.Club) },
];

export default function AdminUsers() {
  const [data, setData] = useState<PaginatedResult<AdminUserDto> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState<string | null>(null);
  const router = useRouter();

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
        setError('Failed to load users.');
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
      setError('Failed to deactivate user.');
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
      setError('Failed to reactivate user.');
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

  if (!data) return <div className="p-8 text-sm text-neutral-400">Loading...</div>;

  const { items, totalPages } = data;

  return (
    <div className="min-h-screen bg-neutral-50">
      <UnifiedNavBar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <PageHeader title="User Management" subtitle="View and manage all platform users" />

        {error && (
          <div className="bg-red-50 border-l-2 border-red-500 px-3 py-2 text-sm text-red-700 rounded-r mb-6">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by email..."
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
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <Card>
          {items.length === 0 ? (
            <p className="text-sm text-neutral-500">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide">Email</th>
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide">Role</th>
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide">Status</th>
                    <th className="pb-3 font-semibold text-neutral-500 text-xs uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.filter((user) => user.role !== 'Admin').map((user) => (
                    <tr key={user.id} className="border-b border-neutral-100 last:border-0">
                      <td className="py-4 text-neutral-900 font-medium">{user.email}</td>
                      <td className="py-4 text-neutral-600">{user.role}</td>
                      <td className="py-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                            user.isActive
                              ? 'bg-green-50 text-green-700'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
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
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            onClick={() => handleReactivate(user.id)}
                            disabled={actioningId === user.id}
                            className="px-3 py-1.5 text-xs"
                          >
                            Activate
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
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs"
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
