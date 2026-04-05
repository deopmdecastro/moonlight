import React from "react";
import { ShoppingBag, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

export default function ProductCard({ product, index }) {
  const { addToCart } = useCart();

  const categoryLabel = {
    tonico: "Tônico",
    oleo: "Óleo",
    combo: "Combo",
    acessorio: "Acessório",
  }[product.category] || product.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-400"
    >
      <div className="relative bg-muted h-52 overflow-hidden flex items-center justify-center">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ShoppingBag className="w-10 h-10 opacity-30" />
            <span className="font-mono text-xs opacity-40">sem imagem</span>
          </div>
        )}
        <span className="absolute top-3 left-3 font-mono text-xs uppercase tracking-widest bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
          {categoryLabel}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg text-foreground mb-1">{product.name}</h3>
        {product.description && (
          <p className="font-mono text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        )}
        {product.benefits?.length > 0 && (
          <ul className="mb-4 space-y-1">
            {product.benefits.slice(0, 2).map((b) => (
              <li key={b} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary" />
                <span className="font-mono text-xs text-muted-foreground">{b}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center justify-between mt-4">
          <span className="font-display text-xl text-primary">
            {product.price.toLocaleString("pt-AO")} Kz
          </span>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.in_stock}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        </div>
        {!product.in_stock && (
          <p className="font-mono text-xs text-muted-foreground mt-2">Sem stock</p>
        )}
      </div>
    </motion.div>
  );
}