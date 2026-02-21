import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Clock, MapPin, Users } from 'lucide-react';
import type { Entry } from '@/lib/db';
import RatingStars from './RatingStars';

const TYPE_LABELS: Record<string, string> = {
  gi: 'Gi',
  nogi: 'No-Gi',
  openmat: 'Open Mat',
  competition: 'Competition',
  drilling: 'Drilling',
};

interface EntryCardProps {
  entry: Entry;
}

export default function EntryCard({ entry }: EntryCardProps) {
  const dateLabel = (() => {
    try {
      return format(parseISO(entry.date), 'EEE, MMM d yyyy');
    } catch {
      return entry.date;
    }
  })();

  const snippet =
    entry.what_went_well || entry.notes || entry.techniques || entry.what_to_improve;

  return (
    <Link href={`/entry/${entry.id}`} style={{ textDecoration: 'none' }}>
      <article
        className="card animate-fade-in"
        style={{
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{dateLabel}</span>
            <span className={`badge badge-${entry.type}`}>{TYPE_LABELS[entry.type] ?? entry.type}</span>
          </div>
          {entry.rating != null && (
            <RatingStars value={entry.rating} size={14} />
          )}
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem' }}>
          {entry.duration != null && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <Clock size={13} />
              {entry.duration} min
            </span>
          )}
          {entry.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <MapPin size={13} />
              {entry.location}
            </span>
          )}
          {entry.partner && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <Users size={13} />
              {entry.partner}
            </span>
          )}
        </div>

        {/* Snippet */}
        {snippet && (
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.5',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {snippet}
          </p>
        )}
      </article>
    </Link>
  );
}
