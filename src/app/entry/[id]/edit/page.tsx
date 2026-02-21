import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getEntry } from '@/lib/db';
import EntryForm from '@/components/EntryForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEntryPage({ params }: Props) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) notFound();

  const entry = getEntry(id);
  if (!entry) notFound();

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link href={`/entry/${entry.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem' }}>
          <ArrowLeft size={15} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Edit Entry
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
            Update your training notes
          </p>
        </div>
      </div>

      <EntryForm entry={entry} />
    </div>
  );
}
