import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Bell, CalendarClock, ShoppingCart, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import EmptyState from '@/components/ui/empty-state';

function money(value) {
  const n = Number(value ?? 0) || 0;
  return n.toFixed(2).replace('.', ',');
}

const STATUS_META = {
  pending: { label: 'Pendente', color: 'hsl(var(--chart-3))' },
  confirmed: { label: 'Confirmada', color: 'hsl(var(--chart-1))' },
  processing: { label: 'Preparação', color: 'hsl(var(--chart-2))' },
  shipped: { label: 'Enviada', color: 'hsl(var(--chart-4))' },
  delivered: { label: 'Entregue', color: 'hsl(var(--chart-5))' },
  cancelled: { label: 'Cancelada', color: 'hsl(var(--destructive))' },
};

const STATUS_LABEL_SHORT = {
  pending: 'Pend.',
  confirmed: 'Conf.',
  processing: 'Prep.',
  shipped: 'Env.',
  delivered: 'Entr.',
  cancelled: 'Canc.',
};

function useMediaQuery(query) {
  const getMatches = () => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

function OrdersByStatusTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  const label = String(row?.name ?? '');
  const value = Number(row?.value ?? 0) || 0;
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 shadow-sm">
      <div className="font-body text-xs text-muted-foreground">Estado</div>
      <div className="font-body text-sm font-semibold">{label || '—'}</div>
      <div className="mt-1 font-body text-xs text-muted-foreground">Encomendas</div>
      <div className="font-body text-sm font-semibold">{value}</div>
    </div>
  );
}

export default function SellerDashboard() {
  const isTinyChart = useMediaQuery('(max-width: 420px)');
  const isNarrowChart = useMediaQuery('(max-width: 640px)');
  const { data, isLoading } = useQuery({
    queryKey: ['seller-dashboard-summary'],
    queryFn: () => base44.staff.reports.summary(30),
    staleTime: 30_000,
  });

  const statusData = useMemo(() => {
    const counts = data?.status_counts && typeof data.status_counts === 'object' ? data.status_counts : {};
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    return statuses.map((status) => ({
      key: status,
      name: STATUS_META[status]?.label ?? status,
      value: Number(counts?.[status] ?? 0) || 0,
      fill: STATUS_META[status]?.color ?? 'hsl(var(--chart-1))',
    }));
  }, [data?.status_counts]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-3xl">Vendedor</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Área de vendas e gestão rápida.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-border p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-heading text-lg">Encomendas</div>
            <div className="font-body text-xs text-muted-foreground mt-1">Criar venda manual, imprimir fatura e acompanhar encomendas.</div>
          </div>
          <Link to="/vendedor/encomendas">
            <Button className="rounded-none font-body text-sm gap-2">
              <ShoppingCart className="w-4 h-4" />
              Abrir
            </Button>
          </Link>
        </div>

        <div className="bg-card rounded-lg border border-border p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-heading text-lg">Relatórios</div>
            <div className="font-body text-xs text-muted-foreground mt-1">Resumo de vendas e evolução do período.</div>
          </div>
          <Link to="/vendedor/relatorios">
            <Button variant="outline" className="rounded-none font-body text-sm gap-2">
              <BarChart3 className="w-4 h-4" />
              Ver
            </Button>
          </Link>
        </div>

        <div className="bg-card rounded-lg border border-border p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-heading text-lg">Clientes</div>
            <div className="font-body text-xs text-muted-foreground mt-1">Consultar clientes associados às suas encomendas.</div>
          </div>
          <Link to="/vendedor/clientes">
            <Button variant="outline" className="rounded-none font-body text-sm gap-2">
              <Users className="w-4 h-4" />
              Ver
            </Button>
          </Link>
        </div>

        <div className="bg-card rounded-lg border border-border p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-heading text-lg">Notificações</div>
            <div className="font-body text-xs text-muted-foreground mt-1">Atividade relacionada às suas ações.</div>
          </div>
          <Link to="/vendedor/notificacoes">
            <Button variant="outline" className="rounded-none font-body text-sm gap-2">
              <Bell className="w-4 h-4" />
              Ver
            </Button>
          </Link>
        </div>

        <div className="bg-card rounded-lg border border-border p-5 flex items-center justify-between gap-4 flex-wrap md:col-span-2">
          <div>
            <div className="font-heading text-lg">Marcações</div>
            <div className="font-body text-xs text-muted-foreground mt-1">Visível quando o admin ativar o serviço.</div>
          </div>
          <Link to="/vendedor/marcacoes">
            <Button variant="outline" className="rounded-none font-body text-sm gap-2">
              <CalendarClock className="w-4 h-4" />
              Ver
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="font-heading text-xl">Últimos 30 dias</CardTitle>
            <div className="font-body text-xs text-muted-foreground mt-1">
              Receita total: €{money(data?.revenue_total ?? 0)} · Encomendas: {Number(data?.total_orders ?? 0) || 0}
            </div>
          </div>
          <Link to="/vendedor/relatorios">
            <Button variant="outline" className="rounded-none font-body text-xs gap-2">
              <BarChart3 className="w-4 h-4" />
              Relatórios
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="h-72 relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <EmptyState icon={BarChart3} description="A carregar..." className="py-0" iconClassName="w-8 h-8" />
              </div>
            ) : statusData.every((d) => (Number(d?.value ?? 0) || 0) <= 0) ? (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <EmptyState icon={BarChart3} description="Sem dados para este período." className="py-0" iconClassName="w-8 h-8" />
              </div>
            ) : null}

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusData}
                margin={{ top: 18, right: 10, bottom: isTinyChart ? 72 : isNarrowChart ? 46 : 10, left: 0 }}
                barCategoryGap={isNarrowChart ? 12 : 18}
              >
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="key"
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: isNarrowChart ? 10 : 12 }}
                  interval={0}
                  height={isTinyChart ? 92 : isNarrowChart ? 64 : 46}
                  angle={isTinyChart ? -45 : isNarrowChart ? -30 : 0}
                  textAnchor={isNarrowChart ? 'end' : 'middle'}
                  tickMargin={isTinyChart ? 18 : isNarrowChart ? 14 : 8}
                  tickFormatter={(statusKey) => {
                    const k = String(statusKey ?? '');
                    if (isNarrowChart) return STATUS_LABEL_SHORT[k] ?? STATUS_META[k]?.label ?? k;
                    return STATUS_META[k]?.label ?? k;
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: isNarrowChart ? 10 : 12 }}
                  width={isNarrowChart ? 26 : 28}
                  domain={[0, (dataMax) => Math.max(1, Number(dataMax) || 0)]}
                />
                <Tooltip cursor={{ fill: 'hsl(var(--secondary) / 0.35)' }} content={<OrdersByStatusTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={isNarrowChart ? 40 : 56}>
                  {statusData.some((d) => (Number(d.value) || 0) > 0) ? (
                    <LabelList dataKey="value" position="top" className="font-body text-xs fill-foreground" />
                  ) : null}
                  {statusData.map((entry) => (
                    <Cell key={entry.key} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
