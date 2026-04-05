import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const ABOUT_IMG = "https://media.base44.com/images/public/69cc376dc1ad26b57bf8eecd/d9d7bc902_generated_a845f4fd.png";

const credentials = [
  "Terapeuta capilar",
  "Consultora capilar",
  "CEO e fundadora da marca Moonlight",
  "Especialista em cabelos naturais",
];

export default function Sobre() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Sobre Mim</span>
            <h1 className="font-display text-4xl md:text-6xl text-foreground mt-4 mb-8 leading-tight">
              Krisnélia<br /><span className="text-primary">Neto</span>
            </h1>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-6">
              Chamo-me Krisnélia, estou com 21 anos e já sou terapeuta capilar a mais de 1 ano. 
              Comecei a trabalhar com terapia capilar em Fevereiro de 2023 quando fiz a minha primeira 
              formação e logo em seguida fundei a Moonlight.
            </p>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-8">
              Para mim trabalhar com terapia capilar é uma forma de levantar a autoestima das pessoas, 
              que é o que eu sempre quis fazer. É incrível ver como as pessoas confiam em mim e nos meus 
              produtos e a sensação de nunca tê-las decepcionado é indescritível — eu estou literalmente 
              a viver a melhor fase da minha carreira.
            </p>

            <div className="space-y-3">
              {credentials.map((c) => (
                <div key={c} className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="font-mono text-sm text-foreground">{c}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-2xl" />
            <img
              src={ABOUT_IMG}
              alt="Krisnélia Neto"
              className="relative w-full rounded-2xl object-cover max-h-[600px]"
            />
          </motion.div>
        </div>
      </section>

      {/* Sobre Nós */}
      <section className="py-20 px-6">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Sobre Nós</span>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mt-4 mb-8">
            Moonlight <span className="text-primary">Clínica Capilar</span>
          </h2>
          <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-6">
            A Moonlight é uma loja/clínica capilar, voltada ao tratamento e cuidados de todos os tipos 
            de cabelo, mas especializada em cabelos crespos naturais, que oferece os tratamentos e 
            cuidados que o seu cabelo precisa.
          </p>
          <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-8">
            Promovemos principalmente a aceitação capilar, pois acreditamos ser o primeiro passo para 
            alcançar a saúde capilar. Somos uma clínica completa, pois vendemos os acessórios que 
            auxiliam nos cuidados diários do seu cabelo, como as famosas toucas de cetim e óleos 100% 
            naturais para umectação e finalização.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            {[
              { num: "100%", label: "Natural" },
              { num: "+1", label: "Ano de experiência" },
              { num: "7", label: "Produtos" },
            ].map((stat) => (
              <div key={stat.label} className="p-6 rounded-2xl border border-border bg-card/50">
                <span className="font-display text-3xl text-primary">{stat.num}</span>
                <p className="font-mono text-xs text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}