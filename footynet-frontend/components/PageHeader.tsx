import { ReactNode } from 'react';

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  // Shown on the left of the title, e.g. an Avatar on profile pages
  leading?: ReactNode;
  // Buttons on the right
  actions?: ReactNode;
}

// Green "pitch" banner at the top of every page
export default function PageHeader({ title, subtitle, leading, actions }: PageHeaderProps) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-pitch-700 via-pitch-600 to-pitch-500 px-6 py-8 text-white shadow-lift sm:px-10 sm:py-10">
      <div className="pitch-pattern pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          {leading}
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-pitch-50/90 sm:text-base">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  );
}
