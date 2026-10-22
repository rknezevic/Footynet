import { League } from '@/lib/lookup';

interface LeagueOptionsProps {
  leagues: League[];
}

// Renders league <option>s grouped by competition level; leagues arrive sorted by level from the API
export default function LeagueOptions({ leagues }: LeagueOptionsProps) {
  const levels = Array.from(new Set(leagues.map(l => l.level)));

  return (
    <>
      {levels.map(level => (
        <optgroup key={level} label={`Level ${level}`}>
          {leagues.filter(l => l.level === level).map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </optgroup>
      ))}
    </>
  );
}
