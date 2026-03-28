import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { base44 } from '@/api/base44Client';

const defaults = {
  site_name: 'Zana',
  logo_primary_url: '',
  logo_url: '',
  favicon_url: '',
};

function getOrCreateFaviconLink() {
  if (typeof document === 'undefined') return null;
  const existing = document.querySelector('link[rel="icon"]');
  if (existing) return existing;
  const link = document.createElement('link');
  link.setAttribute('rel', 'icon');
  document.head.appendChild(link);
  return link;
}

export function useBranding() {
  const query = useQuery({
    queryKey: ['content-branding'],
    queryFn: () => base44.content.branding(),
    staleTime: 300_000,
  });

  const branding = useMemo(() => {
    const value = query.data?.content ?? null;
    return { ...defaults, ...(value && typeof value === 'object' ? value : {}) };
  }, [query.data]);

  useEffect(() => {
    const favicon = String(branding.favicon_url ?? '').trim();
    if (!favicon) return;
    const link = getOrCreateFaviconLink();
    if (!link) return;
    link.setAttribute('href', favicon);
  }, [branding.favicon_url]);

  useEffect(() => {
    const name = String(branding.site_name ?? '').trim();
    if (!name) return;
    if (typeof document === 'undefined') return;
    if (!document.title || document.title === 'Zana') document.title = name;
  }, [branding.site_name]);

  return { ...query, branding };
}

