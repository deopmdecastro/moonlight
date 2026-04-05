import React from "react";
import { Link } from "react-router-dom";
import { useBranding } from "@/lib/useBranding";
import { useLandingContent } from "@/lib/useLandingContent";
import moonlightLogo from "@/img/moonlight_logo_primary.svg";

function getInstagramInfo(handle) {
  const raw = String(handle ?? "").trim();
  if (!raw) return { label: "", url: "" };
  const clean = raw.replace(/^@/, "");
  return {
    label: clean ? `@${clean}` : "",
    url: clean ? `https://instagram.com/${clean}` : "",
  };
}

function parseWhatsAppNumber(url) {
  const value = String(url ?? "").trim();
  const match = value.match(/wa\.me\/(\d{6,15})/i);
  return match?.[1] ?? "";
}

export default function Footer() {
  const { branding } = useBranding();
  const { landing } = useLandingContent();

  const siteName = String(branding?.site_name ?? "Moonlight").trim() || "Moonlight";
  const logoSrc =
    String(branding?.logo_url ?? "").trim() ||
    String(branding?.logo_primary_url ?? "").trim() ||
    moonlightLogo;

  const instagram = getInstagramInfo(branding?.instagram_handle);
  const whatsappUrl =
    String(landing?.cta?.primary_url ?? "").trim() || "https://wa.me/244927215851";
  const whatsappNumber = parseWhatsAppNumber(whatsappUrl);
  const instagramUrl =
    String(landing?.cta?.secondary_url ?? "").trim() ||
    instagram.url ||
    "https://instagram.com/moonlight_capilar";

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logoSrc} alt={siteName} className="h-9 w-auto shrink-0" loading="lazy" />
              <span className="font-display text-xl text-foreground">{siteName}</span>
            </div>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-xs">
              Clínica Capilar — Especializada em cabelos crespos naturais. 
              Aceitação capilar como primeiro passo para a saúde do seu cabelo.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-primary mb-4">Navegação</h4>
            <div className="flex flex-col gap-3">
              <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">Início</Link>
              <Link to="/sobre" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">Sobre</Link>
              <Link to="/loja" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">Loja</Link>
              <Link to="/guia" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">Guia Capilar</Link>
              <Link to="/blog" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-primary mb-4">Contacto</h4>
            <div className="flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {whatsappNumber ? `+${whatsappNumber}` : "WhatsApp"}
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {instagram.label || "@moonlight_capilar"}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteName}. Todos os direitos reservados.
          </p>
          <p className="font-mono text-xs text-muted-foreground italic">
            "Eu sou a coroa que você carrega, a tua identidade"
          </p>
        </div>
      </div>
    </footer>
  );
}
