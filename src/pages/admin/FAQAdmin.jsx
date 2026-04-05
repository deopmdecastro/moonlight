import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HelpCircle, Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';

import { base44 } from '@/api/base44Client';
import { getErrorMessage, toastApiPromise } from '@/lib/toast';
import { guideDefaults } from '@/lib/useGuideContent';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import DeleteIcon from '@/components/ui/delete-icon';
import LoadMoreControls from '@/components/ui/load-more-controls';
import ImageUpload from '@/components/uploads/ImageUpload';

const emptyFaqItem = { question: '', answer: '', order: 0, is_active: true };

function toLines(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join('\n');
  if (typeof value === 'string') return value;
  return '';
}

function fromLines(value) {
  return String(value ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function mergeSection(def, value) {
  const base = def && typeof def === 'object' ? def : {};
  const next = value && typeof value === 'object' ? value : {};
  return { ...base, ...next };
}

export default function FAQAdmin() {
  const queryClient = useQueryClient();

  // Guide (page content)
  const { data: guideRes, isLoading: isLoadingGuide } = useQuery({
    queryKey: ['admin-guide'],
    queryFn: () => base44.admin.content.guide.get(),
  });

  const guideExisting = guideRes?.content ?? null;

  const guideInitial = useMemo(() => {
    const v = guideExisting && typeof guideExisting === 'object' ? guideExisting : {};
    const cronograma = mergeSection(guideDefaults.cronograma, v.cronograma);
    const umectacao = mergeSection(guideDefaults.umectacao, v.umectacao);
    const letter = mergeSection(guideDefaults.letter, v.letter);

    const steps = Array.isArray(cronograma.steps) ? cronograma.steps : guideDefaults.cronograma.steps;
    const normSteps = (Array.isArray(steps) ? steps : []).slice(0, 3).map((s, idx) => ({
      number: String(s?.number ?? guideDefaults.cronograma.steps[idx]?.number ?? ''),
      title: String(s?.title ?? guideDefaults.cronograma.steps[idx]?.title ?? ''),
      description: String(s?.description ?? guideDefaults.cronograma.steps[idx]?.description ?? ''),
    }));

    return {
      cronograma: {
        eyebrow: String(cronograma.eyebrow ?? ''),
        title: String(cronograma.title ?? ''),
        title_highlight: String(cronograma.title_highlight ?? ''),
        subtitle: String(cronograma.subtitle ?? ''),
        steps: normSteps,
      },
      umectacao: {
        eyebrow: String(umectacao.eyebrow ?? ''),
        title: String(umectacao.title ?? ''),
        body: String(umectacao.body ?? ''),
        bulletsText: toLines(umectacao.bullets ?? guideDefaults.umectacao.bullets),
        image_url: String(umectacao.image_url ?? ''),
        image_alt: String(umectacao.image_alt ?? ''),
      },
      letter: {
        eyebrow: String(letter.eyebrow ?? ''),
        title: String(letter.title ?? ''),
        body_1: String(letter.body_1 ?? ''),
        body_2: String(letter.body_2 ?? ''),
        signature: String(letter.signature ?? ''),
      },
    };
  }, [guideExisting]);

  const [guideForm, setGuideForm] = useState(guideInitial);

  useEffect(() => {
    setGuideForm(guideInitial);
  }, [guideInitial]);

  const saveGuideMutation = useMutation({
    mutationFn: (payload) => base44.admin.content.guide.update(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-guide'] });
      await queryClient.invalidateQueries({ queryKey: ['content-guide'] });
      toast.success('Guia Capilar atualizado.');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Não foi possível guardar.')),
  });

  const saveGuide = async () => {
    const payload = {
      cronograma: {
        eyebrow: String(guideForm.cronograma?.eyebrow ?? '').trim() || null,
        title: String(guideForm.cronograma?.title ?? '').trim() || null,
        title_highlight: String(guideForm.cronograma?.title_highlight ?? '').trim() || null,
        subtitle: String(guideForm.cronograma?.subtitle ?? '').trim() || null,
        steps: (guideForm.cronograma?.steps ?? []).slice(0, 3).map((s, idx) => ({
          number: String(s?.number ?? guideDefaults.cronograma.steps[idx]?.number ?? '').trim() || null,
          title: String(s?.title ?? '').trim() || null,
          description: String(s?.description ?? '').trim() || null,
        })),
      },
      umectacao: {
        eyebrow: String(guideForm.umectacao?.eyebrow ?? '').trim() || null,
        title: String(guideForm.umectacao?.title ?? '').trim() || null,
        body: String(guideForm.umectacao?.body ?? '').trim() || null,
        bullets: fromLines(guideForm.umectacao?.bulletsText),
        image_url: String(guideForm.umectacao?.image_url ?? '').trim() || null,
        image_alt: String(guideForm.umectacao?.image_alt ?? '').trim() || null,
      },
      letter: {
        eyebrow: String(guideForm.letter?.eyebrow ?? '').trim() || null,
        title: String(guideForm.letter?.title ?? '').trim() || null,
        body_1: String(guideForm.letter?.body_1 ?? '').trim() || null,
        body_2: String(guideForm.letter?.body_2 ?? '').trim() || null,
        signature: String(guideForm.letter?.signature ?? '').trim() || null,
      },
    };

    await toastApiPromise(saveGuideMutation.mutateAsync(payload), {
      loading: 'A guardar...',
      success: 'Conteúdo atualizado.',
      error: (e) => getErrorMessage(e, 'Não foi possível guardar.'),
    });
  };

  // FAQ (items + questions)
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState(emptyFaqItem);
  const [questionStatus, setQuestionStatus] = useState('pending');
  const [questionsLimit, setQuestionsLimit] = useState(50);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerDraft, setAnswerDraft] = useState('');
  const [publish, setPublish] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: ['admin-faq'],
    queryFn: () => base44.entities.FaqItem.list(500),
  });

  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['admin-faq-questions', questionStatus, questionsLimit],
    queryFn: () => base44.admin.faqQuestions.list({ status: questionStatus, public: 'all', limit: questionsLimit }),
  });

  const canLoadMoreQuestions =
    !isLoadingQuestions && Array.isArray(questions) && questions.length === questionsLimit && questionsLimit < 500;

  const sortedItems = useMemo(() => {
    return [...(Array.isArray(items) ? items : [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [items]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.FaqItem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faq'] });
      queryClient.invalidateQueries({ queryKey: ['faq'] });
      setFaqDialogOpen(false);
      toast.success('Pergunta criada');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Não foi possível criar.')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.FaqItem.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faq'] });
      queryClient.invalidateQueries({ queryKey: ['faq'] });
      setFaqDialogOpen(false);
      toast.success('Pergunta atualizada');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Não foi possível atualizar.')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FaqItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faq'] });
      queryClient.invalidateQueries({ queryKey: ['faq'] });
      toast.success('Removida');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Não foi possível remover.')),
  });

  const answerQuestionMutation = useMutation({
    mutationFn: ({ id, patch }) => base44.admin.faqQuestions.update(id, patch),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-faq-questions'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-faq'] });
      await queryClient.invalidateQueries({ queryKey: ['faq'] });
      toast.success('Resposta guardada');
      setSelectedQuestion(null);
      setAnswerDraft('');
      setPublish(false);
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Não foi possível guardar.')),
  });

  const openFaqCreate = () => {
    setEditingFaq(null);
    setFaqForm(emptyFaqItem);
    setFaqDialogOpen(true);
  };

  const openFaqEdit = (item) => {
    setEditingFaq(item);
    setFaqForm({
      question: item.question ?? '',
      answer: item.answer ?? '',
      order: item.order ?? 0,
      is_active: item.is_active !== false,
    });
    setFaqDialogOpen(true);
  };

  const openAnswer = (q) => {
    setSelectedQuestion(q);
    setAnswerDraft(q?.answer ?? '');
    setPublish(!!q?.is_public);
  };

  const submitFaq = () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast.error('Preencha pergunta e resposta');
      return;
    }
    const data = { ...faqForm, order: Number(faqForm.order) || 0 };
    if (editingFaq) updateMutation.mutate({ id: editingFaq.id, data });
    else createMutation.mutate(data);
  };

  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-3xl">Guia Capilar</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Edite o conteúdo da página e as perguntas frequentes.</p>
        </div>
        <Button
          onClick={saveGuide}
          className="rounded-none font-body text-sm tracking-wider"
          disabled={isLoadingGuide || saveGuideMutation.isPending}
        >
          Guardar página
        </Button>
      </div>

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="font-heading text-xl mb-4">Cronograma</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-xs">Eyebrow</Label>
              <Input
                value={guideForm.cronograma.eyebrow}
                onChange={(e) => setGuideForm((p) => ({ ...p, cronograma: { ...p.cronograma, eyebrow: e.target.value } }))}
                className="rounded-none mt-1"
              />
            </div>
            <div>
              <Label className="font-body text-xs">Subtítulo</Label>
              <Input
                value={guideForm.cronograma.subtitle}
                onChange={(e) => setGuideForm((p) => ({ ...p, cronograma: { ...p.cronograma, subtitle: e.target.value } }))}
                className="rounded-none mt-1"
              />
            </div>
            <div>
              <Label className="font-body text-xs">Título</Label>
              <Input
                value={guideForm.cronograma.title}
                onChange={(e) => setGuideForm((p) => ({ ...p, cronograma: { ...p.cronograma, title: e.target.value } }))}
                className="rounded-none mt-1"
              />
            </div>
            <div>
              <Label className="font-body text-xs">Destaque</Label>
              <Input
                value={guideForm.cronograma.title_highlight}
                onChange={(e) =>
                  setGuideForm((p) => ({ ...p, cronograma: { ...p.cronograma, title_highlight: e.target.value } }))
                }
                className="rounded-none mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
            {(guideForm.cronograma.steps ?? []).slice(0, 3).map((s, idx) => (
              <div key={idx} className="border border-border rounded-md p-4 bg-secondary/20 space-y-3">
                <div className="text-xs font-mono text-muted-foreground">Etapa {idx + 1}</div>
                <div>
                  <Label className="font-body text-xs">Título</Label>
                  <Input
                    value={s.title ?? ''}
                    onChange={(e) =>
                      setGuideForm((p) => ({
                        ...p,
                        cronograma: {
                          ...p.cronograma,
                          steps: (p.cronograma.steps ?? []).map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)),
                        },
                      }))
                    }
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Descrição</Label>
                  <Textarea
                    value={s.description ?? ''}
                    onChange={(e) =>
                      setGuideForm((p) => ({
                        ...p,
                        cronograma: {
                          ...p.cronograma,
                          steps: (p.cronograma.steps ?? []).map((x, i) =>
                            i === idx ? { ...x, description: e.target.value } : x,
                          ),
                        },
                      }))
                    }
                    className="rounded-none mt-1 min-h-[110px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="font-heading text-xl mb-4">Umectação</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <ImageUpload
              value={guideForm.umectacao.image_url}
              label="Imagem"
              recommended="1200×900"
              onChange={(url) => setGuideForm((p) => ({ ...p, umectacao: { ...p.umectacao, image_url: url } }))}
            />
            <div className="space-y-4">
              <div>
                <Label className="font-body text-xs">Eyebrow</Label>
                <Input
                  value={guideForm.umectacao.eyebrow}
                  onChange={(e) => setGuideForm((p) => ({ ...p, umectacao: { ...p.umectacao, eyebrow: e.target.value } }))}
                  className="rounded-none mt-1"
                />
              </div>
              <div>
                <Label className="font-body text-xs">Título</Label>
                <Input
                  value={guideForm.umectacao.title}
                  onChange={(e) => setGuideForm((p) => ({ ...p, umectacao: { ...p.umectacao, title: e.target.value } }))}
                  className="rounded-none mt-1"
                />
              </div>
              <div>
                <Label className="font-body text-xs">Alt da imagem</Label>
                <Input
                  value={guideForm.umectacao.image_alt}
                  onChange={(e) =>
                    setGuideForm((p) => ({ ...p, umectacao: { ...p.umectacao, image_alt: e.target.value } }))
                  }
                  className="rounded-none mt-1"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Label className="font-body text-xs">Texto</Label>
            <Textarea
              value={guideForm.umectacao.body}
              onChange={(e) => setGuideForm((p) => ({ ...p, umectacao: { ...p.umectacao, body: e.target.value } }))}
              className="rounded-none mt-1 min-h-[140px]"
            />
          </div>
          <div className="mt-4">
            <Label className="font-body text-xs">Bullets (1 por linha)</Label>
            <Textarea
              value={guideForm.umectacao.bulletsText}
              onChange={(e) =>
                setGuideForm((p) => ({ ...p, umectacao: { ...p.umectacao, bulletsText: e.target.value } }))
              }
              className="rounded-none mt-1 min-h-[140px]"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="font-heading text-xl mb-4">Carta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-xs">Eyebrow</Label>
              <Input
                value={guideForm.letter.eyebrow}
                onChange={(e) => setGuideForm((p) => ({ ...p, letter: { ...p.letter, eyebrow: e.target.value } }))}
                className="rounded-none mt-1"
              />
            </div>
            <div>
              <Label className="font-body text-xs">Título</Label>
              <Input
                value={guideForm.letter.title}
                onChange={(e) => setGuideForm((p) => ({ ...p, letter: { ...p.letter, title: e.target.value } }))}
                className="rounded-none mt-1"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label className="font-body text-xs">Parágrafo 1</Label>
            <Textarea
              value={guideForm.letter.body_1}
              onChange={(e) => setGuideForm((p) => ({ ...p, letter: { ...p.letter, body_1: e.target.value } }))}
              className="rounded-none mt-1 min-h-[140px]"
            />
          </div>
          <div className="mt-4">
            <Label className="font-body text-xs">Parágrafo 2</Label>
            <Textarea
              value={guideForm.letter.body_2}
              onChange={(e) => setGuideForm((p) => ({ ...p, letter: { ...p.letter, body_2: e.target.value } }))}
              className="rounded-none mt-1 min-h-[140px]"
            />
          </div>
          <div className="mt-4">
            <Label className="font-body text-xs">Assinatura</Label>
            <Input
              value={guideForm.letter.signature}
              onChange={(e) => setGuideForm((p) => ({ ...p, letter: { ...p.letter, signature: e.target.value } }))}
              className="rounded-none mt-1"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div>
          <h2 className="font-heading text-2xl">Perguntas enviadas</h2>
          <p className="font-body text-sm text-muted-foreground mt-1">Clientes enviam perguntas; responda e publique no FAQ.</p>
        </div>
        <Select value={questionStatus} onValueChange={setQuestionStatus}>
          <SelectTrigger className="w-56 rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Perguntas pendentes</SelectItem>
            <SelectItem value="answered">Respondidas</SelectItem>
            <SelectItem value="all">Todas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left p-3 font-body text-xs text-muted-foreground">Pergunta</th>
              <th className="text-left p-3 font-body text-xs text-muted-foreground">Contacto</th>
              <th className="text-left p-3 font-body text-xs text-muted-foreground">Estado</th>
              <th className="text-right p-3 font-body text-xs text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(isLoadingQuestions ? [] : questions).map((q) => (
              <tr key={q.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                <td className="p-3 font-body text-sm">
                  <div className="font-medium line-clamp-2">{q.question}</div>
                  {q.answer ? <div className="text-xs text-muted-foreground line-clamp-1 mt-1">{q.answer}</div> : null}
                </td>
                <td className="p-3 font-body text-xs text-muted-foreground">
                  <div>{q.author_name ?? '—'}</div>
                  <div className="mt-1">{q.author_email ?? '—'}</div>
                </td>
                <td className="p-3 font-body text-xs">
                  {q.answered_date ? <span className="text-green-700">Respondida</span> : <span className="text-muted-foreground">Pendente</span>}
                  {q.is_public ? <span className="ml-2 text-primary">• Pública</span> : null}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Button variant="outline" className="rounded-none font-body text-xs" onClick={() => openAnswer(q)}>
                    Responder
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoadingQuestions && (questions ?? []).length === 0 ? (
          <div className="text-center py-10">
            <HelpCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="font-body text-sm text-muted-foreground">Sem perguntas</p>
          </div>
        ) : null}
      </div>

      <LoadMoreControls
        leftText={`A mostrar as últimas ${Math.min(questionsLimit, Array.isArray(questions) ? questions.length : 0)} perguntas.`}
        onLess={() => setQuestionsLimit(50)}
        lessDisabled={isLoadingQuestions || questionsLimit <= 50}
        onMore={() => setQuestionsLimit((p) => Math.min(500, p + 50))}
        moreDisabled={!canLoadMoreQuestions}
      />

      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h2 className="font-heading text-2xl">Perguntas Frequentes (FAQ)</h2>
        <Button onClick={openFaqCreate} className="rounded-none font-body text-sm gap-2">
          <Plus className="w-4 h-4" /> Nova
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left p-3 font-body text-xs text-muted-foreground">Ordem</th>
              <th className="text-left p-3 font-body text-xs text-muted-foreground">Pergunta</th>
              <th className="text-left p-3 font-body text-xs text-muted-foreground">Ativo</th>
              <th className="text-right p-3 font-body text-xs text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                <td className="p-3 font-body text-xs text-muted-foreground">{item.order ?? 0}</td>
                <td className="p-3 font-body text-sm font-medium">{item.question}</td>
                <td className="p-3 font-body text-xs">{item.is_active ? 'Sim' : 'Não'}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Button variant="ghost" size="icon" onClick={() => openFaqEdit(item)} title="Editar">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (!window.confirm('Tem certeza que deseja remover?')) return;
                      deleteMutation.mutate(item.id);
                    }}
                    title="Remover"
                  >
                    <DeleteIcon className="text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedItems.length === 0 && (
          <div className="text-center py-10">
            <HelpCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="font-body text-sm text-muted-foreground">Sem perguntas</p>
          </div>
        )}
      </div>

      <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">{editingFaq ? 'Editar' : 'Nova'} pergunta</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="font-body text-xs">Pergunta</Label>
              <Input value={faqForm.question} onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} className="rounded-none mt-1" />
            </div>
            <div>
              <Label className="font-body text-xs">Resposta</Label>
              <Textarea value={faqForm.answer} onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })} className="rounded-none mt-1 min-h-[140px]" />
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <Label className="font-body text-xs">Ordem</Label>
                <Input type="number" value={faqForm.order} onChange={(e) => setFaqForm({ ...faqForm, order: e.target.value })} className="rounded-none mt-1" />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <Switch checked={faqForm.is_active} onCheckedChange={(v) => setFaqForm({ ...faqForm, is_active: v })} />
                <Label className="font-body text-xs">Ativo</Label>
              </div>
            </div>
            <Button onClick={submitFaq} className="w-full rounded-none font-body text-sm tracking-wider">
              {editingFaq ? 'Guardar' : 'Criar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedQuestion}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedQuestion(null);
            setAnswerDraft('');
            setPublish(false);
          }
        }}
      >
        <DialogContent aria-describedby={undefined} className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Responder pergunta</DialogTitle>
          </DialogHeader>
          {selectedQuestion ? (
            <div className="space-y-4">
              <div className="font-body text-sm">
                <div className="text-xs text-muted-foreground">
                  {new Date(selectedQuestion.created_date).toLocaleString('pt-PT')} • {selectedQuestion.author_email ?? '—'}
                </div>
                <div className="mt-2 whitespace-pre-wrap">{selectedQuestion.question}</div>
              </div>

              <div>
                <Label className="font-body text-xs">Resposta</Label>
                <Textarea
                  value={answerDraft}
                  onChange={(e) => setAnswerDraft(e.target.value)}
                  className="rounded-none mt-1 min-h-[140px]"
                  placeholder="Escreva a resposta…"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={publish} onCheckedChange={setPublish} />
                <Label className="font-body text-xs">Publicar no FAQ para clientes</Label>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" className="rounded-none font-body text-sm" onClick={() => setSelectedQuestion(null)}>
                  Cancelar
                </Button>
                <Button
                  className="rounded-none font-body text-sm tracking-wider"
                  disabled={answerQuestionMutation.isPending}
                  onClick={() => {
                    if (!selectedQuestion?.id) return;
                    const answer = String(answerDraft ?? '').trim();
                    if (!answer) return toast.error('Escreva uma resposta');
                    answerQuestionMutation.mutate({ id: selectedQuestion.id, patch: { answer, is_public: publish } });
                  }}
                >
                  {answerQuestionMutation.isPending ? 'A guardar…' : 'Guardar'}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

