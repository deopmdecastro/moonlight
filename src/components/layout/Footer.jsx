import React from 'react';
import { Link } from 'react-router-dom';

import { useBranding } from '@/lib/useBranding';

export default function Footer() {
  const { branding } = useBranding();
  const siteName = String(branding?.site_name ?? 'Moonlight').trim() || 'Moonlight';
  const email = String(branding?.contact_email ?? '').trim() || 'info@moonlightacessorios.com';
  const instagramHandleRaw = String(branding?.instagram_handle ?? '').trim();
  const instagramHandle = instagramHandleRaw ? (instagramHandleRaw.startsWith('@') ? instagramHandleRaw : `@${instagramHandleRaw}`) : '';
  const instagramUrl = instagramHandle ? `https://instagram.com/${instagramHandle.replace(/^@/, '')}` : '';

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full bg-accent/60" />
                <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-primary" />
              </div>
              <span className="font-display text-xl text-foreground">{siteName}</span>
            </div>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-xs">
              Bijuterias elegantes para acompanhar o seu dia a dia — com intenção, cuidado e beleza em cada detalhe.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-primary mb-4">Navegação</h4>
            <div className="flex flex-col gap-3">
              <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                Início
              </Link>
              <Link to="/sobre" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                Sobre
              </Link>
              <Link to="/produtos" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                Produtos
              </Link>
              <Link to="/loja" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                Loja
              </Link>
              <Link to="/guia" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                Guia
              </Link>
              <Link to="/contacto" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                Contacto
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-primary mb-4">Contacto</h4>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${email}`}
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors break-all"
              >
                {email}
              </a>
              {instagramUrl ? (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {instagramHandle}
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted-foreground">© {year} {siteName}. Todos os direitos reservados.</p>
          <p className="font-mono text-xs text-muted-foreground italic">"Elegância em cada detalhe"</p>
        </div>
      </div>
    </footer>
  );
}
