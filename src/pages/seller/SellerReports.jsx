import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Euro, ShoppingCart, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';

function money(value) {
  const n = Number(value ?? 0) || 0;
  return n.toFixed(2).replace('.', ',');
}

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

function RevenueByDayTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  const label = String(row?.fullDate ?? row?.date ?? '');
  const revenue = Number(row?.revenue ?? 0) || 0;
  const orders = Number(row?.orders ?? 0) || 0;

  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 shadow-sm">
      <div className="font-body text-xs text-muted-foreground">Data</div>
      <div className="font-body text-sm font-semibold">{label || '—'}</div>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div>
          <div className="font-body text-xs text-muted-foreground">Receita</div>
          <div className="font-body text-sm font-semibold">€{money(revenue)}</div>
        </div>
        <div>
          <div className="font-body text-xs text-muted-foreground">Encomendas</div>
          <div className="font-body text-sm font-semibold">{orders}</div>
        </div>
      </div>
    </div>
  );
}

export default function SellerReports() {
  const isTinyChart = useMediaQuery('(max-width: 420px)');
  const isNarrowChart = useMediaQuery('(max-width: 640px)');
  const [days, setDays] = useState(30);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['seller-reports-summary', days],
    queryFn: () => base44.staff.reports.summary(days),
    staleTime: 30_000,
  });

  const byDay = useMemo(() => {
    const list = Array.isArray(data?.by_day) ? data.by_day : [];
    return list.map((r) => ({
      fullDate: String(r?.date ?? ''),
      date: String(r?.date ?? '').slice(5),
      orders: Number(r?.orders ?? 0) || 0,
      revenue: Number(r?.revenue ?? 0) || 0,
    }));
  }, [data]);

  const scopeLabel = data?.scope === 'mine' ? 'minhas ações' : 'todas as encomendas';

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-heading text-3xl">Relatórios</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Resumo dos últimos {days} dias ({scopeLabel}).
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant={days === 7 ? 'default' : 'outline'} className="rounded-none font-body text-xs" onClick={() => setDays(7)}>
            7 dias
          </Button>
          <Button variant={days === 30 ? 'default' : 'outline'} className="rounded-none font-body text-xs" onClick={() => setDays(30)}>
            30 dias
          </Button>
          <Button variant={days === 90 ? 'default' : 'outline'} className="rounded-none font-body text-xs" onClick={() => setDays(90)}>
            90 dias
          </Button>
          <Button variant="outline" className="rounded-none font-body text-xs" onClick={() => refetch()} disabled={isLoading}>
            Atualizar
          </Button>
        </div>
      </div>

      {isError ? (
        <div className="bg-card border border-border rounded-lg p-6">
          <EmptyState icon={BarChart3} description="Não foi possível carregar os relatórios." className="py-6" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-lg">
              <CardHeader className="pb-2">
                <CardTitle className="font-body text-xs text-muted-foreground flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                  Encomendas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="font-heading text-2xl">{Number(data?.total_orders ?? 0) || 0}</div>
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader className="pb-2">
                <CardTitle className="font-body text-xs text-muted-foreground flex items-center gap-2">
                  <Euro className="w-4 h-4 text-primary" />
                  Receita (total)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="font-heading text-2xl">€{money(data?.revenue_total ?? 0)}</div>
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader className="pb-2">
                <CardTitle className="font-body text-xs text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Receita (entregue)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="font-heading text-2xl">€{money(data?.revenue_delivered ?? 0)}</div>
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader className="pb-2">
                <CardTitle className="font-body text-xs text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Ticket médio
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="font-heading text-2xl">
                  €{money((Number(data?.revenue_total ?? 0) || 0) / Math.max(1, Number(data?.total_orders ?? 0) || 0))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Receita por dia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <EmptyState icon={BarChart3} description="A carregar..." className="py-0" iconClassName="w-8 h-8" />
                  </div>
                ) : byDay.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <EmptyState icon={BarChart3} description="Sem dados para este período." className="py-0" iconClassName="w-8 h-8" />
                  </div>
                ) : null}

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={byDay}
                    margin={{ top: 18, right: 10, bottom: isTinyChart ? 56 : isNarrowChart ? 38 : 12, left: 0 }}
                    barCategoryGap={isNarrowChart ? 10 : 16}
                  >
                    <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: isNarrowChart ? 10 : 12 }}
                      interval={isNarrowChart ? 1 : 0}
                      height={isTinyChart ? 60 : isNarrowChart ? 48 : 36}
                      angle={isTinyChart ? -35 : isNarrowChart ? -25 : 0}
                      textAnchor={isNarrowChart ? 'end' : 'middle'}
                      tickMargin={isTinyChart ? 14 : isNarrowChart ? 10 : 8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: isNarrowChart ? 10 : 12 }}
                      width={isNarrowChart ? 34 : 42}
                      domain={[0, (dataMax) => Math.max(1, Number(dataMax) || 0)]}
                      tickFormatter={(v) => `€${money(v)}`}
                    />
                    <Tooltip cursor={{ fill: 'hsl(var(--secondary) / 0.35)' }} content={<RevenueByDayTooltip />} />
                    <Bar dataKey="revenue" radius={[8, 8, 0, 0]} maxBarSize={isNarrowChart ? 36 : 56} fill="hsl(var(--chart-1))">
                      {!isNarrowChart && byDay.length > 0 && byDay.length <= 10 ? (
                        <LabelList
                          dataKey="revenue"
                          position="top"
                          className="font-body text-xs fill-foreground"
                          formatter={(v) => `€${money(v)}`}
                        />
                      ) : null}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
