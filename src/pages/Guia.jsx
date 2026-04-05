import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Leaf, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { base44 } from '@/api/base44Client';
import { useGuideContent } from '@/lib/useGuideContent';

const iconByIndex = [Droplets, Leaf, Shield];

export default function Guia() {
  const { guide } = useGuideContent();

  const { data: faqItems = [], isLoading: isLoadingFaq } = useQuery({
    queryKey: ['faq'],
    queryFn: () => base44.faq.list(),
    staleTime: 300_000,
  });

  const cronograma = guide?.cronograma ?? {};
  const umectacao = guide?.umectacao ?? {};
  const letter = guide?.letter ?? {};

  const steps = useMemo(() => (Array.isArray(cronograma.steps) ? cronograma.steps : []), [cronograma.steps]);
  const bullets = useMemo(() => (Array.isArray(umectacao.bullets) ? umectacao.bullets : []), [umectacao.bullets]);

  const faqs = useMemo(() => {
    return (Array.isArray(faqItems) ? faqItems : [])
      .filter((it) => it?.question && it?.answer)
      .map((it, idx) => ({
        id: String(it.id ?? `faq-${idx}`),
        q: String(it.question ?? ''),
        a: String(it.answer ?? ''),
      }));
  }, [faqItems]);

  return (
    <div className="pt-24">
      {/* Cronograma Capilar */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              {cronograma.eyebrow ?? 'O Ritual'}
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-foreground mt-4 leading-tight">
              {String(cronograma.title ?? 'Cronograma')}{' '}
              <span className="text-primary">{String(cronograma.title_highlight ?? 'Capilar')}</span>
            </h1>
            <p className="font-mono text-sm text-muted-foreground mt-4 max-w-lg mx-auto">
              {String(cronograma.subtitle ?? '')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {steps.map((step, i) => {
              const Icon = iconByIndex[i] ?? Droplets;
              return (
                <motion.div
                  key={String(step.number ?? i)}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="group relative"
                >
                  <div className="p-8 rounded-2xl border border-border hover:border-primary/30 bg-card/50 hover:bg-card transition-all duration-500 h-full">
                    <span className="font-display text-7xl text-primary/10 absolute top-4 right-6">{step.number}</span>
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl text-foreground mb-4">{step.title}</h3>
                    <p className="font-mono text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Umectação */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              {String(umectacao.eyebrow ?? 'Nutrição Capilar')}
            </span>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mt-4 mb-8 leading-tight">
              {String(umectacao.title ?? 'Umectação')}
            </h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-8">
              {String(umectacao.body ?? '')}
            </p>
            <div className="space-y-3">
              {bullets.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-mono text-sm text-foreground">{b}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-2xl" />
            <img
              src={String(umectacao.image_url ?? '')}
              alt={String(umectacao.image_alt ?? 'Umectação capilar')}
              className="relative w-full rounded-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Dúvidas</span>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mt-4">
              Perguntas <span className="text-primary">Frequentes</span>
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {(isLoadingFaq ? [] : faqs).map((faq, i) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-border rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="font-mono text-sm text-foreground hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-mono text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}

            {!isLoadingFaq && faqs.length === 0 ? (
              <div className="text-center py-10">
                <p className="font-mono text-sm text-muted-foreground">Sem perguntas por enquanto.</p>
              </div>
            ) : null}
          </Accordion>
        </div>
      </section>

      {/* Carta */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 md:p-12 rounded-2xl border border-primary/20 bg-card/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              {String(letter.eyebrow ?? 'Uma Mensagem Especial')}
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-foreground mt-4 mb-6">
              {String(letter.title ?? 'Do seu cabelo para você')}
            </h3>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-4 italic">
              {String(letter.body_1 ?? '')}
            </p>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed italic">{String(letter.body_2 ?? '')}</p>
            <p className="font-display text-lg text-primary mt-8">{String(letter.signature ?? '')}</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

