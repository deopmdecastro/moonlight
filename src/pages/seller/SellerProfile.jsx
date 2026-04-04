import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { KeyRound, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { getErrorMessage } from '@/lib/toast';

export default function SellerProfile() {
  const { user, logout } = useAuth();

  const resetMutation = useMutation({
    mutationFn: ({ email }) => base44.auth.requestPasswordReset({ email }),
    onSuccess: (data) => {
      toast.success('Email de redefinição enviado');
      if (data?.resetToken) toast.message('Token de redefinição (dev)', { description: data.resetToken });
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Não foi possível enviar a redefinição de senha.')),
  });

  const email = String(user?.email ?? '').trim();
  const roles = [
    user?.is_admin ? 'Admin' : null,
    user?.is_seller ? 'Vendedor' : null,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl">Perfil</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Conta e segurança.</p>
      </div>

      <div className="bg-card rounded-lg border border-border p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/60 flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <div className="font-body text-sm font-semibold truncate">{(user?.full_name ?? email) || 'Utilizador'}</div>
            <div className="font-body text-xs text-muted-foreground truncate">{email || '-'}</div>
          </div>
        </div>
        <div className="font-body text-xs text-muted-foreground">
          Função: {roles.length ? roles.join(' / ') : '—'}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-5 space-y-3">
        <div className="font-body text-sm font-semibold">Segurança</div>
        <div className="font-body text-xs text-muted-foreground">
          Para trocar a palavra-passe, enviamos um link de redefinição para o seu email.
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            className="rounded-none font-body text-sm gap-2"
            disabled={!email || resetMutation.isPending}
            onClick={() => resetMutation.mutate({ email })}
          >
            <KeyRound className="w-4 h-4" />
            Trocar senha
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-none font-body text-sm gap-2"
            onClick={() => {
              logout();
              window.location.assign('/');
            }}
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}
