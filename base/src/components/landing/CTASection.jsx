import React from "react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="relative inline-block mb-8">
          <div className="w-16 h-16 rounded-full bg-accent/30 mx-auto" />
          <div className="absolute top-1 right-0 w-12 h-12 rounded-full bg-primary/80" />
        </div>

        <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight mb-6">
          Pronta para transformar<br />
          o seu <span className="text-primary">cabelo</span>?
        </h2>
        <p className="font-mono text-sm text-muted-foreground mb-10 max-w-md mx-auto">
          Entre em contacto connosco e descubra o tratamento ideal para o seu tipo de cabelo.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://wa.me/244927215851"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-widest px-8 py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300"
          >
            WhatsApp
          </a>
          <a
            href="https://instagram.com/moonlight_capilar"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-widest px-8 py-3.5 border border-border text-foreground rounded-full hover:border-primary hover:text-primary transition-all duration-300"
          >
            Instagram
          </a>
        </div>
      </motion.div>
    </section>
  );
}