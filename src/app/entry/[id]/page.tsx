import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Edit3, Clock, MapPin, Users, GraduationCap } from 'lucide-react';
import { getEntry } from '@/lib/db';
import RatingStars from '@/components/RatingStars';
import DeleteButton from './DeleteButton';

const TYPE_LABELS: Record<string, string> = {
  gi: 'Gi',
  nogi: 'No-Gi',
  openmat: 'Open Mat',
  competition: 'Competition',
  drilling: 'Drilling',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EntryPage({ params }: Props) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) notFound();

  const entry = getEntry(id);
  if (!entry) notFound();

  const dateLabel = (() => {
    try {
      return format(parseISO(entry.date), 'EEEE, MMMM d, yyyy');
    } catch {
      return entry.date;
    }
  })();

  const Section = ({ title, content }: { title: string; content: string | null }) => {
    if (!content) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: '1.65', whiteSpace: 'pre-wrap' }}>
          {content}
        </p>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back + actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <Link href="/" className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem' }}>
          <ArrowLeft size={15} />
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href={`/entry/${entry.id}/edit`} className="btn btn-secondary" style={{ padding: '0.4rem 0.9rem' }}>
            <Edit3 size={14} />
            Edit
          </Link>
          <DeleteButton id={entry.id} />
        </div>
      </div>

      {/* Header card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{dateLabel}</p>
            <span className={`badge badge-${entry.type}`} style={{ alignSelf: 'flex-start' }}>
              {TYPE_LABELS[entry.type] ?? entry.type}
            </span>
          </div>
          {entry.rating != null && (
            <RatingStars value={entry.rating} size={20} />
          )}
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', paddingTop: '0.25rem' }}>
          {entry.duration != null && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <Clock size={14} style={{ color: 'var(--accent-gold)' }} />
              {entry.duration} min
            </span>
          )}
          {entry.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <MapPin size={14} style={{ color: 'var(--accent-gold)' }} />
              {entry.location}
            </span>
          )}
          {entry.partner && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <Users size={14} style={{ color: 'var(--accent-gold)' }} />
              {entry.partner}
            </span>
          )}
          {entry.instructor && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <GraduationCap size={14} style={{ color: 'var(--accent-gold)' }} />
              {entry.instructor}
            </span>
          )}
        </div>
      </div>

      {/* Content sections */}
      {(entry.techniques || entry.what_went_well || entry.what_to_improve || entry.notes) && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Section title="Techniques" content={entry.techniques} />
          <Section title="What Went Well" content={entry.what_went_well} />
          <Section title="What to Improve" content={entry.what_to_improve} />
          <Section title="Notes" content={entry.notes} />
        </div>
      )}

      {/* Footer timestamp */}
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
        Created {format(parseISO(entry.created_at), 'MMM d, yyyy h:mm a')}
        {entry.updated_at !== entry.created_at &&
          ` · Updated ${format(parseISO(entry.updated_at), 'MMM d, yyyy h:mm a')}`}
      </p>
    </div>
  );
}
