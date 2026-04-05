import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { base44 } from '@/api/base44Client';

export const landingDefaultsV2 = {
  hero: {
    image_url: 'https://media.base44.com/images/public/69cc376dc1ad26b57bf8eecd/fb2700b90_generated_25361021.png',
    eyebrow: 'Clínica Capilar',
    title: 'moonlight',
    title_highlight: 'light',
    subtitle:
      'Especializada em cabelos crespos naturais. Promovemos a aceitação capilar como primeiro passo para alcançar a saúde do seu cabelo.',
    primary_cta_label: 'Nossos Produtos',
    primary_cta_to: '/loja',
    secondary_cta_label: 'Conheça-nos',
    secondary_cta_to: '/sobre',
  },
  about: {
    image_url: 'https://media.base44.com/images/public/69cc376dc1ad26b57bf8eecd/d9d7bc902_generated_a845f4fd.png',
    image_alt: 'Fundadora da Moonlight',
    eyebrow: 'Sobre Mim',
    title: 'Krisnélia Neto',
    title_highlight: 'Neto',
    body:
      'Terapeuta e consultora capilar, CEO e fundadora da Moonlight. Trabalhar com terapia capilar é uma forma de levantar a autoestima das pessoas — é incrível ver como as pessoas confiam em mim e nos meus produtos.',
    bullets: ['Terapeuta capilar', 'Consultora capilar', 'CEO & Fundadora', 'Especialista em naturais'],
    badge_letter: 'K',
    cta_label: 'Saber mais',
    cta_to: '/sobre',
  },
  products: {
    image_url: 'https://media.base44.com/images/public/69cc376dc1ad26b57bf8eecd/319b58075_generated_888a5b9c.png',
    image_alt: 'Óleos Moonlight',
    eyebrow: '100% Naturais',
    title: 'Óleos Moonlight',
    title_highlight: 'Moonlight',
    subtitle: 'Feitos com muito amor a pensar em si e no seu cabelo.',
    items: [
      { name: 'Tônico de Alho', benefit: 'Antiqueda & Crescimento' },
      { name: 'Tônico de Gengibre', benefit: 'Hidratação & Brilho' },
      { name: 'Super Tônico', benefit: 'Força & Volume' },
      { name: 'Óleo de Cravo-da-Índia', benefit: 'Fortalecimento' },
      { name: 'Óleo de Alecrim', benefit: 'Antioxidante' },
      { name: 'Óleo de Hibisco', benefit: 'Reconstrução' },
    ],
    cta_label: 'Ver todos os produtos',
    cta_to: '/loja',
  },
  timeline: {
    eyebrow: 'O Ritual',
    title: 'Cronograma Capilar',
    title_highlight: 'Capilar',
    steps: [
      {
        title: 'Hidratação',
        description: 'Reposição de água no cabelo através de extratos de plantas, frutas ou vitaminas.',
      },
      {
        title: 'Nutrição',
        description: 'Responsável por repor os nutrientes perdidos e equilibrar a oleosidade natural.',
      },
      {
        title: 'Reconstrução',
        description: 'Reposição proteica que proporciona mais força aos cabelos frágeis.',
      },
    ],
    cta_label: 'Guia completo',
    cta_to: '/guia',
  },
  quote: {
    image_url: 'https://media.base44.com/images/public/69cc376dc1ad26b57bf8eecd/6eee5f2d7_generated_acd6eda3.png',
    image_alt: 'Hair care',
    text: 'Cabelos saudáveis não são apenas um desejo, são um compromisso.',
    highlight: 'compromisso',
    footer: 'Moonlight Clínica Capilar',
  },
  cta: {
    title: 'Pronta para transformar o seu cabelo?',
    title_highlight: 'cabelo',
    subtitle: 'Entre em contacto connosco e descubra o tratamento ideal para o seu tipo de cabelo.',
    primary_label: 'WhatsApp',
    primary_url: 'https://wa.me/244927215851',
    secondary_label: 'Instagram',
    secondary_url: '',
  },
};

function mergeSection(def, value) {
  const base = def && typeof def === 'object' ? def : {};
  const next = value && typeof value === 'object' ? value : {};
  return { ...base, ...next };
}

function normalizeArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}

function getLandingV2(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (raw.v2 && typeof raw.v2 === 'object') return raw.v2;
  return raw;
}

export function useLandingContent() {
  const query = useQuery({
    queryKey: ['content-landing'],
    queryFn: () => base44.content.landing(),
    staleTime: 300_000,
  });

  const landing = useMemo(() => {
    const raw = query.data?.content ?? null;
    const v2 = getLandingV2(raw) ?? {};

    const hero = mergeSection(landingDefaultsV2.hero, v2.hero);
    const about = mergeSection(landingDefaultsV2.about, v2.about);
    const products = mergeSection(landingDefaultsV2.products, v2.products);
    const timeline = mergeSection(landingDefaultsV2.timeline, v2.timeline);
    const quote = mergeSection(landingDefaultsV2.quote, v2.quote);
    const cta = mergeSection(landingDefaultsV2.cta, v2.cta);

    return {
      hero: {
        ...hero,
      },
      about: {
        ...about,
        bullets: normalizeArray(about.bullets, landingDefaultsV2.about.bullets),
      },
      products: {
        ...products,
        items: normalizeArray(products.items, landingDefaultsV2.products.items).map((it) => ({
          name: String(it?.name ?? ''),
          benefit: String(it?.benefit ?? ''),
        })),
      },
      timeline: {
        ...timeline,
        steps: normalizeArray(timeline.steps, landingDefaultsV2.timeline.steps).map((s) => ({
          title: String(s?.title ?? ''),
          description: String(s?.description ?? ''),
        })),
      },
      quote: {
        ...quote,
      },
      cta: {
        ...cta,
      },
    };
  }, [query.data]);

  return { landing, isLoadingLanding: query.isLoading, landingUpdatedAt: query.data?.updated_date ?? null };
}
