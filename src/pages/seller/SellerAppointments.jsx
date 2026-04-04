import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarClock } from 'lucide-react';

import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import LoadMoreControls from '@/components/ui/load-more-controls';

export default function SellerAppointments() {
  const [limit, setLimit] = useState(200);

  const { data: settingsRes } = useQuery({
    queryKey: ['appointments-settings-public'],
    queryFn: () => base44.appointments.settings(),
    staleTime: 60_000,
  });

  const enabled = Boolean(settingsRes?.content?.enabled);
  const from = useMemo(() => {
    const d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10);
  }, []);
  const to = useMemo(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), []);

  const { data: apptRes, isLoading, isError, refetch } = useQuery({
    enabled,
    queryKey: ['seller-appointments', from, to, limit],
    queryFn: () => base44.staff.appointments.list({ from, to, status: 'all', limit }),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  const appointments = useMemo(() => {
    const list = apptRes?.appointments ?? [];
    return Array.isArray(list) ? list : [];
  }, [apptRes]);

  const canLoadMore = enabled && !isLoading && appointments.length === limit && limit < 5000;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-heading text-3xl">Marcações</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            {enabled ? 'Lista de marcações (últimos 7 dias e próximos 30 dias).' : 'O serviço de marcações não está ativo.'}
          </p>
        </div>
        {enabled ? (
          <Button variant="outline" className="rounded-none font-body text-sm" onClick={() => refetch()} disabled={isLoading}>
            Atualizar
          </Button>
        ) : null}
      </div>

      {!enabled ? (
        <div className="bg-card border border-border rounded-lg p-6">
          <EmptyState
            icon={CalendarClock}
            description="O admin ainda não ativou o serviço de marcações."
            className="py-10"
          />
        </div>
      ) : isError ? (
        <div className="bg-card border border-border rounded-lg p-6">
          <EmptyState icon={CalendarClock} description="Não foi possível carregar as marcações." className="py-10" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-secondary/30">
              <tr>
                <th className="text-left p-3 font-body text-xs text-muted-foreground">Data/hora</th>
                <th className="text-left p-3 font-body text-xs text-muted-foreground">Serviço</th>
                <th className="text-left p-3 font-body text-xs text-muted-foreground">Atendente</th>
                <th className="text-left p-3 font-body text-xs text-muted-foreground">Cliente</th>
                <th className="text-left p-3 font-body text-xs text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-t border-border hover:bg-secondary/10">
                  <td className="p-3 font-body text-sm whitespace-nowrap">
                    {a?.start_at ? new Date(a.start_at).toLocaleString('pt-PT') : '-'}
                  </td>
                  <td className="p-3 font-body text-sm">{a?.service?.name ?? '-'}</td>
                  <td className="p-3 font-body text-sm text-muted-foreground">{a?.staff?.name ?? '-'}</td>
                  <td className="p-3 font-body text-sm text-muted-foreground">
                    {a?.user?.full_name ?? a?.user?.email ?? '-'}
                  </td>
                  <td className="p-3 font-body text-xs text-muted-foreground whitespace-nowrap">{a?.status ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && appointments.length === 0 ? (
            <EmptyState icon={CalendarClock} description="A carregar..." className="py-8" />
          ) : appointments.length === 0 ? (
            <EmptyState icon={CalendarClock} description="Sem marcações" className="py-8" />
          ) : null}
        </div>
      )}

      {enabled ? (
        <LoadMoreControls
          leftText={`A mostrar ${Math.min(limit, appointments.length)} marcações.`}
          onLess={() => setLimit(200)}
          lessDisabled={isLoading || limit <= 200}
          onMore={() => setLimit((p) => Math.min(5000, p + 200))}
          moreDisabled={!canLoadMore}
        />
      ) : null}
    </div>
  );
}

