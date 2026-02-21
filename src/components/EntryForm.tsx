'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Save, X } from 'lucide-react';
import type { Entry, EntryType } from '@/lib/db';
import RatingStars from './RatingStars';

const TYPES: { value: EntryType; label: string }[] = [
  { value: 'gi', label: 'Gi' },
  { value: 'nogi', label: 'No-Gi' },
  { value: 'openmat', label: 'Open Mat' },
  { value: 'competition', label: 'Competition' },
  { value: 'drilling', label: 'Drilling' },
];

interface EntryFormProps {
  entry?: Entry;
}

export default function EntryForm({ entry }: EntryFormProps) {
  const router = useRouter();
  const isEdit = !!entry;

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const [form, setForm] = useState({
    date: entry?.date ?? todayStr,
    type: entry?.type ?? ('gi' as EntryType),
    duration: entry?.duration != null ? String(entry.duration) : '',
    location: entry?.location ?? '',
    partner: entry?.partner ?? '',
    instructor: entry?.instructor ?? '',
    techniques: entry?.techniques ?? '',
    what_went_well: entry?.what_went_well ?? '',
    what_to_improve: entry?.what_to_improve ?? '',
    notes: entry?.notes ?? '',
    rating: entry?.rating ?? null as number | null,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: string, value: string | number | null) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      date: form.date,
      type: form.type,
      duration: form.duration ? parseInt(form.duration, 10) : null,
      location: form.location || null,
      partner: form.partner || null,
      instructor: form.instructor || null,
      techniques: form.techniques || null,
      what_went_well: form.what_went_well || null,
      what_to_improve: form.what_to_improve || null,
      notes: form.notes || null,
      rating: form.rating,
    };

    try {
      const url = isEdit ? `/api/entries/${entry.id}` : '/api/entries';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      const saved: Entry = await res.json();
      router.push(`/entry/${saved.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSaving(false);
    }
  };

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
  };

  const gridTwo: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(192, 57, 43, 0.15)',
            border: '1px solid var(--accent-red)',
            borderRadius: '0.5rem',
            color: 'var(--accent-red-light)',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Section: Core info */}
      <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Session Details
        </h2>

        <div style={gridTwo}>
          <div style={fieldStyle}>
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              required
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="type">Type</label>
            <select
              id="type"
              required
              value={form.type}
              onChange={(e) => set('type', e.target.value)}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              id="duration"
              type="number"
              min="1"
              max="480"
              placeholder="e.g. 90"
              value={form.duration}
              onChange={(e) => set('duration', e.target.value)}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="location">Location / Gym</label>
            <input
              id="location"
              type="text"
              placeholder="e.g. Main Academy"
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="partner">Training Partner</label>
            <input
              id="partner"
              type="text"
              placeholder="Sparring partner name"
              value={form.partner}
              onChange={(e) => set('partner', e.target.value)}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="instructor">Instructor</label>
            <input
              id="instructor"
              type="text"
              placeholder="Who led the class"
              value={form.instructor}
              onChange={(e) => set('instructor', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Section: Reflection */}
      <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Reflection
        </h2>

        <div style={fieldStyle}>
          <label htmlFor="techniques">Techniques Learned / Drilled</label>
          <textarea
            id="techniques"
            rows={3}
            placeholder="What techniques did you work on?"
            value={form.techniques}
            onChange={(e) => set('techniques', e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="what_went_well">What Went Well</label>
          <textarea
            id="what_went_well"
            rows={3}
            placeholder="Victories, improvements, moments of flow…"
            value={form.what_went_well}
            onChange={(e) => set('what_went_well', e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="what_to_improve">What to Improve</label>
          <textarea
            id="what_to_improve"
            rows={3}
            placeholder="Areas to focus on next session…"
            value={form.what_to_improve}
            onChange={(e) => set('what_to_improve', e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="notes">General Notes</label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Anything else worth noting…"
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        </div>
      </section>

      {/* Section: Rating */}
      <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Session Rating
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <RatingStars value={form.rating} onChange={(v) => set('rating', v)} size={28} />
          {form.rating != null && (
            <button
              type="button"
              onClick={() => set('rating', null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem' }}
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => router.back()}
          disabled={saving}
        >
          <X size={15} />
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
          style={{ minWidth: '130px', justifyContent: 'center' }}
        >
          <Save size={15} />
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Entry'}
        </button>
      </div>
    </form>
  );
}
