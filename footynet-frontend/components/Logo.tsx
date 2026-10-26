// FootyNet wordmark; "light" variant for green backgrounds
export default function Logo({ variant = 'dark', size = 'md' }: { variant?: 'dark' | 'light'; size?: 'md' | 'lg' }) {
  const text = variant === 'light' ? 'text-white' : 'text-ink-900';
  const box = size === 'lg' ? 'h-10 w-10 text-xl' : 'h-8 w-8 text-base';
  const tile = variant === 'light' ? 'bg-white text-pitch-800' : 'bg-pitch-700 text-white';
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`flex items-center justify-center rounded-lg font-display font-bold leading-none ${tile} ${box}`} aria-hidden="true">
        F
      </span>
      <span className={`font-display font-bold tracking-tight ${size === 'lg' ? 'text-2xl' : 'text-lg'} ${text}`}>
        Footy<span className={variant === 'light' ? 'text-pitch-300' : 'text-pitch-700'}>Net</span>
      </span>
    </span>
  );
}
