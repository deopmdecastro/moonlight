import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Droplets, Leaf, Shield } from "lucide-react";

const icons = [Droplets, Leaf, Shield];

function renderTitle({ title = "", highlight = "" } = {}) {
  const full = String(title ?? "");
  const mark = String(highlight ?? "");
  if (!mark || !full.toLowerCase().includes(mark.toLowerCase())) return full;
  const idx = full.toLowerCase().indexOf(mark.toLowerCase());
  const before = full.slice(0, idx);
  const mid = full.slice(idx, idx + mark.length);
  const after = full.slice(idx + mark.length);
  return (
    <>
      {before}
      <span className="text-primary">{mid}</span>
      {after}
    </>
  );
}

export default function TimelinePreview({ content } = {}) {
  const eyebrow = String(content?.eyebrow ?? "").trim();
  const title = String(content?.title ?? "").trim();
  const titleHighlight = String(content?.title_highlight ?? "").trim();
  const steps = Array.isArray(content?.steps) ? content.steps : [];
  const ctaLabel = String(content?.cta_label ?? "").trim() || "Guia completo";
  const ctaTo = String(content?.cta_to ?? "").trim() || "/guia";

  return (
    <section className="py-32 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{eyebrow || "O Ritual"}</span>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mt-4 leading-tight">
            {renderTitle({ title, highlight: titleHighlight })}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.slice(0, 3).map((step, i) => {
            const Icon = icons[i] ?? Droplets;
            const number = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={`${number}-${step?.title ?? ""}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="group relative"
              >
                <div className="p-8 rounded-2xl border border-border hover:border-primary/30 bg-card/50 hover:bg-card transition-all duration-500 h-full">
                  <span className="font-display text-6xl text-primary/10 absolute top-4 right-6">{number}</span>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-3">{String(step?.title ?? "")}</h3>
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed">{String(step?.description ?? "")}</p>
                </div>
                {i < 2 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-border" />}
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to={ctaTo}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:gap-4 transition-all duration-300"
          >
            {ctaLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

