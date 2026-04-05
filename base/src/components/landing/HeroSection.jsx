import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";

export default function HeroSection({ heroImage }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary/10">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Moonlight Clínica Capilar"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
      </div>

      {/* Circular glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-primary/40" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              Clínica Capilar
            </span>
            <div className="h-px w-12 bg-primary/40" />
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground leading-none tracking-tight mb-6 drop-shadow-sm">
            moon<span className="text-primary">light</span>
          </h1>

          <p className="font-mono text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-12">
            Especializada em cabelos crespos naturais. Promovemos a aceitação capilar 
            como primeiro passo para alcançar a saúde do seu cabelo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/produtos"
              className="font-mono text-xs uppercase tracking-widest px-8 py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300"
            >
              Nossos Produtos
            </Link>
            <Link
              to="/sobre"
              className="font-mono text-xs uppercase tracking-widest px-8 py-3.5 border border-border text-foreground rounded-full hover:border-primary hover:text-primary transition-all duration-300"
            >
              Conheça-nos
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <ArrowDown className="w-5 h-5 text-muted-foreground animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}