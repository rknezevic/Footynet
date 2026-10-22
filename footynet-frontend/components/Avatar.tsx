interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  // "light" for use on the green header background
  tone?: 'default' | 'light';
}

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
};

// Same name always gets the same colour, so people are easy to recognise in lists
const PALETTE = [
  'bg-pitch-100 text-pitch-800',
  'bg-sky-100 text-sky-800',
  'bg-amber-100 text-amber-800',
  'bg-violet-100 text-violet-800',
  'bg-rose-100 text-rose-800',
  'bg-teal-100 text-teal-800',
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] ?? '';
  return (first + last).toUpperCase();
}

export default function Avatar({ name, size = 'md', tone = 'default' }: AvatarProps) {
  const hash = [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
  const colors = tone === 'light'
    ? 'bg-white/20 text-white ring-2 ring-white/40 backdrop-blur'
    : PALETTE[hash % PALETTE.length];

  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full font-display font-semibold ${SIZES[size]} ${colors}`} aria-hidden="true">
      {initials(name)}
    </div>
  );
}
