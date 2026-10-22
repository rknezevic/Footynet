'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FileText, MessageCircle } from 'lucide-react';
import { playerService } from '@/lib/player';
import { useEnumLabels } from '@/i18n/useEnumLabels';
import { JobAdDto, StatusType } from '@/types';
import PageShell from '@/components/PageShell';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Badge, { statusTone } from '@/components/Badge';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import Pagination from '@/components/Pagination';

export default function PlayerApplicationsPage() {
  const [applications, setApplications] = useState<JobAdDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const t = useTranslations('playerApplications');
  const labels = useEnumLabels();

  useEffect(() => {
    playerService.getMyApplications(page, pageSize).then(data => {
      setApplications(data.items);
      setTotalPages(data.totalPages);
    });
  }, [page]);

  return (
    <PageShell>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      {applications.length === 0 ? (
        <Card>
          <EmptyState
            icon={FileText}
            title={t('empty')}
            action={<Link href="/player/jobs"><Button>{t('browseJobs')}</Button></Link>}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id} hover>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <Avatar name={app.clubName} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-ink-900">{app.title}</h3>
                    <Badge tone={statusTone(app.applicationStatus)} dot>{labels.status(app.applicationStatus)}</Badge>
                  </div>
                  <p className="mb-2 text-sm text-ink-500">{app.clubName} · {app.leagueName} · {labels.position(app.requiredPositionName)}</p>
                  <p className="line-clamp-2 text-sm leading-relaxed text-ink-600">{app.description}</p>
                </div>
                {/* Messaging opens once the club has accepted the application */}
                {app.applicationStatus === StatusType.Accepted && (
                  <Link href={`/messages?user=${app.clubId}&name=${encodeURIComponent(app.clubName)}`}>
                    <Button size="sm"><MessageCircle className="h-4 w-4" />{t('messageClub')}</Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </PageShell>
  );
}
