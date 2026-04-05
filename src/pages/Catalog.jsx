import React, { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { PackageSearch, Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import { trackSearch } from '@/lib/analytics';
import EmptyState from '@/components/ui/empty-state';

const sortOptions = [
  { value: 'newest', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Preço: menor' },
  { value: 'price_desc', label: 'Preço: maior' },
  { value: 'bestseller', label: 'Mais vendidos' },
];

function normalizeEnabledOptions(value, fallback) {
  if (!Array.isArray(value) || value.length === 0) return fallback;
  return value
    .map((opt) => {
      const v = String(opt?.value ?? '').trim();
      if (!v) return null;
      const label = String(opt?.label ?? v).trim() || v;
      return opt?.enabled === false ? null : { value: v, label };
    })
    .filter(Boolean);
}

export default function Catalog() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [material, setMaterial] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products-catalog'],
    queryFn: () => base44.entities.Product.filter({ status: 'active' }, '-created_date', 100),
  });

  const { data: productOptionsRes } = useQuery({
    queryKey: ['product-options-catalog'],
    queryFn: () => base44.content.productOptions(),
    staleTime: 300_000,
  });

  const options = useMemo(() => {
    const content = productOptionsRes?.content && typeof productOptionsRes.content === 'object' ? productOptionsRes.content : {};
    const categories = normalizeEnabledOptions(content.categories, [
      { value: 'tonico', label: 'Tónicos' },
      { value: 'oleo', label: 'Óleos' },
      { value: 'combo', label: 'Combos' },
      { value: 'acessorio', label: 'Acessórios' },
    ]);
    const materials = normalizeEnabledOptions(content.materials, [
      { value: 'crespo', label: 'Crespo' },
      { value: 'cacheado', label: 'Cacheado' },
      { value: 'ondulado', label: 'Ondulado' },
      { value: 'transicao', label: 'Transição' },
    ]);

    return {
      categories: [{ value: 'all', label: 'Todas' }, ...categories],
      materials: [{ value: 'all', label: 'Todos' }, ...materials],
      hasMaterials: materials.length > 0,
    };
  }, [productOptionsRes]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    if (category !== 'all') result = result.filter(p => p.category === category);
    if (options.hasMaterials && material !== 'all') result = result.filter(p => p.material === material);

    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case 'price_desc': result.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case 'bestseller': result.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0)); break;
      default: break;
    }

    return result;
  }, [products, search, category, material, sortBy, options.hasMaterials]);

  const activeFilterCount = [category !== 'all', (options.hasMaterials && material !== 'all'), search].filter(Boolean).length;

  useEffect(() => {
    const handle = setTimeout(() => {
      if (search) trackSearch(search);
    }, 600);
    return () => clearTimeout(handle);
  }, [search]);

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setMaterial('all');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/60 mb-2">Explore</p>
          <h1 className="font-heading text-4xl md:text-6xl text-primary-foreground font-light">Catálogo</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-none border-border font-body text-sm"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-none font-body text-sm gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {activeFilterCount > 0 && (
              <Badge className="bg-primary text-primary-foreground text-[10px] ml-1 h-4 w-4 p-0 flex items-center justify-center rounded-full">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] rounded-none font-body text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-border">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[140px] rounded-none font-body text-sm">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
            <SelectContent>
                {options.categories.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {options.hasMaterials ? (
              <Select value={material} onValueChange={setMaterial}>
                <SelectTrigger className="w-[140px] rounded-none font-body text-sm">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {options.materials.map(m => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}

            {activeFilterCount > 0 && (
              <Button variant="ghost" onClick={clearFilters} className="text-sm font-body gap-1">
                <X className="w-3 h-3" /> Limpar
              </Button>
            )}
          </div>
        )}

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {options.categories.map(c => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`px-4 py-2 text-xs font-body tracking-wider uppercase transition-all ${
                category === c.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground/70 hover:bg-secondary/80'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <p className="text-sm font-body text-muted-foreground mb-6">{filtered.length} produto(s)</p>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-secondary/50 aspect-square rounded-lg mb-3" />
                <div className="h-3 bg-secondary/50 rounded w-1/3 mb-2" />
                <div className="h-4 bg-secondary/50 rounded w-2/3 mb-2" />
                <div className="h-3 bg-secondary/50 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="Nenhum produto encontrado"
            description="Tente ajustar os filtros de pesquisa"
            className="py-20"
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
