import React, { useMemo, useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({
  value = 0,
  onChange,
  max = 5,
  readOnly = false,
  size = 'md',
  className = '',
  'aria-label': ariaLabel = 'Rating',
} = {}) {
  const [hover, setHover] = useState(null);

  const sizeClass = useMemo(() => {
    if (size === 'sm') return 'w-4 h-4';
    if (size === 'lg') return 'w-6 h-6';
    return 'w-5 h-5';
  }, [size]);

  const current = hover === null ? Number(value ?? 0) : Number(hover ?? 0);
  const total = Math.max(1, Math.min(10, Number(max ?? 5) || 5));

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1 ${className}`.trim()}
      onMouseLeave={() => setHover(null)}
    >
      {Array.from({ length: total }).map((_, idx) => {
        const ratingValue = idx + 1;
        const active = ratingValue <= current;

        return (
          <button
            key={ratingValue}
            type="button"
            className={`p-0.5 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              readOnly ? 'cursor-default' : 'cursor-pointer'
            }`}
            role="radio"
            aria-checked={Number(value ?? 0) === ratingValue}
            aria-label={`${ratingValue} de ${total}`}
            disabled={readOnly}
            onMouseEnter={() => {
              if (readOnly) return;
              setHover(ratingValue);
            }}
            onClick={() => {
              if (readOnly) return;
              onChange?.(ratingValue);
            }}
            onKeyDown={(e) => {
              if (readOnly) return;
              if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                onChange?.(Math.max(1, Number(value ?? 1) - 1));
              } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                onChange?.(Math.min(total, Number(value ?? 0) + 1));
              } else if (e.key === 'Home') {
                e.preventDefault();
                onChange?.(1);
              } else if (e.key === 'End') {
                e.preventDefault();
                onChange?.(total);
              }
            }}
          >
            <Star className={`${sizeClass} ${active ? 'fill-accent text-accent' : 'text-border'}`} />
          </button>
        );
      })}
    </div>
  );
}

