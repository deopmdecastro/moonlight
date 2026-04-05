import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

import { base44 } from '@/api/base44Client';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import { Input } from '@/components/ui/input';

const categoryLabels = {
  tendencias: 'Tendências',
  dicas: 'Dicas',
  novidades: 'Novidades',
  inspiracao: 'Inspiração',
};

export default function Blog() {
  const [params, setParams] = useSearchParams();
  const activeCategory = String(params.get('categoria') ?? '').trim();
  const [search, setSearch] = useState('');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts', activeCategory],
    queryFn: () =>
      base44.entities.BlogPost.filter(
        { status: 'published', ...(activeCategory ? { category: activeCategory } : null) },
        '-created_date',
        50,
      ),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const arr = Array.isArray(posts) ? posts : [];
    if (!q) return arr;
    return arr.filter((p) => {
      const hay = [p?.title, p?.excerpt, p?.category].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [posts, search]);

  const categories = useMemo(() => {
    const set = new Set();
    (posts ?? []).forEach((p) => {
      if (p?.category) set.add(String(p.category));
    });
    return Array.from(set);
  }, [posts]);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative py-16 md:py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="relative inline-block mb-6">
              <div className="w-14 h-14 rounded-full bg-accent/30" />
              <div className="absolute top-1 right-0 w-10 h-10 rounded-full bg-primary/80" />
            </div>

            <p className="font-mono text-xs tracking-[0.35em] uppercase text-muted-foreground mb-3">Conteúdo</p>
            <h1 className="font-display text-4xl md:text-6xl text-foreground leading-tight mb-4">Blog</h1>
            <p className="font-mono text-sm text-muted-foreground max-w-2xl">
              Tendências, dicas e inspirações — com novidades da Moonlight e guias para cuidar do seu cabelo.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar artigos..."
                  className="pl-9 rounded-none font-mono text-sm"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => {
                    params.delete('categoria');
                    setParams(params, { replace: true });
                  }}
                  className={`shrink-0 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest border transition-colors ${
                    !activeCategory
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-foreground hover:border-primary'
                  }`}
                >
                  Todas
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      if (c) params.set('categoria', c);
                      setParams(params, { replace: true });
                    }}
                    className={`shrink-0 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest border transition-colors ${
                      activeCategory === c
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-foreground hover:border-primary'
                    }`}
                  >
                    {categoryLabels[c] || c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-secondary/50 aspect-[16/9] rounded-xl mb-4" />
                <div className="h-4 bg-secondary/50 w-1/3 rounded mb-2" />
                <div className="h-6 bg-secondary/50 w-2/3 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-muted-foreground mb-2">Sem artigos</p>
            <p className="font-mono text-sm text-muted-foreground">
              {search.trim() ? 'Tente ajustar a pesquisa.' : 'Estamos a preparar conteúdo inspirador para si.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`group ${i === 0 ? 'lg:col-span-2' : ''}`}
              >
                <Link to={`/blog/${post.id}`}>
                  <div
                    className={`overflow-hidden border border-border bg-card hover:border-primary/40 transition-colors ${
                      i === 0 ? 'rounded-2xl' : 'rounded-xl'
                    }`}
                  >
                    <div className={`relative ${i === 0 ? 'aspect-[16/8]' : 'aspect-[16/10]'} bg-secondary/30`}>
                      <ImageWithFallback
                        src={post.image_url}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        wrapperClassName="absolute inset-0"
                        iconClassName="w-16 h-16 opacity-[0.10] text-muted-foreground"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          {post.category ? (
                            <span className="shrink-0 rounded-full px-3 py-1 bg-white/90 text-foreground font-mono text-[10px] uppercase tracking-widest">
                              {categoryLabels[post.category] || post.category}
                            </span>
                          ) : null}
                          <span className="font-mono text-[10px] uppercase tracking-widest text-white/80 flex items-center gap-1 truncate">
                            <Calendar className="w-3 h-3" />
                            {post.created_date ? format(new Date(post.created_date), 'd MMM yyyy', { locale: pt }) : ''}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-white/80">Ler</span>
                      </div>
                    </div>

                    <div className={i === 0 ? 'p-6' : 'p-5'}>
                      <h2
                        className={`font-display ${
                          i === 0 ? 'text-3xl md:text-4xl' : 'text-xl'
                        } text-foreground group-hover:text-primary transition-colors`}
                      >
                        {post.title}
                      </h2>
                      {post.excerpt ? (
                        <p
                          className={`font-mono text-sm text-muted-foreground mt-2 ${
                            i === 0 ? 'line-clamp-3' : 'line-clamp-2'
                          }`}
                        >
                          {post.excerpt}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

