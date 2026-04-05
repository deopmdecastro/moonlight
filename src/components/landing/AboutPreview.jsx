import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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

export default function AboutPreview({ content } = {}) {
  const imageUrl = String(content?.image_url ?? "").trim();
  const imageAlt = String(content?.image_alt ?? "").trim() || "Sobre";
  const eyebrow = String(content?.eyebrow ?? "").trim();
  const title = String(content?.title ?? "").trim();
  const titleHighlight = String(content?.title_highlight ?? "").trim();
  const body = String(content?.body ?? "").trim();
  const bullets = Array.isArray(content?.bullets) ? content.bullets : [];
  const badgeLetter = String(content?.badge_letter ?? "").trim() || "M";
  const ctaLabel = String(content?.cta_label ?? "").trim() || "Saber mais";
  const ctaTo = String(content?.cta_to ?? "").trim() || "/sobre";

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full border border-primary/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-display text-primary text-lg">{badgeLetter}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{eyebrow || "Sobre"}</span>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mt-4 mb-8 leading-tight">
            {renderTitle({ title, highlight: titleHighlight })}
          </h2>

          <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-6">{body}</p>

          {bullets.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {bullets.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="font-mono text-xs text-foreground">{item}</span>
                </div>
              ))}
            </div>
          ) : null}

          <Link
            to={ctaTo}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:gap-4 transition-all duration-300"
          >
            {ctaLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

