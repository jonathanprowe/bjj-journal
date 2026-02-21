import { Calendar, Flame, Star, TrendingUp } from 'lucide-react';

interface Stats {
  total: number;
  thisMonth: number;
  avgRating: number | null;
  streak: number;
}

interface StatsPanelProps {
  stats: Stats;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const items = [
    {
      label: 'Total Sessions',
      value: stats.total,
      icon: <TrendingUp size={18} />,
      color: 'var(--accent-red)',
    },
    {
      label: 'This Month',
      value: stats.thisMonth,
      icon: <Calendar size={18} />,
      color: 'var(--accent-gold)',
    },
    {
      label: 'Day Streak',
      value: stats.streak,
      icon: <Flame size={18} />,
      color: '#f97316',
    },
    {
      label: 'Avg Rating',
      value: stats.avgRating != null ? stats.avgRating.toFixed(1) : '—',
      icon: <Star size={18} />,
      color: 'var(--accent-gold)',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.75rem',
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="card"
          style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: item.color }}>
            {item.icon}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              {item.label}
            </span>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
