import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LayoutDashboard, LogOut, Menu, Settings, ShoppingBag, User, X } from 'lucide-react';

import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { useBranding } from '@/lib/useBranding';
import moonlightLogo from '@/img/moonlight_logo_primary.svg';

import StoreNotificationBell from '@/components/notifications/StoreNotificationBell';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function Navbar() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { branding } = useBranding();

  const [scrolled, setScrolled] = useState(false);

  const logoSrc = String(branding?.logo_primary_url ?? '').trim() || moonlightLogo;
  const siteName = String(branding?.site_name ?? 'Moonlight').trim() || 'Moonlight';
  const isLogged = Boolean(user);
  const isAdmin = Boolean(user?.is_admin);
  const isSeller = Boolean(user?.is_seller);
  const scheduleTo = '/agendamento';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const updateThemeColor = () => {
      const meta = document.querySelector('meta[name="theme-color"]');
      const nav = document.getElementById('app-topbar');
      if (!meta || !nav) return;
      const bg = window.getComputedStyle(nav).backgroundColor;
      if (bg) meta.setAttribute('content', bg);
    };

    updateThemeColor();
    window.addEventListener('resize', updateThemeColor);
    return () => window.removeEventListener('resize', updateThemeColor);
  }, [branding?.theme_color, branding?.background_color]);

  const navLinks = useMemo(
    () => [
      { to: '/', label: 'Início' },
      { to: '/sobre', label: 'Sobre' },
      { to: '/produtos', label: 'Produtos' },
      { to: '/loja', label: 'Loja' },
      { to: '/guia', label: 'Guia' },
      { to: '/blog', label: 'Blog' },
      { to: '/agendamento', label: 'Agendamento' },
    ],
    [],
  );

  const moreLinks = useMemo(
    () => [
      { to: '/catalogo', label: 'Catálogo (com filtros)' },
      { to: '/faq', label: 'FAQ' },
      { to: '/suporte', label: 'Suporte' },
      { to: '/contacto', label: 'Contacto' },
      { to: '/favoritos', label: 'Favoritos' },
    ],
    [],
  );

  const handleLogout = () => {
    logout();
    navigate('/conta', { replace: true });
  };

  const iconBtn =
    'inline-flex items-center justify-center rounded-full h-10 w-10 border border-border bg-background/60 backdrop-blur hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

  return (
    <nav
      id="app-topbar"
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-background/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <img src={logoSrc} alt={siteName} className="h-9 w-auto shrink-0" loading="eager" />
          <span className="font-display text-lg text-foreground tracking-tight truncate">{siteName}</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Link to={scheduleTo}>
              <Button className="rounded-none font-body text-xs tracking-wider">Agendar</Button>
            </Link>
            {!isLogged ? (
              <Link to="/conta">
                <Button variant="outline" className="rounded-none font-body text-xs tracking-wider">
                  Entrar
                </Button>
              </Link>
            ) : null}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {isLogged ? (
              <StoreNotificationBell />
            ) : (
              <Link to="/conta" className={iconBtn} aria-label="Notificações">
                <Bell className="w-4 h-4 text-foreground" />
              </Link>
            )}

            <Link to="/carrinho" className={`${iconBtn} relative`} aria-label="Carrinho">
              <ShoppingBag className="w-4 h-4 text-foreground" />
              {itemCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              ) : null}
            </Link>

            <Link to="/conta" className={iconBtn} aria-label="Conta">
              <User className="w-4 h-4 text-foreground" />
            </Link>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <button className={iconBtn} aria-label="Abrir menu">
                <Menu className="w-4 h-4 text-foreground" />
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[340px] p-0">
              <div className="p-5">
                <SheetHeader className="space-y-0 text-left">
                  <SheetTitle className="font-display text-lg">
                    <Link to="/" className="inline-flex items-center gap-3" aria-label={siteName}>
                      <img src={logoSrc} alt={siteName} className="h-9 w-auto" loading="eager" />
                      <span className="truncate">{siteName}</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-4 flex gap-2">
                  <SheetClose asChild>
                    <Link to={scheduleTo} className="flex-1">
                      <Button className="w-full rounded-none font-body text-xs tracking-wider">Agendar</Button>
                    </Link>
                  </SheetClose>
                  {!isLogged ? (
                    <SheetClose asChild>
                      <Link to="/conta" className="flex-1">
                        <Button variant="outline" className="w-full rounded-none font-body text-xs tracking-wider">
                          Entrar
                        </Button>
                      </Link>
                    </SheetClose>
                  ) : null}
                </div>
              </div>

              <Separator />

              <div className="p-3">
                <div className="px-2 py-2 text-[11px] font-mono tracking-widest text-muted-foreground uppercase">
                  Navegação
                </div>
                <div className="space-y-1">
                  {[...navLinks, ...moreLinks].map((l) => (
                    <SheetClose asChild key={l.to}>
                      <Link
                        to={l.to}
                        className="block rounded-xl px-3 py-2 font-mono text-sm text-foreground/90 hover:bg-secondary/60 transition-colors"
                      >
                        {l.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="p-3">
                <div className="px-2 py-2 text-[11px] font-mono tracking-widest text-muted-foreground uppercase">
                  Conta
                </div>

                <div className="space-y-1">
                  <SheetClose asChild>
                    <Link
                      to="/conta"
                      className="flex items-center gap-3 rounded-xl px-3 py-2 font-mono text-sm hover:bg-secondary/60 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {isLogged ? 'Minha Conta' : 'Entrar / Criar conta'}
                    </Link>
                  </SheetClose>

                  {isLogged ? (
                    <SheetClose asChild>
                      <Link
                        to="/definicoes"
                        className="flex items-center gap-3 rounded-xl px-3 py-2 font-mono text-sm hover:bg-secondary/60 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Definições
                      </Link>
                    </SheetClose>
                  ) : null}

                  <SheetClose asChild>
                    <Link
                      to="/carrinho"
                      className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 font-mono text-sm hover:bg-secondary/60 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <ShoppingBag className="w-4 h-4" />
                        Carrinho
                      </span>
                      {itemCount > 0 ? (
                        <span className="bg-primary text-primary-foreground text-[10px] px-1.5 h-5 min-w-5 rounded-full flex items-center justify-center">
                          {itemCount > 9 ? '9+' : itemCount}
                        </span>
                      ) : null}
                    </Link>
                  </SheetClose>

                  {isAdmin ? (
                    <SheetClose asChild>
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 rounded-xl px-3 py-2 font-mono text-sm hover:bg-secondary/60 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Painel Admin
                      </Link>
                    </SheetClose>
                  ) : null}

                  {isSeller ? (
                    <SheetClose asChild>
                      <Link
                        to="/vendedor"
                        className="flex items-center gap-3 rounded-xl px-3 py-2 font-mono text-sm hover:bg-secondary/60 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Painel Vendedor
                      </Link>
                    </SheetClose>
                  ) : null}

                  <SheetClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-start gap-3 rounded-xl px-3 py-2 font-mono text-sm hover:bg-secondary/60 disabled:opacity-50"
                      disabled={!isLogged}
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </SheetClose>
                </div>
              </div>

              <Separator />

              <SheetClose asChild>
                <button className="w-full px-4 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center justify-center gap-2">
                  Fechar <X className="w-4 h-4" />
                </button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
