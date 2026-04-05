import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function AboutPreview({ aboutImage }) {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={aboutImage}
              alt="Krisnélia Neto - Fundadora da Moonlight"
              className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full border border-primary/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-display text-primary text-lg">K</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Sobre Mim</span>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mt-4 mb-8 leading-tight">
            Krisnélia<br />
            <span className="text-primary">Neto</span>
          </h2>
          <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-6">
            Terapeuta e consultora capilar, CEO e fundadora da Moonlight. 
            Trabalhar com terapia capilar é uma forma de levantar a autoestima das pessoas — 
            é incrível ver como as pessoas confiam em mim e nos meus produtos.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {["Terapeuta capilar", "Consultora capilar", "CEO & Fundadora", "Especialista em naturais"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="font-mono text-xs text-foreground">{item}</span>
              </div>
            ))}
          </div>

          <Link
            to="/sobre"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:gap-4 transition-all duration-300"
          >
            Saber mais <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}