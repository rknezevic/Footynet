'use client';

import Badge, { BadgeTone } from '@/components/Badge';
import { useEnumLabels } from '@/i18n/useEnumLabels';
import { AvailabilityStatus } from '@/types';

const TONE: Record<AvailabilityStatus, BadgeTone> = {
  [AvailabilityStatus.LookingForClub]: 'green',
  [AvailabilityStatus.OpenToOffers]: 'blue',
  [AvailabilityStatus.NotAvailable]: 'gray',
};

export default function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  const labels = useEnumLabels();
  return <Badge tone={TONE[status] ?? 'gray'} dot>{labels.availability(status)}</Badge>;
}
