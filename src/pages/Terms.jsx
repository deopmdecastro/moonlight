import React from 'react';

export default function Terms() {
  return (
    <div className="min-h-screen">
      <div className="bg-primary py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/60 mb-2">Legal</p>
          <h1 className="font-heading text-4xl md:text-6xl text-primary-foreground font-light">Termos & Condições</h1>
          <p className="font-body text-sm text-primary-foreground/70 mt-3">Regras básicas de utilização do website.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <section className="space-y-2">
          <h2 className="font-heading text-xl">1. Encomendas</h2>
          <p className="font-body text-sm text-muted-foreground">
            Ao efetuar uma encomenda, confirma que os dados fornecidos são verdadeiros e que está autorizado a usar o método de
            pagamento.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-xl">2. Envios e devoluções</h2>
          <p className="font-body text-sm text-muted-foreground">
            Prazos e custos podem variar. Para dúvidas, contacte o suporte através da página de Suporte.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-xl">3. Conteúdos</h2>
          <p className="font-body text-sm text-muted-foreground">
            O conteúdo do site pode ser atualizado sem aviso. As imagens são ilustrativas.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-xl">4. Contacto</h2>
          <p className="font-body text-sm text-muted-foreground">Para qualquer questão, use o suporte ou o email do rodapé.</p>
        </section>
      </div>
    </div>
  );
}

