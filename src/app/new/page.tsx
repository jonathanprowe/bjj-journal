import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import EntryForm from '@/components/EntryForm';

export default function NewEntryPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link href="/" className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem' }}>
          <ArrowLeft size={15} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Log New Session
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
            Record what you learned and how it went
          </p>
        </div>
      </div>

      <EntryForm />
    </div>
  );
}
