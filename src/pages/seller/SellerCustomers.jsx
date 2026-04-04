import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Users } from 'lucide-react';

import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import EmptyState from '@/components/ui/empty-state';
import LoadMoreControls from '@/components/ui/load-more-controls';

export default function SellerCustomers() {
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(50);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['seller-customers', limit],
    queryFn: () => base44.staff.customers.list(limit),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = Array.isArray(customers) ? customers : [];
    if (!q) return list;
    return list.filter((c) => {
      const hay = [c?.full_name, c?.email, c?.phone].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [customers, search]);

  const canLoadMore = !isLoading && Array.isArray(customers) && customers.length === limit && limit < 500;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-3xl">Clientes</h1>
          <p className="font-body text-xs text-muted-foreground mt-1">Lista de clientes.</p>
        </div>
        <div className="relative w-72 max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, email, telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-none font-body text-sm"
          />
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full min-w-[780px]">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left p-3 font-body text-xs text-muted-foreground whitespace-nowrap">Nome</th>
              <th className="text-left p-3 font-body text-xs text-muted-foreground whitespace-nowrap">Email</th>
              <th className="text-left p-3 font-body text-xs text-muted-foreground whitespace-nowrap">Telefone</th>
              <th className="text-left p-3 font-body text-xs text-muted-foreground whitespace-nowrap">Data Registo</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                <td className="p-3 font-body text-sm font-medium whitespace-nowrap">{c.full_name || '-'}</td>
                <td className="p-3 font-body text-sm text-muted-foreground whitespace-nowrap">{c.email || '-'}</td>
                <td className="p-3 font-body text-sm text-muted-foreground whitespace-nowrap">{c.phone || '-'}</td>
                <td className="p-3 font-body text-xs text-muted-foreground whitespace-nowrap">
                  {c.created_date ? new Date(c.created_date).toLocaleDateString('pt-PT') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && filtered.length === 0 ? (
          <EmptyState icon={Users} description="A carregar..." className="py-8" />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} description="Sem clientes" className="py-8" />
        ) : null}
      </div>

      <LoadMoreControls
        leftText={`A mostrar ${Math.min(limit, Array.isArray(customers) ? customers.length : 0)} clientes${search.trim() ? ` (${filtered.length} filtrados)` : ''}.`}
        onLess={() => setLimit(50)}
        lessDisabled={isLoading || limit <= 50}
        onMore={() => setLimit((p) => Math.min(500, p + 50))}
        moreDisabled={!canLoadMore}
      />
    </div>
  );
}

