import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';

import { base44 } from '@/api/base44Client';
import { landingDefaultsV2 } from '@/lib/useLandingContent';
import { getErrorMessage, toastApiPromise } from '@/lib/toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/uploads/ImageUpload';

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

function getExistingV2(value) {
  if (!value || typeof value !== 'object') return null;
  if (value.v2 && typeof value.v2 === 'object') return value.v2;
  return value;
}

export default function LandingAdmin() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-landing'],
    queryFn: () => base44.admin.content.landing.get(),
  });

  const legacy = data?.content && typeof data.content === 'object' ? data.content : {};
  const existingV2 = getExistingV2(legacy) ?? null;

  const initial = useMemo(() => {
    const hero = mergeSection(landingDefaultsV2.hero, existingV2?.hero);
    const about = mergeSection(landingDefaultsV2.about, existingV2?.about);
    const products = mergeSection(landingDefaultsV2.products, existingV2?.products);
    const timeline = mergeSection(landingDefaultsV2.timeline, existingV2?.timeline);
    const quote = mergeSection(landingDefaultsV2.quote, existingV2?.quote);
    const cta = mergeSection(landingDefaultsV2.cta, existingV2?.cta);

    const productItems = Array.isArray(products.items) ? products.items : landingDefaultsV2.products.items;
    const timelineSteps = Array.isArray(timeline.steps) ? timeline.steps : landingDefaultsV2.timeline.steps;

    return {
      hero: { ...hero },
      about: { ...about, bulletsText: toLines(about.bullets ?? []) },
      products: { ...products, items: productItems.map((it) => ({ ...it })) },
      timeline: { ...timeline, steps: timelineSteps.map((s) => ({ ...s })) },
      quote: { ...quote },
      cta: { ...cta },
    };
  }, [existingV2]);

  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const saveMutation = useMutation({
    mutationFn: (payload) => base44.admin.content.landing.update(payload),
  });

  const handleSave = async () => {
    const v2 = {
      hero: {
        image_url: String(form.hero?.image_url ?? '').trim() || null,
        eyebrow: String(form.hero?.eyebrow ?? '').trim() || null,
        title: String(form.hero?.title ?? '').trim() || null,
        title_highlight: String(form.hero?.title_highlight ?? '').trim() || null,
        subtitle: String(form.hero?.subtitle ?? '').trim() || null,
        primary_cta_label: String(form.hero?.primary_cta_label ?? '').trim() || null,
        primary_cta_to: String(form.hero?.primary_cta_to ?? '').trim() || null,
        secondary_cta_label: String(form.hero?.secondary_cta_label ?? '').trim() || null,
        secondary_cta_to: String(form.hero?.secondary_cta_to ?? '').trim() || null,
      },
      about: {
        image_url: String(form.about?.image_url ?? '').trim() || null,
        image_alt: String(form.about?.image_alt ?? '').trim() || null,
        eyebrow: String(form.about?.eyebrow ?? '').trim() || null,
        title: String(form.about?.title ?? '').trim() || null,
        title_highlight: String(form.about?.title_highlight ?? '').trim() || null,
        body: String(form.about?.body ?? '').trim() || null,
        bullets: fromLines(form.about?.bulletsText),
        badge_letter: String(form.about?.badge_letter ?? '').trim() || null,
        cta_label: String(form.about?.cta_label ?? '').trim() || null,
        cta_to: String(form.about?.cta_to ?? '').trim() || null,
      },
      products: {
        image_url: String(form.products?.image_url ?? '').trim() || null,
        image_alt: String(form.products?.image_alt ?? '').trim() || null,
        eyebrow: String(form.products?.eyebrow ?? '').trim() || null,
        title: String(form.products?.title ?? '').trim() || null,
        title_highlight: String(form.products?.title_highlight ?? '').trim() || null,
        subtitle: String(form.products?.subtitle ?? '').trim() || null,
        items: (form.products?.items ?? [])
          .map((it) => ({
            name: String(it?.name ?? '').trim(),
            benefit: String(it?.benefit ?? '').trim(),
          }))
          .filter((it) => it.name || it.benefit),
        cta_label: String(form.products?.cta_label ?? '').trim() || null,
        cta_to: String(form.products?.cta_to ?? '').trim() || null,
      },
      timeline: {
        eyebrow: String(form.timeline?.eyebrow ?? '').trim() || null,
        title: String(form.timeline?.title ?? '').trim() || null,
        title_highlight: String(form.timeline?.title_highlight ?? '').trim() || null,
        steps: (form.timeline?.steps ?? [])
          .map((s) => ({
            title: String(s?.title ?? '').trim(),
            description: String(s?.description ?? '').trim(),
          }))
          .filter((s) => s.title || s.description)
          .slice(0, 3),
        cta_label: String(form.timeline?.cta_label ?? '').trim() || null,
        cta_to: String(form.timeline?.cta_to ?? '').trim() || null,
      },
      quote: {
        image_url: String(form.quote?.image_url ?? '').trim() || null,
        image_alt: String(form.quote?.image_alt ?? '').trim() || null,
        text: String(form.quote?.text ?? '').trim() || null,
        highlight: String(form.quote?.highlight ?? '').trim() || null,
        footer: String(form.quote?.footer ?? '').trim() || null,
      },
      cta: {
        title: String(form.cta?.title ?? '').trim() || null,
        title_highlight: String(form.cta?.title_highlight ?? '').trim() || null,
        subtitle: String(form.cta?.subtitle ?? '').trim() || null,
        primary_label: String(form.cta?.primary_label ?? '').trim() || null,
        primary_url: String(form.cta?.primary_url ?? '').trim() || null,
        secondary_label: String(form.cta?.secondary_label ?? '').trim() || null,
        secondary_url: String(form.cta?.secondary_url ?? '').trim() || null,
      },
    };

    const payload = { ...legacy, version: 2, v2 };

    await toastApiPromise(saveMutation.mutateAsync(payload), {
      loading: 'A guardar...',
      success: 'Conteúdo guardado com sucesso.',
      error: (e) => getErrorMessage(e, 'Não foi possível guardar.'),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h2 className="font-heading text-2xl">Landing page (atual)</h2>
        <Button onClick={handleSave} className="rounded-none font-body text-sm tracking-wider" disabled={isLoading}>
          Guardar
        </Button>
      </div>

      {isLoading ? (
        <p className="font-body text-sm text-muted-foreground">A carregar...</p>
      ) : (
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-heading text-xl mb-4">Hero</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ImageUpload
                  value={form.hero?.image_url ?? ''}
                  label="Imagem de fundo"
                  recommended="1920×1080"
                  onChange={(url) => setForm((p) => ({ ...p, hero: { ...p.hero, image_url: url } }))}
                />
                <div>
                  <Label className="font-body text-xs">Eyebrow</Label>
                  <Input
                    value={form.hero?.eyebrow ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, hero: { ...p.hero, eyebrow: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="font-body text-xs">Título</Label>
                  <Input
                    value={form.hero?.title ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Parte em destaque (amarelo)</Label>
                  <Input
                    value={form.hero?.title_highlight ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, hero: { ...p.hero, title_highlight: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Subtítulo</Label>
                  <Textarea
                    value={form.hero?.subtitle ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))}
                    className="rounded-none mt-1 min-h-[110px]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="font-body text-xs">CTA primário (texto)</Label>
                    <Input
                      value={form.hero?.primary_cta_label ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, hero: { ...p.hero, primary_cta_label: e.target.value } }))}
                      className="rounded-none mt-1"
                    />
                  </div>
                  <div>
                    <Label className="font-body text-xs">CTA primário (link)</Label>
                    <Input
                      value={form.hero?.primary_cta_to ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, hero: { ...p.hero, primary_cta_to: e.target.value } }))}
                      className="rounded-none mt-1"
                      placeholder="/produtos"
                    />
                  </div>
                  <div>
                    <Label className="font-body text-xs">CTA secundário (texto)</Label>
                    <Input
                      value={form.hero?.secondary_cta_label ?? ''}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, hero: { ...p.hero, secondary_cta_label: e.target.value } }))
                      }
                      className="rounded-none mt-1"
                    />
                  </div>
                  <div>
                    <Label className="font-body text-xs">CTA secundário (link)</Label>
                    <Input
                      value={form.hero?.secondary_cta_to ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, hero: { ...p.hero, secondary_cta_to: e.target.value } }))}
                      className="rounded-none mt-1"
                      placeholder="/sobre"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-heading text-xl mb-4">Sobre (preview)</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ImageUpload
                  value={form.about?.image_url ?? ''}
                  label="Imagem"
                  recommended="1200×1600"
                  onChange={(url) => setForm((p) => ({ ...p, about: { ...p.about, image_url: url } }))}
                />
                <div>
                  <Label className="font-body text-xs">Alt (acessibilidade)</Label>
                  <Input
                    value={form.about?.image_alt ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, about: { ...p.about, image_alt: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Letra do selo (bolinha)</Label>
                  <Input
                    value={form.about?.badge_letter ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, about: { ...p.about, badge_letter: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="font-body text-xs">Eyebrow</Label>
                  <Input
                    value={form.about?.eyebrow ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, about: { ...p.about, eyebrow: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Título</Label>
                  <Input
                    value={form.about?.title ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, about: { ...p.about, title: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Parte em destaque</Label>
                  <Input
                    value={form.about?.title_highlight ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, about: { ...p.about, title_highlight: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Texto</Label>
                  <Textarea
                    value={form.about?.body ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, about: { ...p.about, body: e.target.value } }))}
                    className="rounded-none mt-1 min-h-[140px]"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Bullets (1 por linha)</Label>
                  <Textarea
                    value={form.about?.bulletsText ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, about: { ...p.about, bulletsText: e.target.value } }))}
                    className="rounded-none mt-1 min-h-[120px]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="font-body text-xs">Link (texto)</Label>
                    <Input
                      value={form.about?.cta_label ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, about: { ...p.about, cta_label: e.target.value } }))}
                      className="rounded-none mt-1"
                    />
                  </div>
                  <div>
                    <Label className="font-body text-xs">Link (destino)</Label>
                    <Input
                      value={form.about?.cta_to ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, about: { ...p.about, cta_to: e.target.value } }))}
                      className="rounded-none mt-1"
                      placeholder="/sobre"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-heading text-xl mb-4">Produtos (preview)</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ImageUpload
                  value={form.products?.image_url ?? ''}
                  label="Imagem"
                  recommended="1600×1200"
                  onChange={(url) => setForm((p) => ({ ...p, products: { ...p.products, image_url: url } }))}
                />
                <div>
                  <Label className="font-body text-xs">Alt (acessibilidade)</Label>
                  <Input
                    value={form.products?.image_alt ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, products: { ...p.products, image_alt: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="font-body text-xs">Eyebrow</Label>
                  <Input
                    value={form.products?.eyebrow ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, products: { ...p.products, eyebrow: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Título</Label>
                  <Input
                    value={form.products?.title ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, products: { ...p.products, title: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Parte em destaque</Label>
                  <Input
                    value={form.products?.title_highlight ?? ''}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, products: { ...p.products, title_highlight: e.target.value } }))
                    }
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Subtítulo</Label>
                  <Textarea
                    value={form.products?.subtitle ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, products: { ...p.products, subtitle: e.target.value } }))}
                    className="rounded-none mt-1 min-h-[110px]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="font-body text-sm text-muted-foreground">Lista (nome + benefício)</div>
                <Button
                  variant="outline"
                  className="rounded-none font-body text-xs gap-2"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      products: { ...p.products, items: [...(p.products?.items ?? []), { name: '', benefit: '' }] },
                    }))
                  }
                >
                  <Plus className="w-4 h-4" /> Adicionar
                </Button>
              </div>

              <div className="space-y-2">
                {(form.products?.items ?? []).map((it, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
                    <Input
                      value={it?.name ?? ''}
                      onChange={(e) =>
                        setForm((p) => {
                          const items = [...(p.products?.items ?? [])];
                          items[idx] = { ...items[idx], name: e.target.value };
                          return { ...p, products: { ...p.products, items } };
                        })
                      }
                      className="rounded-none"
                      placeholder="Nome"
                    />
                    <Input
                      value={it?.benefit ?? ''}
                      onChange={(e) =>
                        setForm((p) => {
                          const items = [...(p.products?.items ?? [])];
                          items[idx] = { ...items[idx], benefit: e.target.value };
                          return { ...p, products: { ...p.products, items } };
                        })
                      }
                      className="rounded-none"
                      placeholder="Benefício"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setForm((p) => {
                          const items = [...(p.products?.items ?? [])];
                          items.splice(idx, 1);
                          return { ...p, products: { ...p.products, items } };
                        })
                      }
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <div>
                  <Label className="font-body text-xs">Link (texto)</Label>
                  <Input
                    value={form.products?.cta_label ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, products: { ...p.products, cta_label: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Link (destino)</Label>
                  <Input
                    value={form.products?.cta_to ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, products: { ...p.products, cta_to: e.target.value } }))}
                    className="rounded-none mt-1"
                    placeholder="/produtos"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-heading text-xl mb-4">Cronograma (timeline)</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="font-body text-xs">Eyebrow</Label>
                  <Input
                    value={form.timeline?.eyebrow ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, timeline: { ...p.timeline, eyebrow: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Título</Label>
                  <Input
                    value={form.timeline?.title ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, timeline: { ...p.timeline, title: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Parte em destaque</Label>
                  <Input
                    value={form.timeline?.title_highlight ?? ''}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, timeline: { ...p.timeline, title_highlight: e.target.value } }))
                    }
                    className="rounded-none mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="font-body text-sm text-muted-foreground">Passos (máx. 3)</div>
                <div className="space-y-3">
                  {(form.timeline?.steps ?? []).slice(0, 3).map((s, idx) => (
                    <div key={idx} className="border border-border rounded-lg p-3 space-y-2">
                      <Input
                        value={s?.title ?? ''}
                        onChange={(e) =>
                          setForm((p) => {
                            const steps = [...(p.timeline?.steps ?? [])];
                            steps[idx] = { ...steps[idx], title: e.target.value };
                            return { ...p, timeline: { ...p.timeline, steps } };
                          })
                        }
                        className="rounded-none"
                        placeholder="Título"
                      />
                      <Textarea
                        value={s?.description ?? ''}
                        onChange={(e) =>
                          setForm((p) => {
                            const steps = [...(p.timeline?.steps ?? [])];
                            steps[idx] = { ...steps[idx], description: e.target.value };
                            return { ...p, timeline: { ...p.timeline, steps } };
                          })
                        }
                        className="rounded-none min-h-[90px]"
                        placeholder="Descrição"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="font-body text-xs">Link (texto)</Label>
                    <Input
                      value={form.timeline?.cta_label ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, timeline: { ...p.timeline, cta_label: e.target.value } }))}
                      className="rounded-none mt-1"
                    />
                  </div>
                  <div>
                    <Label className="font-body text-xs">Link (destino)</Label>
                    <Input
                      value={form.timeline?.cta_to ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, timeline: { ...p.timeline, cta_to: e.target.value } }))}
                      className="rounded-none mt-1"
                      placeholder="/guia"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-heading text-xl mb-4">Citação</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ImageUpload
                  value={form.quote?.image_url ?? ''}
                  label="Imagem"
                  recommended="512×512"
                  onChange={(url) => setForm((p) => ({ ...p, quote: { ...p.quote, image_url: url } }))}
                />
                <div>
                  <Label className="font-body text-xs">Alt (acessibilidade)</Label>
                  <Input
                    value={form.quote?.image_alt ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, quote: { ...p.quote, image_alt: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="font-body text-xs">Texto</Label>
                  <Textarea
                    value={form.quote?.text ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, quote: { ...p.quote, text: e.target.value } }))}
                    className="rounded-none mt-1 min-h-[120px]"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Palavra em destaque</Label>
                  <Input
                    value={form.quote?.highlight ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, quote: { ...p.quote, highlight: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Rodapé / Autor</Label>
                  <Input
                    value={form.quote?.footer ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, quote: { ...p.quote, footer: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-heading text-xl mb-4">CTA (final)</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="font-body text-xs">Título</Label>
                  <Input
                    value={form.cta?.title ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, cta: { ...p.cta, title: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Parte em destaque</Label>
                  <Input
                    value={form.cta?.title_highlight ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, cta: { ...p.cta, title_highlight: e.target.value } }))}
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Subtítulo</Label>
                  <Textarea
                    value={form.cta?.subtitle ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, cta: { ...p.cta, subtitle: e.target.value } }))}
                    className="rounded-none mt-1 min-h-[120px]"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="font-body text-xs">Botão 1 (texto)</Label>
                    <Input
                      value={form.cta?.primary_label ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, cta: { ...p.cta, primary_label: e.target.value } }))}
                      className="rounded-none mt-1"
                    />
                  </div>
                  <div>
                    <Label className="font-body text-xs">Botão 1 (URL)</Label>
                    <Input
                      value={form.cta?.primary_url ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, cta: { ...p.cta, primary_url: e.target.value } }))}
                      className="rounded-none mt-1"
                      placeholder="https://wa.me/..."
                    />
                  </div>
                  <div>
                    <Label className="font-body text-xs">Botão 2 (texto)</Label>
                    <Input
                      value={form.cta?.secondary_label ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, cta: { ...p.cta, secondary_label: e.target.value } }))}
                      className="rounded-none mt-1"
                    />
                  </div>
                  <div>
                    <Label className="font-body text-xs">Botão 2 (URL)</Label>
                    <Input
                      value={form.cta?.secondary_url ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, cta: { ...p.cta, secondary_url: e.target.value } }))}
                      className="rounded-none mt-1"
                      placeholder="(vazio = usa Branding @instagram)"
                    />
                  </div>
                </div>

                <div className="text-xs font-body text-muted-foreground">
                  Dica: para editar o @Instagram usado por padrão, vá a <b>Conteúdo → Branding</b>.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
