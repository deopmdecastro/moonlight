import React from "react";
import { motion } from "framer-motion";
import { useBranding } from "@/lib/useBranding";

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

export default function CTASection({ content } = {}) {
  const { branding } = useBranding();
  const instagramRaw = String(branding?.instagram_handle ?? "").trim();
  const instagramHandle = instagramRaw ? instagramRaw.replace(/^@/, "") : "";
  const instagramDefaultUrl = instagramHandle ? `https://instagram.com/${instagramHandle}` : "https://instagram.com/moonlight_capilar";

  const title = String(content?.title ?? "").trim();
  const titleHighlight = String(content?.title_highlight ?? "").trim();
  const subtitle = String(content?.subtitle ?? "").trim();
  const primaryLabel = String(content?.primary_label ?? "").trim() || "WhatsApp";
  const primaryUrl = String(content?.primary_url ?? "").trim() || "https://wa.me/244927215851";
  const secondaryLabel = String(content?.secondary_label ?? "").trim() || "Instagram";
  const secondaryUrlRaw = String(content?.secondary_url ?? "").trim();
  const secondaryUrl = secondaryUrlRaw || instagramDefaultUrl;

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
          {renderTitle({ title, highlight: titleHighlight })}
        </h2>
        <p className="font-mono text-sm text-muted-foreground mb-10 max-w-md mx-auto">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-widest px-8 py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300"
          >
            {primaryLabel}
          </a>
          <a
            href={secondaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-widest px-8 py-3.5 border border-border text-foreground rounded-full hover:border-primary hover:text-primary transition-all duration-300"
          >
            {secondaryLabel}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
