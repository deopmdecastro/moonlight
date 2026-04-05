import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Leaf, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { getErrorMessage } from '@/lib/toast';
import { useGuideContent } from '@/lib/useGuideContent';

const iconByIndex = [Droplets, Leaf, Shield];

export default function Guia() {
  const { user } = useAuth();
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

  const [questionForm, setQuestionForm] = useState({
    author_name: user?.full_name || '',
    author_email: user?.email || '',
    question: '',
  });

  useEffect(() => {
    setQuestionForm((p) => ({
      ...p,
      author_name: user?.full_name || '',
      author_email: user?.email || '',
    }));
  }, [user?.full_name, user?.email]);

  const [isSendingQuestion, setIsSendingQuestion] = useState(false);

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

          <div className="mt-10 bg-card border border-border rounded-2xl p-6 md:p-8">
            <h3 className="font-display text-2xl text-foreground">Fazer uma pergunta</h3>
            <p className="font-mono text-sm text-muted-foreground mt-2">
              Não encontrou a resposta? Envie a sua pergunta — a equipa responde e, se fizer sentido, publicamos no FAQ.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <Label className="font-body text-xs">Nome (opcional)</Label>
                <Input
                  value={questionForm.author_name}
                  onChange={(e) => setQuestionForm((p) => ({ ...p, author_name: e.target.value }))}
                  className="rounded-none mt-1"
                  placeholder="O seu nome"
                />
              </div>
              <div>
                <Label className="font-body text-xs">Email (opcional)</Label>
                <Input
                  type="email"
                  value={questionForm.author_email}
                  onChange={(e) => setQuestionForm((p) => ({ ...p, author_email: e.target.value }))}
                  className="rounded-none mt-1"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label className="font-body text-xs">Pergunta *</Label>
              <Textarea
                value={questionForm.question}
                onChange={(e) => setQuestionForm((p) => ({ ...p, question: e.target.value }))}
                className="rounded-none mt-1 min-h-[120px]"
                placeholder="Escreva a sua dúvida…"
              />
            </div>

            <Button
              className="mt-4 w-full rounded-none font-body text-sm tracking-wider"
              disabled={isSendingQuestion}
              onClick={async () => {
                const q = String(questionForm.question ?? '').trim();
                if (q.length < 5) return toast.error('Escreva uma pergunta (mín. 5 caracteres).');
                try {
                  setIsSendingQuestion(true);
                  await base44.faq.questions.create({
                    question: q,
                    author_name: String(questionForm.author_name ?? '').trim() || null,
                    author_email: String(questionForm.author_email ?? '').trim() || null,
                  });
                  toast.success('Questão enviada.');
                  setQuestionForm((p) => ({ ...p, question: '' }));
                } catch (err) {
                  toast.error(getErrorMessage(err, 'Não foi possível enviar.'));
                } finally {
                  setIsSendingQuestion(false);
                }
              }}
            >
              {isSendingQuestion ? 'A enviar…' : 'Enviar questão'}
            </Button>
          </div>
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
