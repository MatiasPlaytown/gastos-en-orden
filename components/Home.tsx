
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
      description: 'Tu renovación de Netflix vence en 2 días.',
      icon: 'notifications_active',
      color: 'purple'
    },
    {
      id: '2',
      type: 'success',
      title: 'Progreso del Reto',
      description: 'Llevas 3 días ahorrando en café. ¡Excelente!',
      icon: 'trending_up',
      color: 'orange'
    }
  ];

  const tips: Tip[] = [
    {
      tag: "Mindfulness",
      title: "La Regla de las 24 Horas",
      text: "Antes de comprar algo no planeado, espera un día completo. El 80% de las veces te darás cuenta de que no era esencial.",
      icon: "timer",
      emotion: "La calma ahorra más que cualquier cupón.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX_LDrHVOk0xrrEYX1w8jlM6v5fy48IJmiFSGGds72ISZWX3c8msrm-rHXbLOgu0f-a5qcOc-UAEfvLSuaL8tJU9hMPO1qC8I2XhBj0yugGr0Y1mbJQ6HPj_35nVwfDK3wzyknzfprF-_JN1rrKXK1whnO-UfBn2jjHMyh2zx9LGcEaJnJaXIZKSrN3zrnOrKdNclPFNrWpLzPLCs9arWUs5rVvaDXuBrKNnaZ7nPvP0o6vsN2LTdkGuOMDHXssxe79BGQ2FPYWDU",
    },
    {
      tag: "Simplificar",
      title: "Limpieza de suscripciones",
      text: "Hoy es un buen día para revisar esos $5 o $10 que se van en apps que ya ni recuerdas. Menos ruido, más orden.",
      icon: "delete_sweep",
      emotion: "Tu mente merece ese espacio libre.",
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-5 space-y-8 max-w-lg mx-auto pb-10">
      {/* Resumen Importante */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold tracking-tight dark:text-white flex items-center gap-2">
           <span className="material-symbols-outlined text-primary">analytics</span>
           Resumen del día
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {insights.map(insight => (
            <div key={insight.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm hover:border-primary/30 transition-colors">
              <div className={`size-11 rounded-full flex items-center justify-center ${insight.color === 'purple' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                <span className="material-symbols-outlined text-xl">{insight.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm leading-tight">{insight.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{insight.description}</p>
              </div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </div>
          ))}
        </div>
      </section>

      {/* Dosis de Calma (Píldora de Paz) */}
      <section className="peace-gradient p-7 rounded-[2rem] border border-white/50 dark:border-slate-800 shadow-md relative overflow-hidden group">
        <div className="relative z-10 space-y-3">
           <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs animate-pulse font-variation-fill">auto_awesome</span>
              Dosis de Calma
            </div>
            <p className="text-lg font-bold italic leading-relaxed text-slate-800 dark:text-slate-100">
              "{loadingPill ? "Buscando inspiración..." : peacePill}"
            </p>
        </div>
        <div className="absolute -bottom-6 -right-6 size-24 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all"></div>
      </section>

      {/* Píldoras de Sabiduría (Consejos) */}
      <section className="space-y-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold tracking-tight">Consejos Conscientes</h2>
          <p className="text-xs text-slate-500 font-medium">Hacerlo bien hoy para estar tranquilo mañana.</p>
        </div>

        <div className="space-y-6">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group active:scale-[0.98] transition-all">
              <div className="h-44 bg-cover bg-center grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" style={{backgroundImage: `url("${tip.img}")`}}></div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full tracking-wider">{tip.tag}</span>
                  <div className="size-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-lg">{tip.icon}</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg leading-tight">{tip.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{tip.text}</p>
                <div className="pt-4 flex justify-between items-center border-t border-slate-50 dark:border-slate-700/50 mt-2">
                  <span className="text-[10px] font-bold text-primary/70 italic">{tip.emotion}</span>
                  <button className="text-primary text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
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
