import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Droplets, Leaf, Shield } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Hidratação",
    description: "Reposição de água no cabelo através de extratos de plantas, frutas ou vitaminas.",
    icon: Droplets,
  },
  {
    number: "02",
    title: "Nutrição",
    description: "Responsável por repor os nutrientes perdidos e equilibrar a oleosidade natural.",
    icon: Leaf,
  },
  {
    number: "03",
    title: "Reconstrução",
    description: "Reposição proteica que proporciona mais força aos cabelos frágeis.",
    icon: Shield,
  },
];

export default function TimelinePreview() {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">O Ritual</span>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mt-4 leading-tight">
            Cronograma <span className="text-primary">Capilar</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="group relative"
            >
              <div className="p-8 rounded-2xl border border-border hover:border-primary/30 bg-card/50 hover:bg-card transition-all duration-500 h-full">
                <span className="font-display text-6xl text-primary/10 absolute top-4 right-6">{step.number}</span>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-3">{step.title}</h3>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/guia"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:gap-4 transition-all duration-300"
          >
            Guia completo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}