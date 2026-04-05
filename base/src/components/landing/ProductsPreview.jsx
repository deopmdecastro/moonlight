import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const products = [
  { name: "Tônico de Alho", benefit: "Antiqueda & Crescimento" },
  { name: "Tônico de Gengibre", benefit: "Hidratação & Brilho" },
  { name: "Super Tônico", benefit: "Força & Volume" },
  { name: "Óleo de Cravo-da-Índia", benefit: "Fortalecimento" },
  { name: "Óleo de Alecrim", benefit: "Antioxidante" },
  { name: "Óleo de Hibisco", benefit: "Reconstrução" },
];

export default function ProductsPreview({ productsImage }) {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">100% Naturais</span>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mt-4 leading-tight">
            Óleos <span className="text-primary">Moonlight</span>
          </h2>
          <p className="font-mono text-sm text-muted-foreground mt-4 max-w-lg mx-auto">
            Feitos com muito amor a pensar em si e no seu cabelo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-8 rounded-3xl bg-primary/3 blur-3xl" />
            <img
              src={productsImage}
              alt="Óleos Moonlight - Produtos capilares naturais"
              className="relative w-full rounded-2xl hover:brightness-110 transition-all duration-700"
            />
          </motion.div>

          <div className="space-y-4">
            {products.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-card transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm text-foreground">{product.name}</h3>
                    <p className="font-mono text-xs text-muted-foreground">{product.benefit}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            ))}

            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary mt-6 hover:gap-4 transition-all duration-300"
            >
              Ver todos os produtos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}