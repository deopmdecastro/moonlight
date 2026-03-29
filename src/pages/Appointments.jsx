import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/toast';
import Auth from './Auth';
import { useAuth } from '@/lib/AuthContext';

export default function Appointments() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: settingsRes } = useQuery({
    queryKey: ['appointments-settings'],
    queryFn: () => base44.appointments.settings(),
    staleTime: 30_000,
  });

  const enabled = Boolean(settingsRes?.content?.enabled);

  const { data: servicesRes } = useQuery({
    queryKey: ['appointments-services'],
    queryFn: () => base44.appointments.services(),
    enabled: enabled,
  });

  const { data: staffRes } = useQuery({
    queryKey: ['appointments-staff', form.service_id || 'all'],
    queryFn: () => base44.appointments.staff(form.service_id || null),
    enabled: enabled,
  });

  const { data: myRes } = useQuery({
    queryKey: ['appointments-my'],
    queryFn: () => base44.appointments.my(),
    enabled: enabled && !!user,
  });

  const services = servicesRes?.services ?? [];
  const staff = staffRes?.staff ?? [];
  const appointments = myRes?.appointments ?? [];

  const [form, setForm] = useState({
    service_id: '',
    staff_id: '',
    date: '',
    time: '',
    observations: '',
  });

  const selectedService = useMemo(() => services.find((s) => s.id === form.service_id) ?? null, [services, form.service_id]);

  const createMutation = useMutation({
    mutationFn: (payload) => base44.appointments.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appointments-my'] });
      toast.success('Marcação enviada.');
      setForm((p) => ({ ...p, observations: '' }));
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Não foi possível criar a marcação.')),
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => base44.appointments.cancel(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appointments-my'] });
      toast.success('Marcação cancelada.');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Não foi possível cancelar.')),
  });

  if (!user) return <Auth />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-primary" />
        <h1 className="font-heading text-3xl">Marcações</h1>
      </div>

      {!enabled ? (
        <div className="bg-card p-6 rounded-lg border border-border">
          <p className="font-body text-sm text-muted-foreground">De momento, as marcações não estão disponíveis.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="font-heading text-xl mb-4">Nova marcação</h2>

            <div className="space-y-4">
              <div>
                <Label className="font-body text-xs">Serviço</Label>
                <select
                  className="w-full mt-1 h-10 border border-border bg-background px-3 font-body text-sm rounded-none"
                  value={form.service_id}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      service_id: e.target.value,
                      staff_id: '',
                    }))
                  }
                >
                  <option value="">Selecione...</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.duration_minutes} min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="font-body text-xs">Atendente</Label>
                <select
                  className="w-full mt-1 h-10 border border-border bg-background px-3 font-body text-sm rounded-none"
                  value={form.staff_id}
                  onChange={(e) => setForm((p) => ({ ...p, staff_id: e.target.value }))}
                >
                  <option value="">Selecione...</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-body text-xs">Data</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    className="rounded-none mt-1"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs">Hora</Label>
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                    className="rounded-none mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="font-body text-xs">Observações (opcional)</Label>
                <Textarea
                  value={form.observations}
                  onChange={(e) => setForm((p) => ({ ...p, observations: e.target.value }))}
                  className="rounded-none mt-1 min-h-[90px]"
                />
              </div>

              <Button
                className="w-full rounded-none font-body text-sm tracking-wider"
                disabled={
                  createMutation.isPending ||
                  !form.service_id ||
                  !form.staff_id ||
                  !form.date ||
                  !form.time
                }
                onClick={() => {
                  const start_at = `${form.date}T${form.time}:00`;
                  createMutation.mutate({
                    service_id: form.service_id,
                    staff_id: form.staff_id,
                    start_at,
                    observations: form.observations?.trim() || null,
                  });
                }}
              >
                {createMutation.isPending ? 'A enviar...' : 'Marcar'}
              </Button>

              {selectedService ? (
                <p className="font-body text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Duração: {selectedService.duration_minutes} min
                </p>
              ) : null}
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="font-heading text-xl mb-4">As minhas marcações</h2>

            {appointments.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">Ainda não tem marcações.</p>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 20).map((a) => (
                  <div key={a.id} className="p-4 rounded-md border border-border bg-secondary/20">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="min-w-0">
                        <div className="font-body text-sm font-medium">{a.service?.name ?? 'Serviço'}</div>
                        <div className="font-body text-xs text-muted-foreground">
                          {new Date(a.start_at).toLocaleString('pt-PT')} • {a.duration_minutes} min • {a.staff?.name ?? '-'}
                        </div>
                        {a.observations ? (
                          <div className="font-body text-xs text-muted-foreground mt-1">{a.observations}</div>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-body text-xs text-muted-foreground">{a.status}</span>
                        {(a.status === 'pending' || a.status === 'confirmed') ? (
                          <Button
                            variant="outline"
                            className="rounded-none h-9 font-body text-xs"
                            disabled={cancelMutation.isPending}
                            onClick={() => cancelMutation.mutate(a.id)}
                          >
                            Cancelar
                          </Button>
                        ) : null}
                      </div>
                    </div>
                    <Separator className="my-3" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
