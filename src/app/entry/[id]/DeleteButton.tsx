'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/entries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error(err);
      setDeleting(false);
      setConfirm(false);
    }
  };

  if (confirm) {
    return (
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Delete?</span>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={deleting}
          style={{ padding: '0.4rem 0.9rem' }}
        >
          {deleting ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setConfirm(false)}
          style={{ padding: '0.4rem 0.75rem' }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="btn btn-danger"
      onClick={() => setConfirm(true)}
      style={{ padding: '0.4rem 0.9rem' }}
    >
      <Trash2 size={14} />
      Delete
    </button>
  );
}
