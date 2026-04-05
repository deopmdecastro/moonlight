import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, ChevronLeft, MessageSquare, Send } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

import { base44 } from '@/api/base44Client';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getErrorMessage } from '@/lib/toast';

const categoryLabels = {
  tendencias: 'Tendências',
  dicas: 'Dicas',
  novidades: 'Novidades',
  inspiracao: 'Inspiração',
};

export default function BlogPostPage() {
  const queryClient = useQueryClient();
  const { id: postId } = useParams();
  const { user } = useAuth();

  const [commentForm, setCommentForm] = useState({ author_name: '', author_email: '', content: '' });
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [didSubmit, setDidSubmit] = useState(false);

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', postId],
    queryFn: () => base44.entities.BlogPost.filter({ id: postId, status: 'published' }, '-created_date', 1),
    select: (data) => (Array.isArray(data) ? data[0] : null),
    enabled: Boolean(postId),
  });

  const { data: comments = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ['blog-comments', postId],
    queryFn: () => base44.blog.comments.list(postId, 200),
    enabled: Boolean(postId),
  });

  const { data: related = [] } = useQuery({
    queryKey: ['blog-related', postId],
    queryFn: () => base44.entities.BlogPost.filter({ status: 'published' }, '-created_date', 8),
    select: (data) => (Array.isArray(data) ? data.filter((p) => p?.id && p.id !== postId).slice(0, 3) : []),
    enabled: Boolean(postId),
  });

  useEffect(() => {
    setCommentForm((p) => ({
      ...p,
      author_name: p.author_name || user?.full_name || '',
      author_email: p.author_email || user?.email || '',
    }));
  }, [user?.email, user?.full_name]);

  const createCommentMutation = useMutation({
    mutationFn: (payload) => base44.blog.comments.create(postId, payload),
    onSuccess: () => {
      setDidSubmit(true);
      setCommentForm((p) => ({ ...p, content: '' }));
      toast.success('Comentário enviado (aguarda aprovação).');
      queryClient.invalidateQueries({ queryKey: ['blog-comments', postId] });
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Não foi possível enviar o comentário.')),
  });

  const replyMutation = useMutation({
    mutationFn: ({ commentId, message }) => base44.blog.comments.reply(commentId, message),
    onSuccess: () => {
      setReplyText('');
      setReplyingTo(null);
      toast.success('Resposta enviada.');
      queryClient.invalidateQueries({ queryKey: ['blog-comments', postId] });
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Não foi possível responder.')),
  });

  const categoryLabel = post?.category ? categoryLabels[post.category] || post.category : '';
  const createdLabel = post?.created_date ? format(new Date(post.created_date), 'd MMMM yyyy', { locale: pt }) : '';
  const commentsCount = Array.isArray(comments) ? comments.length : 0;

  const markdownComponents = useMemo(
    () => ({
      a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          {children}
        </a>
      ),
    }),
    [],
  );

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="h-8 bg-secondary/50 w-2/3 rounded mb-4" />
        <div className="h-4 bg-secondary/50 w-1/3 rounded" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="font-display text-2xl">Artigo não encontrado</p>
        <Link to="/blog" className="font-mono text-sm text-primary mt-4 inline-block">
          ← Voltar ao blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar ao blog
        </Link>

        <div className="mt-7 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <article className="min-w-0">
            <div className="overflow-hidden border border-border bg-card rounded-2xl">
              <div className="relative aspect-[16/9] bg-secondary/30">
                <ImageWithFallback
                  src={post.image_url}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  wrapperClassName="absolute inset-0"
                  iconClassName="w-16 h-16 opacity-[0.10] text-muted-foreground"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {categoryLabel ? (
                      <span className="rounded-full px-3 py-1 bg-white/90 text-foreground font-mono text-[10px] uppercase tracking-widest">
                        {categoryLabel}
                      </span>
                    ) : null}
                    {createdLabel ? (
                      <span className="rounded-full px-3 py-1 bg-white/10 text-white font-mono text-[10px] uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {createdLabel}
                      </span>
                    ) : null}
                    <a
                      href="#comentarios"
                      className="rounded-full px-3 py-1 bg-white/10 text-white font-mono text-[10px] uppercase tracking-widest flex items-center gap-1 hover:bg-white/15 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      {commentsCount}
                    </a>
                  </div>
                  <h1 className="font-display text-3xl md:text-5xl text-white leading-tight">{post.title}</h1>
                  {post.excerpt ? (
                    <p className="font-mono text-sm text-white/85 mt-4 max-w-2xl">{post.excerpt}</p>
                  ) : null}
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="prose prose-sm md:prose-base max-w-none prose-headings:font-display prose-p:font-mono prose-li:font-mono prose-strong:font-mono prose-a:font-mono">
                  <ReactMarkdown components={markdownComponents}>{String(post.content ?? '')}</ReactMarkdown>
                </div>
              </div>
            </div>

            <section id="comentarios" className="mt-10 scroll-mt-24">
              <div className="flex items-end justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-display text-2xl">Comentários</h2>
                  <p className="font-mono text-sm text-muted-foreground">
                    {didSubmit ? 'O seu comentário foi enviado e ficará visível após aprovação.' : 'Partilhe a sua opinião.'}
                  </p>
                </div>
                <div className="font-mono text-xs text-muted-foreground">{commentsCount} publicados</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="font-mono text-xs">Nome *</Label>
                      <Input
                        value={commentForm.author_name}
                        onChange={(e) => setCommentForm((p) => ({ ...p, author_name: e.target.value }))}
                        className="rounded-none mt-1 font-mono"
                      />
                    </div>
                    <div>
                      <Label className="font-mono text-xs">Email (opcional)</Label>
                      <Input
                        value={commentForm.author_email}
                        onChange={(e) => setCommentForm((p) => ({ ...p, author_email: e.target.value }))}
                        className="rounded-none mt-1 font-mono"
                      />
                    </div>
                    <div>
                      <Label className="font-mono text-xs">Comentário *</Label>
                      <Textarea
                        value={commentForm.content}
                        onChange={(e) => setCommentForm((p) => ({ ...p, content: e.target.value }))}
                        className="rounded-none mt-1 min-h-[140px] font-mono"
                        placeholder="Escreva o seu comentário..."
                      />
                      <p className="font-mono text-[11px] text-muted-foreground mt-2">
                        Os comentários são moderados e só aparecem depois de aprovados no admin.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      if (!commentForm.author_name.trim() || !commentForm.content.trim()) {
                        toast.error('Preencha nome e comentário.');
                        return;
                      }
                      createCommentMutation.mutate({
                        author_name: commentForm.author_name.trim(),
                        author_email: commentForm.author_email?.trim() || null,
                        content: commentForm.content.trim(),
                      });
                    }}
                    className="mt-4 w-full rounded-none font-mono text-xs uppercase tracking-widest gap-2"
                    disabled={createCommentMutation.isPending}
                  >
                    <Send className="w-4 h-4" />
                    Enviar
                  </Button>
                </div>

                <div className="space-y-3">
                  {isLoadingComments ? (
                    <div className="font-mono text-sm text-muted-foreground">A carregar comentários...</div>
                  ) : commentsCount === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <div className="font-mono text-sm text-muted-foreground">Ainda não há comentários publicados.</div>
                    </div>
                  ) : (
                    (comments ?? []).map((c) => (
                      <div key={c.id} className="bg-card border border-border rounded-2xl p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-mono text-sm text-foreground">{c.author_name}</div>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            {c.created_date ? new Date(c.created_date).toLocaleDateString('pt-PT') : ''}
                          </div>
                        </div>
                        <div className="font-mono text-sm text-foreground/85 mt-2 whitespace-pre-wrap">{c.content}</div>

                        {(c.replies ?? []).length > 0 ? (
                          <div className="mt-4 space-y-2">
                            {(c.replies ?? []).map((r) => (
                              <div key={r.id} className="border border-border/70 bg-secondary/10 rounded-xl p-4">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                                    {r.author_name}
                                  </div>
                                  <div className="font-mono text-[11px] text-muted-foreground">
                                    {r.created_date ? new Date(r.created_date).toLocaleString('pt-PT') : ''}
                                  </div>
                                </div>
                                <div className="font-mono text-sm text-foreground/85 mt-2 whitespace-pre-wrap">{r.message}</div>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {c.is_mine ? (
                          <div className="mt-4">
                            {replyingTo === c.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  className="rounded-none min-h-[110px] font-mono"
                                  placeholder="Escreva uma resposta..."
                                />
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button
                                    variant="outline"
                                    className="rounded-none font-mono text-xs uppercase tracking-widest"
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyText('');
                                    }}
                                    disabled={replyMutation.isPending}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    className="rounded-none font-mono text-xs uppercase tracking-widest"
                                    onClick={() => {
                                      if (!replyText.trim()) return toast.error('Escreva uma resposta.');
                                      replyMutation.mutate({ commentId: c.id, message: replyText.trim() });
                                    }}
                                    disabled={replyMutation.isPending}
                                  >
                                    Enviar resposta
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                className="rounded-none font-mono text-xs uppercase tracking-widest mt-3"
                                onClick={() => setReplyingTo(c.id)}
                              >
                                Responder
                              </Button>
                            )}
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </article>

          <aside className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="font-mono text-xs tracking-[0.35em] uppercase text-muted-foreground mb-2">Mais</div>
              <div className="font-display text-xl text-foreground">Outros artigos</div>
              <p className="font-mono text-sm text-muted-foreground mt-2">
                Continue a explorar conteúdos relacionados e novidades.
              </p>
            </div>

            {related.length > 0 ? (
              <div className="space-y-3">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/blog/${p.id}`}
                    className="block bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-colors"
                  >
                    <div className="relative aspect-[16/9] bg-secondary/30">
                      <ImageWithFallback
                        src={p.image_url}
                        alt={p.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        wrapperClassName="absolute inset-0"
                        iconClassName="w-12 h-12 opacity-[0.10] text-muted-foreground"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-white/85 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {p.created_date ? format(new Date(p.created_date), 'd MMM yyyy', { locale: pt }) : ''}
                        </div>
                        <div className="font-display text-lg text-white mt-1 leading-snug line-clamp-2">{p.title}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}

