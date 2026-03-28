import React from 'react';

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen">
      <div className="bg-primary py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/60 mb-2">Legal</p>
          <h1 className="font-heading text-4xl md:text-6xl text-primary-foreground font-light">Política de Cookies</h1>
          <p className="font-body text-sm text-primary-foreground/70 mt-3">Como usamos cookies no site.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <section className="space-y-2">
          <h2 className="font-heading text-xl">O que são cookies</h2>
          <p className="font-body text-sm text-muted-foreground">
            Cookies são pequenos ficheiros guardados no seu dispositivo para ajudar o website a funcionar e melhorar a experiência.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-xl">Cookies essenciais</h2>
          <p className="font-body text-sm text-muted-foreground">
            Usados para autenticação, sessão e funcionalidades básicas (ex.: carrinho e conta).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-xl">Medição / Analytics</h2>
          <p className="font-body text-sm text-muted-foreground">
            Podemos medir utilização do site para entender páginas mais visitadas e melhorar conteúdos.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-xl">Como gerir cookies</h2>
          <p className="font-body text-sm text-muted-foreground">
            Pode gerir cookies nas definições do seu browser. Algumas funcionalidades podem não funcionar sem cookies essenciais.
          </p>
        </section>
      </div>
    </div>
  );
}

