import { ReactNode } from 'react';
import { StatusType } from '@/types';

export type BadgeTone = 'green' | 'yellow' | 'red' | 'gray' | 'blue';

const TONES: Record<BadgeTone, string> = {
  green: 'bg-pitch-50 text-pitch-700 ring-pitch-600/20',
  yellow: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  gray: 'bg-ink-100 text-ink-600 ring-ink-500/20',
  blue: 'bg-sky-50 text-sky-700 ring-sky-600/20',
};

export default function Badge({ children, tone = 'gray', dot = false }: { children: ReactNode; tone?: BadgeTone; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[tone]}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export const statusTone = (status: StatusType): BadgeTone =>
  status === StatusType.Accepted ? 'green' : status === StatusType.Rejected ? 'red' : status === StatusType.Pending ? 'yellow' : 'gray';
