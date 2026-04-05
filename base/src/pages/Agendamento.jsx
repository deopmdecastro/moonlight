import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Phone, CheckCircle, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const services = [
  { value: "consulta_capilar", label: "Consulta Capilar", duration: "30 min", description: "Diagnóstico completo do seu cabelo" },
  { value: "tratamento_hidratacao", label: "Hidratação Profunda", duration: "1h", description: "Reposição de água e nutrição dos fios" },
  { value: "tratamento_nutricao", label: "Nutrição Capilar", duration: "1h", description: "Reposição de nutrientes e oleosidade" },
  { value: "tratamento_reconstrucao", label: "Reconstrução", duration: "1h30", description: "Reposição proteica para fios fragilizados" },
  { value: "cronograma_completo", label: "Cronograma Completo", duration: "2h30", description: "Hidratação + Nutrição + Reconstrução" },
];

const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

const today = new Date().toISOString().split("T")[0];

export default function Agendamento() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    client_name: "",
    client_phone: "",
    client_email: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.Appointment.create(data),
    onSuccess: () => setDone(true),
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const canProceed1 = form.service !== "";
  const canProceed2 = form.date !== "" && form.time !== "";
  const canProceed3 = form.client_name !== "" && form.client_phone !== "";

  const submit = () => {
    mutation.mutate({ ...form, status: "pendente" });
  };

  if (done) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-3xl text-foreground mb-4">Agendamento Recebido!</h2>
          <p className="font-mono text-sm text-muted-foreground mb-8">
            O seu pedido foi enviado com sucesso. Entraremos em contacto via WhatsApp para confirmar o seu agendamento.
          </p>
          <a
            href="https://wa.me/244927215851"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex font-mono text-xs uppercase tracking-widest px-8 py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all"
          >
            Falar no WhatsApp
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen">
      {/* Header */}
      <section className="py-16 px-6 bg-primary/10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Reservar</span>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mt-2">
            Marcar <span className="text-primary">Agendamento</span>
          </h1>
          <p className="font-mono text-sm text-muted-foreground mt-2">
            Escolha o serviço, a data e os seus dados para reservar.
          </p>
        </div>
      </section>

      {/* Steps indicator */}
      <section className="px-6 py-8 border-b border-border bg-background">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs transition-all duration-300 ${
                  step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>{s}</div>
                <span className={`font-mono text-xs hidden sm:block transition-colors ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                  {s === 1 ? "Serviço" : s === 2 ? "Data & Hora" : "Os seus dados"}
                </span>
              </div>
              {s < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Step 1 - Serviço */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="font-display text-2xl text-foreground mb-8">Escolha o serviço</h2>
              <div className="space-y-4">
                {services.map((svc) => (
                  <button
                    key={svc.value}
                    onClick={() => set("service", svc.value)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                      form.service === svc.value
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-mono text-sm font-bold text-foreground">{svc.label}</h3>
                        <p className="font-mono text-xs text-muted-foreground mt-1">{svc.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span className="font-mono text-xs text-primary">{svc.duration}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!canProceed1}
                className="mt-8 w-full font-mono text-xs uppercase tracking-widest py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Continuar
              </button>
            </motion.div>
          )}

          {/* Step 2 - Data & Hora */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="font-display text-2xl text-foreground mb-8">Escolha a data e hora</h2>
              <div className="space-y-6">
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Data
                  </label>
                  <Input
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Hora
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() => set("time", t)}
                        className={`py-2.5 rounded-xl border font-mono text-sm transition-all duration-300 ${
                          form.time === t
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setStep(1)} className="flex-1 font-mono text-xs uppercase tracking-widest py-3.5 border border-border text-muted-foreground rounded-full hover:border-primary hover:text-primary transition-all">
                  Voltar
                </button>
                <button onClick={() => setStep(3)} disabled={!canProceed2} className="flex-1 font-mono text-xs uppercase tracking-widest py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  Continuar
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 - Dados */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="font-display text-2xl text-foreground mb-8">Os seus dados</h2>

              {/* Resumo */}
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 mb-8">
                <h3 className="font-mono text-xs uppercase tracking-widest text-primary mb-3">Resumo do agendamento</h3>
                <p className="font-mono text-sm text-foreground">{services.find(s => s.value === form.service)?.label}</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">{form.date} às {form.time}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" /> Nome completo *
                  </label>
                  <Input value={form.client_name} onChange={(e) => set("client_name", e.target.value)} placeholder="O seu nome" className="font-mono text-sm" />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Telefone / WhatsApp *
                  </label>
                  <Input value={form.client_phone} onChange={(e) => set("client_phone", e.target.value)} placeholder="+244 9XX XXX XXX" className="font-mono text-sm" />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Email (opcional)</label>
                  <Input value={form.client_email} onChange={(e) => set("client_email", e.target.value)} placeholder="email@exemplo.com" className="font-mono text-sm" />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Observações (opcional)</label>
                  <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Alguma informação extra sobre o seu cabelo..." className="font-mono text-sm resize-none h-24" />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={() => setStep(2)} className="flex-1 font-mono text-xs uppercase tracking-widest py-3.5 border border-border text-muted-foreground rounded-full hover:border-primary hover:text-primary transition-all">
                  Voltar
                </button>
                <button
                  onClick={submit}
                  disabled={!canProceed3 || mutation.isPending}
                  className="flex-1 font-mono text-xs uppercase tracking-widest py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {mutation.isPending ? "A enviar..." : "Confirmar"}
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </section>
    </div>
  );
}