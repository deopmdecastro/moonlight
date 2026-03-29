import React, { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Download, Euro, TrendingUp, Package, ShoppingCart } from 'lucide-react';

import { base44 } from '@/api/base44Client';
import zanaLogoPrimary from '@/img/zana_logo_primary.svg';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { downloadCsv, exportFinancePdf } from '@/lib/reportExport';

function moneyPt(value) {
  const n = Number(value ?? 0) || 0;
  return n.toFixed(2).replace('.', ',');
}

export default function AdminFinance() {
  const title = 'Financeiro';

  const { data: inventory = [] } = useQuery({
    queryKey: ['admin-inventory'],
    queryFn: () => base44.admin.inventory.list(500),
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ['admin-purchases'],
    queryFn: () => base44.entities.Purchase.list('-purchased_at', 200),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 500),
  });


  const queryClient = useQueryClient();



  const stats = useMemo(() => {
    const byCategory = new Map();
    let invested = 0;
    let expected = 0;

    for (const p of inventory) {
      const stock = Number(p.stock ?? 0) || 0;
      const price = Number(p.price ?? 0) || 0;
      const acq = Number(p.acquisition_cost ?? p.last_movement?.unit_cost ?? 0) || 0;

      invested += stock * acq;
      expected += stock * price;

      const category = String(p.category ?? 'outros');
      const row = byCategory.get(category) ?? { category, invested: 0, expected: 0, units: 0, products: 0 };
      row.invested += stock * acq;
      row.expected += stock * price;
      row.units += stock;
      row.products += 1;
      byCategory.set(category, row);
    }

    const purchasesTotal = purchases.reduce((sum, p) => sum + (p.total ?? 0), 0);

    const revenueByStatus = orders.reduce((acc, o) => {
      const status = String(o.status ?? 'pending');
      const total = Number(o.total ?? 0) || 0;
      acc[status] = (acc[status] ?? 0) + total;
      return acc;
    }, {});

    const revenueDelivered = revenueByStatus.delivered ?? 0;
    const revenueOpen =
      (revenueByStatus.pending ?? 0) +
      (revenueByStatus.confirmed ?? 0) +
      (revenueByStatus.processing ?? 0) +
      (revenueByStatus.shipped ?? 0);

    return {
      invested,
      expected,
      marginPotential: expected - invested,
      purchasesTotal,
      byCategory: Array.from(byCategory.values()).sort((a, b) => b.invested - a.invested),
      revenueDelivered,
      revenueOpen,
      revenueCancelled: revenueByStatus.cancelled ?? 0,
    };
  }, [inventory, purchases, orders]);

  const cards = [
    { title: 'Investido em Stock', value: `${stats.invested.toFixed(2)} €`, icon: Euro, color: 'text-primary' },
    { title: 'Valor Esperado (PVP)', value: `${stats.expected.toFixed(2)} €`, icon: TrendingUp, color: 'text-green-700' },
    { title: 'Margem Potencial', value: `${stats.marginPotential.toFixed(2)} €`, icon: Package, color: 'text-accent' },
    { title: 'Receita (Entregue)', value: `${stats.revenueDelivered.toFixed(2)} €`, icon: ShoppingCart, color: 'text-green-700' },
  ];

  const exportPdf = async () => {
    try {
      const date = new Date().toISOString().slice(0, 10);
      await exportFinancePdf({
        filename: `financeiro_${date}.pdf`,
        title,
        logoUrl: zanaLogoPrimary,
        createdAt: new Date(),
        stats,
      });
      toast.success('PDF exportado');
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível exportar PDF');
    }
  };

  const exportExcel = () => {
    const date = new Date().toISOString().slice(0, 10);
    const rows = [];

    rows.push([title, new Date().toLocaleString('pt-PT')]);
    rows.push([]);
    rows.push(['Resumo']);
    rows.push(['Investido em Stock (€)', moneyPt(stats.invested)]);
    rows.push(['Valor Esperado (PVP) (€)', moneyPt(stats.expected)]);
    rows.push(['Margem Potencial (€)', moneyPt(stats.marginPotential)]);
    rows.push(['Receita (Entregue) (€)', moneyPt(stats.revenueDelivered)]);
    rows.push(['Receita pendente (€)', moneyPt(stats.revenueOpen)]);
    rows.push(['Canceladas (€)', moneyPt(stats.revenueCancelled)]);
    rows.push(['Total em Compras (€)', moneyPt(stats.purchasesTotal)]);

    rows.push([]);
    rows.push(['Investimento por categoria']);
    rows.push(['Categoria', 'Produtos', 'Unidades', 'Investido (€)', 'Valor Esperado (€)', 'Margem (€)']);
    for (const r of stats.byCategory) {
      rows.push([
        r.category,
        r.products,
        r.units,
        moneyPt(r.invested),
        moneyPt(r.expected),
        moneyPt(r.expected - r.invested),
      ]);
    }

    downloadCsv(`financeiro_${date}.csv`, rows);
    toast.success('Excel (CSV) exportado');
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-6">
        <h1 className="font-heading text-3xl">{title}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-none font-body text-sm gap-2" onClick={exportExcel}>
            <Download className="w-4 h-4" /> Excel
          </Button>
          <Button variant="outline" className="rounded-none font-body text-sm gap-2" onClick={exportPdf}>
            <Download className="w-4 h-4" /> PDF
          </Button>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((c) => (
            <Card key={c.title}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-xs text-muted-foreground">{c.title}</span>
                  <c.icon className={`w-4 h-4 ${c.color}`} />
                </div>
                <p className="font-heading text-2xl">{c.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Investimento por categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.byCategory.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">Sem dados</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left p-3 font-body text-xs text-muted-foreground">Categoria</th>
                      <th className="text-right p-3 font-body text-xs text-muted-foreground">Unidades</th>
                      <th className="text-right p-3 font-body text-xs text-muted-foreground">Investido</th>
                      <th className="text-right p-3 font-body text-xs text-muted-foreground">Valor Esperado</th>
                      <th className="text-right p-3 font-body text-xs text-muted-foreground">Margem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.byCategory.map((r) => (
                      <tr key={r.category} className="border-b border-border hover:bg-secondary/20">
                        <td className="p-3 font-body text-sm capitalize">{r.category}</td>
                        <td className="p-3 font-body text-sm text-right">{r.units}</td>
                        <td className="p-3 font-body text-sm text-right">{r.invested.toFixed(2)} €</td>
                        <td className="p-3 font-body text-sm text-right">{r.expected.toFixed(2)} €</td>
                        <td className="p-3 font-body text-sm text-right">{(r.expected - r.invested).toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-5">
                  <div className="font-body text-xs text-muted-foreground">Caixa (estimado)</div>
                  <div className="font-heading text-2xl mt-2">{stats.revenueDelivered.toFixed(2)} €</div>
                  <div className="font-body text-xs text-muted-foreground mt-1">Total de encomendas entregues</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="font-body text-xs text-muted-foreground">Receita pendente</div>
                  <div className="font-heading text-2xl mt-2">{stats.revenueOpen.toFixed(2)} €</div>
                  <div className="font-body text-xs text-muted-foreground mt-1">Encomendas em aberto</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="font-body text-xs text-muted-foreground">Canceladas</div>
                  <div className="font-heading text-2xl mt-2">{stats.revenueCancelled.toFixed(2)} €</div>
                  <div className="font-body text-xs text-muted-foreground mt-1">Total de encomendas canceladas</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <ul className="font-body text-sm text-muted-foreground list-disc pl-5 space-y-2">
                <li>“Investido” usa “Preço de Aquisição” do produto; se não existir, usa o último `unit_cost` do inventário.</li>
                <li>“Valor Esperado” usa o “Preço” (PVP) do produto.</li>
                <li>“Caixa/Receita” são estimativas baseadas no total das encomendas (não incluem taxas nem confirmação de pagamento).</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
