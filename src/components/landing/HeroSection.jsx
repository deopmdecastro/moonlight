import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";

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

export default function HeroSection({ content } = {}) {
  const imageUrl = String(content?.image_url ?? "").trim();
  const eyebrow = String(content?.eyebrow ?? "").trim();
  const title = String(content?.title ?? "").trim();
  const titleHighlight = String(content?.title_highlight ?? "").trim();
  const subtitle = String(content?.subtitle ?? "").trim();
  const primaryLabel = String(content?.primary_cta_label ?? "").trim() || "Ver mais";
  const primaryTo = String(content?.primary_cta_to ?? "").trim() || "/";
  const secondaryLabel = String(content?.secondary_cta_label ?? "").trim() || "Saber mais";
  const secondaryTo = String(content?.secondary_cta_to ?? "").trim() || "/";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary/10">
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={title || "Moonlight"}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
      </div>

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
              {eyebrow || "Clínica Capilar"}
            </span>
            <div className="h-px w-12 bg-primary/40" />
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground leading-none tracking-tight mb-6 drop-shadow-sm">
            {renderTitle({ title, highlight: titleHighlight })}
          </h1>

          <p className="font-mono text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-12">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={primaryTo}
              className="font-mono text-xs uppercase tracking-widest px-8 py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300"
            >
              {primaryLabel}
            </Link>
            <Link
              to={secondaryTo}
              className="font-mono text-xs uppercase tracking-widest px-8 py-3.5 border border-border text-foreground rounded-full hover:border-primary hover:text-primary transition-all duration-300"
            >
              {secondaryLabel}
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

