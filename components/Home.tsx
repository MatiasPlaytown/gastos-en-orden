
import React, { useState, useEffect } from 'react';
import { generatePeacePill } from '../services/geminiService';
import { Insight, Tip } from '../types';

const Home: React.FC = () => {
  const [peacePill, setPeacePill] = useState("Cuidar tu dinero es una forma de amarte a ti mismo.");
  const [loadingPill, setLoadingPill] = useState(true);

  const insights: Insight[] = [
    {
      id: '1',
      type: 'alert',
      title: 'Aviso de Suscripción',
      description: 'Tu renovación de Netflix es en 2 días.',
      icon: 'notifications_active',
      color: 'purple'
    },
    {
      id: '2',
      type: 'success',
      title: 'Progreso del Reto',
      description: '3 días ahorrando en café. ¡Vas genial!',
      icon: 'trending_up',
      color: 'orange'
    }
  ];

  const tips: Tip[] = [
    {
      tag: "Mindfulness",
      title: "La Regla de las 24 Horas",
      text: "Espera un día antes de comprar algo por impulso. Verás que la mayoría de las veces no lo necesitabas.",
      icon: "timer",
      emotion: "Paciencia es paz.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX_LDrHVOk0xrrEYX1w8jlM6v5fy48IJmiFSGGds72ISZWX3c8msrm-rHXbLOgu0f-a5qcOc-UAEfvLSuaL8tJU9hMPO1qC8I2XhBj0yugGr0Y1mbJQ6HPj_35nVwfDK3wzyknzfprF-_JN1rrKXK1whnO-UfBn2jjHMyh2zx9LGcEaJnJaXIZKSrN3zrnOrKdNclPFNrWpLzPLCs9arWUs5rVvaDXuBrKNnaZ7nPvP0o6vsN2LTdkGuOMDHXssxe79BGQ2FPYWDU",
    },
    {
      tag: "Suscripciones",
      title: "Limpieza de servicios",
      text: "Cancela hoy esa app que no abres hace un mes. Recuperar ese dinero te dará una sonrisa.",
      icon: "delete_sweep",
      emotion: "Orden digital, orden mental.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtsnh4lHLHPO2xfoP_8vW_ZmmkxjPE9GqcYzguSN7v7vuOVImBxH44bj606CcW87owYA4qT7D0eV12lIYBNJ8eLelU8CRO6lcrXcRp3jKjllOTZHSsaxLtUUdXSQZ2F9CPIfg63nXDCr9sW3_u_mzaUoFd7wcFeVpA9aYh3zTpT84lePUbO_ExcurqkTvjtakLOtBpULJecEm3fn1V4k4BvkdMdku4xL1tBhJD4AoGbNAx0woYIo89QapHD8DZTYWK-7sA7E1DeZk",
    }
  ];

  useEffect(() => {
    const fetchPill = async () => {
      const pill = await generatePeacePill();
      setPeacePill(pill);
      setLoadingPill(false);
    };
    fetchPill();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-6 space-y-8 max-w-lg mx-auto">
      {/* Resumen Importante */}
      <section className="space-y-4">
        <h2 className="text-xl font-black tracking-tight dark:text-white">Resumen importante del día</h2>
        <div className="grid grid-cols-1 gap-3">
          {insights.map(insight => (
            <div key={insight.id} className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm">
              <div className={`size-12 rounded-full flex items-center justify-center ${insight.color === 'purple' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                <span className="material-symbols-outlined">{insight.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{insight.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{insight.description}</p>
              </div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </div>
          ))}
        </div>
      </section>

      {/* Píldora de Paz */}
      <section className="peace-gradient p-6 rounded-3xl border border-white/50 dark:border-slate-800 shadow-lg relative overflow-hidden group">
        <div className="relative z-10 space-y-3">
           <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs animate-pulse">auto_awesome</span>
              Tu Píldora de Paz
            </div>
            <p className="text-lg font-medium italic leading-relaxed text-slate-800 dark:text-slate-200">
              "{loadingPill ? "Pensando en algo sabio para ti..." : peacePill}"
            </p>
        </div>
        <div className="absolute -bottom-4 -right-4 size-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
      </section>

      {/* Consejos (Píldoras de Sabiduría) */}
      <section className="space-y-4 pb-10">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-black tracking-tight">Píldoras de Sabiduría</h2>
            <p className="text-sm text-slate-500">Pequeños hábitos, grandes cambios.</p>
          </div>
        </div>

        <div className="space-y-6">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group active:scale-[0.98] transition-all">
              <div className="h-40 bg-cover bg-center" style={{backgroundImage: `url("${tip.img}")`}}></div>
              <div className="p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">{tip.tag}</span>
                  <span className="material-symbols-outlined text-slate-300">{tip.icon}</span>
                </div>
                <h3 className="font-bold text-lg">{tip.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tip.text}</p>
                <div className="pt-4 flex justify-between items-center border-t border-slate-50 dark:border-slate-700/50 mt-4">
                  <span className="text-[10px] font-bold text-slate-400 italic">{tip.emotion}</span>
                  <button className="text-primary text-sm font-bold flex items-center gap-1">
                    Entendido <span className="material-symbols-outlined text-sm">done_all</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
