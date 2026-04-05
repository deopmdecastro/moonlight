import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

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

export default function ProductsPreview({ content } = {}) {
  const imageUrl = String(content?.image_url ?? "").trim();
  const imageAlt = String(content?.image_alt ?? "").trim() || "Produtos";
  const eyebrow = String(content?.eyebrow ?? "").trim();
  const title = String(content?.title ?? "").trim();
  const titleHighlight = String(content?.title_highlight ?? "").trim();
  const subtitle = String(content?.subtitle ?? "").trim();
  const items = Array.isArray(content?.items) ? content.items : [];
  const ctaLabel = String(content?.cta_label ?? "").trim() || "Ver mais";
  const ctaTo = String(content?.cta_to ?? "").trim() || "/produtos";

  return (
    <section className="py-32 px-6 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{eyebrow || "Produtos"}</span>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mt-4 leading-tight">
            {renderTitle({ title, highlight: titleHighlight })}
          </h2>
          {subtitle ? (
            <p className="font-mono text-sm text-muted-foreground mt-4 max-w-lg mx-auto">{subtitle}</p>
          ) : null}
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
              src={imageUrl}
              alt={imageAlt}
              className="relative w-full rounded-2xl hover:brightness-110 transition-all duration-700"
            />
          </motion.div>

          <div className="space-y-4">
            {items.map((product, i) => (
              <motion.div
                key={`${product?.name ?? i}`}
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
                    <h3 className="font-mono text-sm text-foreground">{String(product?.name ?? "")}</h3>
                    <p className="font-mono text-xs text-muted-foreground">{String(product?.benefit ?? "")}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            ))}

            <Link
              to={ctaTo}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary mt-6 hover:gap-4 transition-all duration-300"
            >
              {ctaLabel} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

