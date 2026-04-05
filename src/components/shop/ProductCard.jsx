import React, { useMemo } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

import { useCart } from "@/context/CartContext";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { getPrimaryImage } from "@/lib/images";

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();

  const formatter = useMemo(
    () => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }),
    []
  );

  const categoryLabel = String(product?.category ?? "").trim() || "Produto";
  const primaryImage = getPrimaryImage(product?.images) || product?.image_url || "";
  const inStock =
    typeof product?.in_stock === "boolean"
      ? product.in_stock
      : Number(product?.stock_qty ?? product?.stock ?? 1) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-400"
    >
      <div className="relative bg-muted h-52 overflow-hidden flex items-center justify-center">
        <ImageWithFallback
          src={primaryImage}
          alt={product?.name || ""}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          iconClassName="w-10 h-10 opacity-30 text-muted-foreground"
        />
        <span className="absolute top-3 left-3 font-mono text-xs uppercase tracking-widest bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
          {categoryLabel}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg text-foreground mb-1">{product?.name}</h3>
        {product?.description ? (
          <p className="font-mono text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        ) : null}

        <div className="flex items-center justify-between mt-4">
          <span className="font-display text-xl text-primary">{formatter.format(Number(product?.price) || 0)}</span>
          <button
            onClick={() => addToCart(product)}
            disabled={!inStock}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        </div>

        {!inStock ? <p className="font-mono text-xs text-muted-foreground mt-2">Sem stock</p> : null}
      </div>
    </motion.div>
  );
}

