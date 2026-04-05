import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Filter } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/shop/ProductCard";
import CartDrawer from "@/components/shop/CartDrawer";

const categories = [
  { value: "all", label: "Todos" },
  { value: "tonico", label: "Tônicos" },
  { value: "oleo", label: "Óleos" },
  { value: "combo", label: "Combos" },
  { value: "acessorio", label: "Acessórios" },
];

export default function Loja() {
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const { count } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("-created_date"),
  });

  const filtered = activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-24 min-h-screen">
      {/* Header */}
      <section className="py-16 px-6 bg-primary/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Loja Online</span>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mt-2">
              Produtos <span className="text-primary">Moonlight</span>
            </h1>
            <p className="font-mono text-sm text-muted-foreground mt-2">
              100% naturais, feitos com amor para o seu cabelo.
            </p>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-6 py-3 border border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <ShoppingBag className="w-4 h-4" />
            Carrinho
            {count > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground font-mono text-xs flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 py-6 border-b border-border bg-background sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full border whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-muted rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="font-mono text-sm text-muted-foreground">Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}