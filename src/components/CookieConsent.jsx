import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'zana_cookie_consent_v1';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="max-w-5xl mx-auto bg-card/95 backdrop-blur-md border border-border shadow-lg rounded-lg p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="min-w-0">
          <div className="font-heading text-base">Cookies</div>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Usamos cookies para melhorar a experiência e analisar tráfego. Ao continuar, concorda com a nossa{' '}
            <Link to="/cookies" className="text-primary underline underline-offset-4">
              Política de Cookies
            </Link>{' '}
            e{' '}
            <Link to="/politica-privacidade" className="text-primary underline underline-offset-4">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            className="rounded-none font-body text-sm tracking-wider"
            onClick={() => {
              try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: true, at: new Date().toISOString() }));
              } catch {
                // ignore
              }
              setVisible(false);
            }}
          >
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
}

