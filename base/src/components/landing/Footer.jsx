import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full bg-accent/60" />
                <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-primary" />
              </div>
              <span className="font-display text-xl text-foreground">moonlight</span>
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
              <Link to="/produtos" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">Produtos</Link>
              <Link to="/guia" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">Guia Capilar</Link>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-primary mb-4">Contacto</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/244927215851"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                +244 927 215 851
              </a>
              <a
                href="https://instagram.com/moonlight_capilar"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                @moonlight_capilar
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} Moonlight Clínica Capilar — By Krisnélia Neto
          </p>
          <p className="font-mono text-xs text-muted-foreground italic">
            "Eu sou a coroa que você carrega, a tua identidade"
          </p>
        </div>
      </div>
    </footer>
  );
}