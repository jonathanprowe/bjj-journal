'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PlusCircle, FilterX } from 'lucide-react';
import type { Entry } from '@/lib/db';
import EntryCard from '@/components/EntryCard';
import SearchBar from '@/components/SearchBar';
import StatsPanel from '@/components/StatsPanel';

const TYPES = [
  { value: '', label: 'All Types' },
  { value: 'gi', label: 'Gi' },
  { value: 'nogi', label: 'No-Gi' },
  { value: 'openmat', label: 'Open Mat' },
  { value: 'competition', label: 'Competition' },
  { value: 'drilling', label: 'Drilling' },
];

interface Stats {
  total: number;
  thisMonth: number;
  avgRating: number | null;
  streak: number;
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, thisMonth: 0, avgRating: null, streak: 0 });
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (typeFilter) params.set('type', typeFilter);

      const [entriesRes, statsRes] = await Promise.all([
        fetch(`/api/entries?${params}`),
        fetch('/api/stats'),
      ]);

      const [entriesData, statsData] = await Promise.all([
        entriesRes.json(),
        statsRes.json(),
      ]);

      setEntries(Array.isArray(entriesData) ? entriesData : []);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hasFilters = search || typeFilter;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Training Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Track your progress on the mats
          </p>
        </div>
        <Link href="/new" className="btn btn-primary">
          <PlusCircle size={16} />
          New Entry
        </Link>
      </div>

      {/* Stats */}
      <StatsPanel stats={stats} />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px' }}>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ flex: '0 1 160px', width: 'auto' }}
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => { setSearch(''); setTypeFilter(''); }}
            style={{ whiteSpace: 'nowrap' }}
          >
            <FilterX size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Entries */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading…
        </div>
      ) : entries.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '3rem' }}>🥋</span>
          {hasFilters ? (
            <p>No entries match your search.</p>
          ) : (
            <>
              <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                No training entries yet
              </p>
              <p style={{ fontSize: '0.875rem' }}>Start logging your sessions to track progress.</p>
              <Link href="/new" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <PlusCircle size={15} />
                Log Your First Session
              </Link>
            </>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1rem',
          }}
        >
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
