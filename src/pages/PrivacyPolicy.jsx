import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      <div className="bg-primary py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/60 mb-2">Legal</p>
          <h1 className="font-heading text-4xl md:text-6xl text-primary-foreground font-light">Política de Privacidade</h1>
          <p className="font-body text-sm text-primary-foreground/70 mt-3">Versão simplificada para o seu site.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <section className="space-y-2">
          <h2 className="font-heading text-xl">1. Dados que recolhemos</h2>
          <p className="font-body text-sm text-muted-foreground">
            Recolhemos dados necessários para criar conta, processar encomendas e prestar suporte (ex.: nome, email, morada e
            histórico de compras).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-xl">2. Finalidades</h2>
          <p className="font-body text-sm text-muted-foreground">
            Usamos os dados para executar o serviço (encomendas, pagamentos, envios), comunicações de suporte e melhoria do
            website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-xl">3. Partilha</h2>
          <p className="font-body text-sm text-muted-foreground">
            Podemos partilhar dados com fornecedores essenciais (pagamentos, envios) apenas para executar o serviço.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-xl">4. Os seus direitos</h2>
          <p className="font-body text-sm text-muted-foreground">
            Pode pedir acesso, retificação ou eliminação dos seus dados. Contacte-nos via email para pedidos de privacidade.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-xl">5. Contacto</h2>
          <p className="font-body text-sm text-muted-foreground">Para questões de privacidade, use o email do rodapé.</p>
        </section>
      </div>
    </div>
  );
}

