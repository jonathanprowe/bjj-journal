'use client';

import { Star } from 'lucide-react';

interface RatingStarsProps {
  value: number | null;
  onChange?: (v: number) => void;
  size?: number;
}

export default function RatingStars({ value, onChange, size = 18 }: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {stars.map((star) => {
        const filled = value != null && star <= value;
        return (
          <button
            key={star}
            type={onChange ? 'button' : undefined}
            onClick={onChange ? () => onChange(star) : undefined}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.125rem',
              cursor: onChange ? 'pointer' : 'default',
              color: filled ? 'var(--accent-gold)' : 'var(--text-muted)',
              transition: 'color 0.1s ease, transform 0.1s ease',
              lineHeight: 0,
            }}
            onMouseEnter={
              onChange
                ? (e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.15)';
                  }
                : undefined
            }
            onMouseLeave={
              onChange
                ? (e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                  }
                : undefined
            }
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              fill={filled ? 'var(--accent-gold)' : 'none'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
