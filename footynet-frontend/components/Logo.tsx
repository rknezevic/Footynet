// FootyNet wordmark; "light" variant for green backgrounds
export default function Logo({ variant = 'dark', size = 'md' }: { variant?: 'dark' | 'light'; size?: 'md' | 'lg' }) {
  const text = variant === 'light' ? 'text-white' : 'text-ink-900';
  const box = size === 'lg' ? 'h-10 w-10 text-xl' : 'h-8 w-8 text-base';
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-pitch-500 to-pitch-700 shadow-sm ${box}`} aria-hidden="true">
        ⚽
      </span>
      <span className={`font-display font-bold tracking-tight ${size === 'lg' ? 'text-2xl' : 'text-lg'} ${text}`}>
        Footy<span className={variant === 'light' ? 'text-pitch-200' : 'text-pitch-600'}>Net</span>
      </span>
    </span>
  );
}
