import React from "react";
import { motion } from "framer-motion";
import { Droplets, Leaf, Shield, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const RITUAL_IMG = "https://media.base44.com/images/public/69cc376dc1ad26b57bf8eecd/6eee5f2d7_generated_acd6eda3.png";

const cronograma = [
  {
    number: "01",
    title: "Hidratação",
    description: "Reposição de água no cabelo através de extratos de plantas, frutas ou vitaminas.",
    icon: Droplets,
  },
  {
    number: "02",
    title: "Nutrição",
    description: "Responsável por repor os nutrientes perdidos e equilibrar a oleosidade natural do nosso cabelo.",
    icon: Leaf,
  },
  {
    number: "03",
    title: "Reconstrução",
    description: "Reposição proteica. Sua ação proporciona mais força aos cabelos frágeis e reequilibra a elasticidade comprometida por químicas e fatores externos.",
    icon: Shield,
  },
];

const faqs = [
  {
    q: "Quantas vezes devo passar óleo no cabelo?",
    a: "Os óleos capilares podem ser utilizados diariamente em média de três vezes ao dia. Quanto mais exposto for o cabelo ao vento, sol e maresia mais vezes a aplicação diária.",
  },
  {
    q: "É bom dormir com óleo no cabelo?",
    a: "Usar óleo capilar à noite pode salvar os seus fios, afinal, eles sofrem danos até enquanto você dorme. A tração do cabelo com a pele e o suor, e com a fronha de algodão, machucam a fibra capilar, já que é uma parte bem sensível.",
  },
  {
    q: "Quando usar os óleos da Moonlight?",
    a: "Você pode utilizar o óleo de cabelo: antes de lavar o cabelo, após a lavagem do cabelo, antes de dormir e ao acordar.",
  },
  {
    q: "Como aplicar no couro cabeludo?",
    a: "Faça uma massagem bem suave com a ponta dos dedos ao aplicar no couro cabeludo.",
  },
];

export default function Guia() {
  return (
    <div className="pt-24">
      {/* Cronograma Capilar */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">O Ritual</span>
            <h1 className="font-display text-4xl md:text-6xl text-foreground mt-4 leading-tight">
              Cronograma <span className="text-primary">Capilar</span>
            </h1>
            <p className="font-mono text-sm text-muted-foreground mt-4 max-w-lg mx-auto">
              O cronograma capilar é composto por 3 etapas essenciais para a saúde do seu cabelo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {cronograma.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="group relative"
              >
                <div className="p-8 rounded-2xl border border-border hover:border-primary/30 bg-card/50 hover:bg-card transition-all duration-500 h-full">
                  <span className="font-display text-7xl text-primary/10 absolute top-4 right-6">{step.number}</span>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground mb-4">{step.title}</h3>
                  <p className="font-mono text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Umectação */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Nutrição Capilar</span>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mt-4 mb-8 leading-tight">
              Umectação
            </h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-8">
              A umectação é uma etapa da nutrição capilar, que consiste no tratamento à base de óleos, 
              sejam eles essenciais ou vegetais. O seu principal objetivo é acabar com o ressecamento, 
              nutrir os fios e devolver o brilho aos mesmos.
            </p>
            <div className="space-y-3">
              {["Redução da quebra capilar", "Diminuição do frizz", "Redução do atrito entre os fios", "Fortalecimento da fibra capilar"].map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-mono text-sm text-foreground">{b}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-2xl" />
            <img
              src={RITUAL_IMG}
              alt="Umectação capilar"
              className="relative w-full rounded-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Dúvidas</span>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mt-4">
              Perguntas <span className="text-primary">Frequentes</span>
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="font-mono text-sm text-foreground hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-mono text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Letter from hair */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 md:p-12 rounded-2xl border border-primary/20 bg-card/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Uma Mensagem Especial</span>
            <h3 className="font-display text-2xl md:text-3xl text-foreground mt-4 mb-6">
              Do seu cabelo para você
            </h3>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-4 italic">
              "Oi minha dona linda e maravilhosa, muito obrigada por se dedicar tanto à mim, 
              pelos cuidados, pelo tempo e dinheiro investidos! Eu sou tão importante como qualquer 
              outra parte de seu corpo, por isso, me lave 3x na semana, me vista com um pijama de 
              cetim todas as noites, penteia-me com cuidado, pois eu sinto muita dor, seque-me bem 
              depois da lavagem."
            </p>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed italic">
              "Ao me prender, por favor seja delicada, e compre os óleos da Moonlight — eles ajudam 
              na minha saúde e desenvolvimento. Por favor não se chateie quando eu encolher, isso faz 
              parte das minhas características e deves amar-me como eu sou!"
            </p>
            <p className="font-display text-lg text-primary mt-8">
              "Eu sou a coroa que você carrega, a tua identidade"
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}