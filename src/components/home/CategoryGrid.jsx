import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fallbackCategories = {
  eyebrow: 'Explore',
  title: 'Os Nossos Produtos',
  items: [
    {
      name: 'Tónicos',
      slug: 'tonico',
      image_url: 'https://media.base44.com/images/public/69cc376dc1ad26b57bf8eecd/319b58075_generated_888a5b9c.png',
    },
    {
      name: 'Óleos',
      slug: 'oleo',
      image_url: 'https://media.base44.com/images/public/69cc376dc1ad26b57bf8eecd/319b58075_generated_888a5b9c.png',
    },
    {
      name: 'Acessórios',
      slug: 'acessorio',
      image_url: 'https://media.base44.com/images/public/69cc376dc1ad26b57bf8eecd/d9d7bc902_generated_a845f4fd.png',
    },
  ],
};

export default function CategoryGrid({ content } = {}) {
  const cfg = { ...fallbackCategories, ...(content?.categories ?? {}) };

  const items = useMemo(() => {
    const raw = Array.isArray(cfg.items) ? cfg.items : [];
    const normalized = raw
      .map((it) => ({
        name: String(it?.name ?? '').trim(),
        slug: String(it?.slug ?? '').trim(),
        image_url: String(it?.image_url ?? '').trim(),
      }))
      .filter((it) => it.name && it.slug && it.image_url);

    return normalized.length ? normalized : fallbackCategories.items;
  }, [cfg.items]);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
          {cfg.eyebrow ?? fallbackCategories.eyebrow}
        </p>
        <h2 className="font-heading text-3xl md:text-5xl font-light">
          {cfg.title ?? fallbackCategories.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {items.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link to={`/catalogo?category=${cat.slug}`} className="group block relative overflow-hidden rounded-lg aspect-[3/4]">
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading text-2xl md:text-3xl text-white">{cat.name}</h3>
                <p className="font-body text-xs tracking-wider text-white/70 mt-1 uppercase">Ver produtos →</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

