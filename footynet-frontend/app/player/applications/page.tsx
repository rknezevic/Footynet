'use client';

import { useEffect, useState } from 'react';
import UnifiedNavBar from '@/components/UnifiedNavBar';
import { playerService } from '@/lib/player';
import { JobAdDto, StatusType } from '@/types';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function PlayerApplicationsPage() {
  const [applications, setApplications] = useState<JobAdDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    loadApplications();
  }, [page]);

  const loadApplications = async () => {
    const data = await playerService.getMyApplications(page, pageSize);
    setApplications(data.items);
    setTotalPages(data.totalPages);
  };

  const getStatusStyle = (status: StatusType) => {
    switch (status) {
      case StatusType.Pending: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case StatusType.Accepted: return 'bg-green-50 text-green-700 border-green-200';
      case StatusType.Rejected: return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  const getStatusText = (status: StatusType) => {
    switch (status) {
      case StatusType.Pending: return 'Pending';
      case StatusType.Accepted: return 'Accepted';
      case StatusType.Rejected: return 'Rejected';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <UnifiedNavBar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <PageHeader title="My Applications" subtitle="Track your application status" />
        <div className="space-y-4">
          {applications.length === 0 ? (
            <p className="text-sm text-neutral-400">No applications yet. Browse jobs to apply.</p>
          ) : (
            applications.map((app) => (
              <Card key={app.id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">{app.title}</h3>
                    <p className="text-sm text-neutral-500 mb-2">{app.clubName} · {app.leagueName}</p>
                    <p className="text-sm text-neutral-600 leading-relaxed">{app.description}</p>
                  </div>
                  <span className={`ml-4 text-xs font-medium px-2.5 py-1 rounded-md border ${getStatusStyle(app.applicationStatus)}`}>
                    {getStatusText(app.applicationStatus)}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button variant="secondary" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>Previous</Button>
            <span className="text-sm text-neutral-500">Page {page} of {totalPages}</span>
            <Button variant="secondary" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}
