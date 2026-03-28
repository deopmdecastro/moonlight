import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, X, Send } from 'lucide-react';
import { toast } from 'sonner';

import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getErrorMessage } from '@/lib/toast';

function formatWhen(value) {
  try {
    return new Date(value).toLocaleString('pt-PT');
  } catch {
    return '';
  }
}

export default function SupportChatWidget() {
  const { user } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);

  const path = location.pathname ?? '';
  const hidden = path.startsWith('/admin');
  if (hidden) return null;

  const { data, isLoading } = useQuery({
    queryKey: ['support-chat'],
    queryFn: () => base44.support.chat.get(),
    enabled: !!user && open,
    refetchInterval: open ? 10_000 : false,
  });

  const messages = useMemo(() => (Array.isArray(data?.messages) ? data.messages : []), [data]);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages.length]);

  const sendMutation = useMutation({
    mutationFn: (message) => base44.support.chat.send(message),
    onSuccess: async () => {
      setDraft('');
      await queryClient.invalidateQueries({ queryKey: ['support-chat'] });
      await queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Não foi possível enviar.')),
  });

  const handleOpen = () => {
    if (!user) {
      toast.error('Inicie sessão para falar com o suporte.');
      setOpen(true);
      return;
    }
    setOpen(true);
  };

  const handleSend = () => {
    const msg = draft.trim();
    if (!msg) return;
    if (!user) {
      toast.error('Inicie sessão para enviar mensagem.');
      return;
    }
    sendMutation.mutate(msg);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open ? (
        <Button className="rounded-full h-12 px-4 font-body text-sm tracking-wide shadow-lg gap-2" onClick={handleOpen}>
          <MessageSquare className="w-4 h-4" />
          Suporte
        </Button>
      ) : null}

      {open ? (
        <div className="w-[340px] sm:w-[380px] h-[520px] max-h-[calc(100vh-120px)] bg-card border border-border shadow-2xl rounded-lg overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card/95 backdrop-blur-md">
            <div className="min-w-0">
              <div className="font-heading text-base">Chat / Suporte</div>
              <div className="font-body text-[11px] text-muted-foreground truncate">
                {user ? 'Responderemos o mais rápido possível.' : 'Faça login para enviar mensagens.'}
              </div>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setOpen(false)} aria-label="Fechar">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {!user ? (
            <div className="p-4 flex-1 flex flex-col justify-center items-start gap-3">
              <p className="font-body text-sm text-muted-foreground">
                Para falar com o suporte, precisa de iniciar sessão.
              </p>
              <Link to="/conta">
                <Button className="rounded-none font-body text-sm tracking-wider">Entrar</Button>
              </Link>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-background">
                {isLoading ? (
                  <div className="font-body text-sm text-muted-foreground">A carregar…</div>
                ) : messages.length === 0 ? (
                  <div className="font-body text-sm text-muted-foreground">
                    Escreva a primeira mensagem para abrir um ticket de suporte.
                  </div>
                ) : (
                  messages.map((m) => {
                    const mine = m.author_type === 'customer';
                    return (
                      <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[92%] rounded-md px-3 py-2 border ${
                            mine ? 'bg-primary text-primary-foreground border-primary/30' : 'bg-secondary/20 border-border'
                          }`}
                        >
                          <div className="whitespace-pre-wrap font-body text-sm leading-relaxed">{m.message}</div>
                          <div className={`mt-1 font-body text-[10px] ${mine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {formatWhen(m.created_date)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-3 border-t border-border bg-card">
                <div className="flex items-end gap-2">
                  <Textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="rounded-md min-h-[44px] max-h-[120px]"
                    placeholder="Escreva a sua mensagem…"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button
                    className="rounded-md h-11 w-11 p-0 shrink-0"
                    onClick={handleSend}
                    disabled={sendMutation.isPending}
                    aria-label="Enviar"
                    title="Enviar"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="font-body text-[10px] text-muted-foreground mt-2">
                  Enter para enviar · Shift+Enter para nova linha
                </div>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

