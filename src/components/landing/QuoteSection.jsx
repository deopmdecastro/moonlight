import React from "react";
import { motion } from "framer-motion";

function renderQuote({ text = "", highlight = "" } = {}) {
  const full = String(text ?? "");
  const mark = String(highlight ?? "");
  if (!mark || !full.toLowerCase().includes(mark.toLowerCase())) return full;
  const idx = full.toLowerCase().indexOf(mark.toLowerCase());
  const before = full.slice(0, idx);
  const mid = full.slice(idx, idx + mark.length);
  const after = full.slice(idx + mark.length);
  return (
    <>
      {before}
      <span className="text-primary not-italic">{mid}</span>
      {after}
    </>
  );
}

export default function QuoteSection({ content } = {}) {
  const imageUrl = String(content?.image_url ?? "").trim();
  const imageAlt = String(content?.image_alt ?? "").trim() || "Hair care";
  const text = String(content?.text ?? "").trim();
  const highlight = String(content?.highlight ?? "").trim();
  const footer = String(content?.footer ?? "").trim();

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <div className="w-20 h-20 rounded-full mx-auto mb-8 overflow-hidden border-2 border-primary/20">
          <img src={imageUrl} alt={imageAlt} className="w-full h-full object-cover" />
        </div>

        <blockquote className="font-display text-2xl md:text-4xl text-foreground leading-snug mb-6 italic">
          “{renderQuote({ text, highlight })}”
        </blockquote>

        {footer ? (
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{footer}</p>
        ) : null}
      </motion.div>
    </section>
  );
}

