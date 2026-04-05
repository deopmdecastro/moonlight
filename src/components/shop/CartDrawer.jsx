import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";

export default function CartDrawer({ open, onClose }) {
  const { items, removeFromCart, updateQty, total, clearCart } = useCart();
  const formatter = useMemo(
    () => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }),
    []
  );

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="font-display text-xl flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" /> O meu carrinho
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="font-mono text-sm text-muted-foreground">O seu carrinho está vazio.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.id}:${item.color || ""}`} className="flex gap-4 p-4 bg-muted rounded-xl">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-mono text-sm font-bold text-foreground truncate">{item.name}</h4>
                    <p className="font-mono text-xs text-primary mt-1">{formatter.format(Number(item.price) || 0)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => removeFromCart(item.id)} aria-label="Remover">
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive transition-colors" />
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-6 h-6 rounded-full bg-border flex items-center justify-center hover:bg-primary/20 transition-colors"
                        aria-label="Diminuir"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-sm w-5 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-6 h-6 rounded-full bg-border flex items-center justify-center hover:bg-primary/20 transition-colors"
                        aria-label="Aumentar"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-muted-foreground">Total</span>
                <span className="font-display text-2xl text-primary">{formatter.format(Number(total) || 0)}</span>
              </div>

              <Link
                to="/checkout"
                onClick={() => onClose?.(false)}
                className="w-full text-center font-mono text-xs uppercase tracking-widest py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300"
              >
                Finalizar compra
              </Link>

              <button
                onClick={clearCart}
                className="w-full font-mono text-xs uppercase tracking-widest py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Limpar carrinho
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

