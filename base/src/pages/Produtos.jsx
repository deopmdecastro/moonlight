import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Droplets, Leaf, Shield, Zap, Heart, Sun } from "lucide-react";

const PRODUCTS_IMG = "https://media.base44.com/images/public/69cc376dc1ad26b57bf8eecd/319b58075_generated_888a5b9c.png";

const products = [
  {
    name: "Tônico de Alho",
    icon: Shield,
    benefits: ["Antiqueda", "Combate a caspa", "Controla o excesso de oleosidade", "Auxilia o crescimento"],
  },
  {
    name: "Tônico de Gengibre",
    icon: Zap,
    benefits: ["Ajuda no crescimento", "Ajuda no combate à caspa", "Hidrata os fios", "Proporciona brilho"],
  },
  {
    name: "Super Tônico",
    icon: Sparkles,
    benefits: ["Acelera o crescimento", "Restaura a força e o volume", "Reduz a queda", "Proporciona brilho"],
  },
  {
    name: "Óleo de Cravo-da-Índia",
    icon: Droplets,
    benefits: ["Anti-queda", "Ajuda no crescimento", "Fortalece os fios", "Proporciona brilho"],
  },
  {
    name: "Óleo de Alecrim",
    icon: Leaf,
    benefits: ["Antioxidante", "Anti-inflamatório", "Fortalece os fios", "Controla o excesso de oleosidade"],
  },
  {
    name: "Combo Moonlight",
    icon: Heart,
    benefits: ["Estimula o crescimento capilar", "Reconstrói a fibra capilar", "Fortalece os fios", "Tem efeito detox"],
  },
  {
    name: "Óleo de Hibisco",
    icon: Sun,
    benefits: ["Estimula o crescimento capilar", "Reconstrói a fibra capilar", "Fortalece os fios", "Tem efeito detox"],
  },
];

export default function Produtos() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">100% Naturais</span>
            <h1 className="font-display text-4xl md:text-6xl text-foreground mt-4 leading-tight">
              Óleos <span className="text-primary">Moonlight</span>
            </h1>
            <p className="font-mono text-sm text-muted-foreground mt-4 max-w-lg mx-auto">
              Os óleos Moonlight são 100% naturais e feitos com muito amor a pensar em si e no seu cabelo.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative max-w-3xl mx-auto mb-20"
          >
            <div className="absolute -inset-8 rounded-3xl bg-primary/5 blur-3xl" />
            <img
              src={PRODUCTS_IMG}
              alt="Óleos Moonlight"
              className="relative w-full rounded-2xl"
            />
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-6 rounded-2xl border border-border hover:border-primary/30 bg-card/50 hover:bg-card transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <product.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-lg text-foreground">{product.name}</h3>
                </div>
                <ul className="space-y-2">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      <span className="font-mono text-xs text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <a
              href="https://wa.me/244927215851"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex font-mono text-xs uppercase tracking-widest px-8 py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300"
            >
              Encomendar via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}