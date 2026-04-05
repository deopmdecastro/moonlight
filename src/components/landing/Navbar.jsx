import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useBranding } from "@/lib/useBranding";
import { useLandingContent } from "@/lib/useLandingContent";
import moonlightLogo from "@/img/moonlight_logo_primary.svg";

function getInstagramUrl(handle) {
  const raw = String(handle ?? "").trim();
  if (!raw) return "";
  const clean = raw.replace(/^@/, "");
  return clean ? `https://instagram.com/${clean}` : "";
}

function parseWhatsAppNumber(url) {
  const value = String(url ?? "").trim();
  const match = value.match(/wa\.me\/(\d{6,15})/i);
  return match?.[1] ?? "";
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const { branding } = useBranding();
  const { landing } = useLandingContent();
  const isLogged = Boolean(user);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Início", href: "/" },
    { label: "Sobre", href: "/sobre" },
    { label: "Loja", href: "/loja" },
    { label: "Guia Capilar", href: "/guia" },
    { label: "Blog", href: "/blog" },
    { label: "Agendamento", href: "/agendamento" },
  ];

  const siteName = String(branding?.site_name ?? "Moonlight").trim() || "Moonlight";
  const logoSrc = String(branding?.logo_primary_url ?? "").trim() || moonlightLogo;

  const instagramUrl =
    getInstagramUrl(branding?.instagram_handle) || "https://instagram.com/moonlight_capilar";
  const whatsappUrl =
    String(landing?.cta?.primary_url ?? "").trim() || "https://wa.me/244927215851";
  const whatsappNumber = parseWhatsAppNumber(whatsappUrl);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm" : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logoSrc} alt={siteName} className="h-9 w-auto shrink-0" loading="eager" />
          <span className="font-display text-xl text-foreground tracking-tight group-hover:text-primary transition-colors">
            {siteName}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!isLogged ? (
            <Link
              to="/conta"
              className="font-mono text-xs uppercase tracking-widest px-5 py-2.5 border border-border text-foreground rounded-full hover:border-primary hover:text-primary transition-all duration-300"
            >
              Entrar
            </Link>
          ) : null}

          <Link
            to="/agendamento"
            className="font-mono text-xs uppercase tracking-widest px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300"
          >
            Agendar
          </Link>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-mono text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {!isLogged ? (
                <Link
                  to="/conta"
                  onClick={() => setMenuOpen(false)}
                  className="font-mono text-sm uppercase tracking-widest text-foreground hover:text-primary transition-colors mt-2"
                >
                  Entrar
                </Link>
              ) : null}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm uppercase tracking-widest text-primary mt-2"
              >
                {whatsappNumber ? `+${whatsappNumber}` : "WhatsApp"}
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                Instagram
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
