import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { base44 } from '@/api/base44Client';

export const guideDefaults = {
  cronograma: {
    eyebrow: 'O Ritual',
    title: 'Cronograma Capilar',
    title_highlight: 'Capilar',
    subtitle: 'O cronograma capilar é composto por 3 etapas essenciais para a saúde do seu cabelo.',
    steps: [
      {
        number: '01',
        title: 'Hidratação',
        description: 'Reposição de água no cabelo através de extratos de plantas, frutas ou vitaminas.',
      },
      {
        number: '02',
        title: 'Nutrição',
        description: 'Responsável por repor os nutrientes perdidos e equilibrar a oleosidade natural do nosso cabelo.',
      },
      {
        number: '03',
        title: 'Reconstrução',
        description:
          'Reposição proteica. Sua ação proporciona mais força aos cabelos frágeis e reequilibra a elasticidade comprometida por químicas e fatores externos.',
      },
    ],
  },
  umectacao: {
    eyebrow: 'Nutrição Capilar',
    title: 'Umectação',
    body:
      'A umectação é uma etapa da nutrição capilar, que consiste no tratamento à base de óleos, sejam eles essenciais ou vegetais. O seu principal objetivo é acabar com o ressecamento, nutrir os fios e devolver o brilho aos mesmos.',
    bullets: ['Redução da quebra capilar', 'Diminuição do frizz', 'Redução do atrito entre os fios', 'Fortalecimento da fibra capilar'],
    image_url: 'https://media.base44.com/images/public/69cc376dc1ad26b57bf8eecd/6eee5f2d7_generated_acd6eda3.png',
    image_alt: 'Umectação capilar',
  },
  letter: {
    eyebrow: 'Uma Mensagem Especial',
    title: 'Do seu cabelo para você',
    body_1:
      '"Oi minha dona linda e maravilhosa, muito obrigada por se dedicar tanto a mim, pelos cuidados, pelo tempo e dinheiro investidos! Eu sou tão importante como qualquer outra parte de seu corpo, por isso, me lave 3x na semana, me vista com um pijama de cetim todas as noites, penteia-me com cuidado, pois eu sinto muita dor, seque-me bem depois da lavagem."',
    body_2:
      '"Ao me prender, por favor seja delicada, e compre os óleos da Moonlight — eles ajudam na minha saúde e desenvolvimento. Por favor não se chateie quando eu encolher, isso faz parte das minhas características e deves amar-me como eu sou!"',
    signature: '"Eu sou a coroa que você carrega, a tua identidade"',
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

export function useGuideContent() {
  const query = useQuery({
    queryKey: ['content-guide'],
    queryFn: () => base44.content.guide(),
    staleTime: 300_000,
  });

  const guide = useMemo(() => {
    const raw = query.data?.content ?? null;
    const v = raw && typeof raw === 'object' ? raw : {};

    const cronograma = mergeSection(guideDefaults.cronograma, v.cronograma);
    const umectacao = mergeSection(guideDefaults.umectacao, v.umectacao);
    const letter = mergeSection(guideDefaults.letter, v.letter);

    const steps = normalizeArray(cronograma.steps, guideDefaults.cronograma.steps)
      .slice(0, 3)
      .map((s, idx) => ({
        number: String(s?.number ?? guideDefaults.cronograma.steps[idx]?.number ?? ''),
        title: String(s?.title ?? guideDefaults.cronograma.steps[idx]?.title ?? ''),
        description: String(s?.description ?? guideDefaults.cronograma.steps[idx]?.description ?? ''),
      }));

    return {
      cronograma: { ...cronograma, steps },
      umectacao: {
        ...umectacao,
        bullets: normalizeArray(umectacao.bullets, guideDefaults.umectacao.bullets).map((b) => String(b ?? '')).filter(Boolean),
      },
      letter: { ...letter },
    };
  }, [query.data]);

  return { guide, isLoadingGuide: query.isLoading, guideUpdatedAt: query.data?.updated_date ?? null };
}

