import React from "react";
import { motion } from "framer-motion";

export default function QuoteSection({ image }) {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <div className="w-20 h-20 rounded-full mx-auto mb-8 overflow-hidden border-2 border-primary/20">
          <img src={image} alt="Hair care" className="w-full h-full object-cover" />
        </div>
        
        <blockquote className="font-display text-2xl md:text-4xl text-foreground leading-snug mb-6 italic">
          "Cabelos saudáveis não são apenas um desejo, são um{" "}
          <span className="text-primary not-italic">compromisso</span>."
        </blockquote>

        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Moonlight Clínica Capilar
        </p>
      </motion.div>
    </section>
  );
}