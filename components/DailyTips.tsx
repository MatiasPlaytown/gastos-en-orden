
import React, { useState } from 'react';
import { Tip } from '../types';

const DailyTips: React.FC = () => {
  const [tips, setTips] = useState<Tip[]>([
    {
      tag: "Suscripciones",
      title: "Evita la suscripción fantasma",
      text: "Revisa tu estado de cuenta en busca de cargos recurrentes que ya no usas. Cancelar solo uno puede ahorrarte una cantidad importante al año. ¡Es como encontrar dinero olvidado!",
      icon: "sentiment_very_satisfied",
      emotion: "Victoria emocional: ¡Recuperar tu dinero se siente genial!",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtsnh4lHLHPO2xfoP_8vW_ZmmkxjPE9GqcYzguSN7v7vuOVImBxH44bj606CcW87owYA4qT7D0eV12lIYBNJ8eLelU8CRO6lcrXcRp3jKjllOTZHSsaxLtUUdXSQZ2F9CPIfg63nXDCr9sW3_u_mzaUoFd7wcFeVpA9aYh3zTpT84lePUbO_ExcurqkTvjtakLOtBpULJecEm3fn1V4k4BvkdMdku4xL1tBhJD4AoGbNAx0woYIo89QapHD8DZTYWK-7sA7E1DeZk",
      learned: false
    },
    {
      tag: "Seguridad",
      title: "Seguridad financiera diaria",
      text: "Nunca compartas tus claves por correo o SMS. Tu banco nunca te las pedirá así. Proteger tus datos es una de las mejores formas de autocuidado financiero.",
      icon: "lock",
      emotion: "Mantente protegido, mantente en calma.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8J1ddE_qxkOVRt2W8t5ohoo0XujptR4TKcVkXwW4XVWw1I-c3hV5imxN0Zr48GnGc3x0kvVw3DIBnCIZr5ptZ-i4PDLUFqefnzDsRDqjrTrkUIFBq1Aby1uvdCLxPxF1oORF9E1cfG25ApLNC8AwgYi0wbgfMgObPpQaD0lt8R7jjLGDusmvVBajz-9-OpRTeEo_9mOuCbZICyHP0ddQ9wZsh5racuKc04E7XcTOZKqaOBjPIjMU36BtUMOmQ8UIEl0c1oVDjuts",
      learned: false
    },
    {
      tag: "Mindfulness",
      title: "La Regla de las 24 Horas",
      text: "Espera 24 horas antes de realizar una compra importante no planificada. La mayoría de las veces, el impulso pasará y tu billetera te lo agradecerá.",
      icon: "timer",
      emotion: "La paciencia es tu mejor aliada financiera.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX_LDrHVOk0xrrEYX1w8jlM6v5fy48IJmiFSGGds72ISZWX3c8msrm-rHXbLOgu0f-a5qcOc-UAEfvLSuaL8tJU9hMPO1qC8I2XhBj0yugGr0Y1mbJQ6HPj_35nVwfDK3wzyknzfprF-_JN1rrKXK1whnO-UfBn2jjHMyh2zx9LGcEaJnJaXIZKSrN3zrnOrKdNclPFNrWpLzPLCs9arWUs5rVvaDXuBrKNnaZ7nPvP0o6vsN2LTdkGuOMDHXssxe79BGQ2FPYWDU",
      learned: false
    }
  ]);

  const markAsLearned = (idx: number) => {
    const newTips = [...tips];
    newTips[idx].learned = !newTips[idx].learned;
    setTips(newTips);
  };

  const completedCount = tips.filter(t => t.learned).length;

  return (
    <div className="flex flex-col grow animate-in slide-in-from-bottom-4 duration-700">
      <main className="flex flex-1 justify-center py-8 font-jakarta">
        <div className="layout-content-container flex flex-col max-w-[720px] flex-1 px-4">
          <div className="flex flex-wrap justify-between items-end gap-3 p-4 mb-2">
            <div className="flex min-w-72 flex-col gap-2">
              <h1 className="text-[#131811] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Píldoras de Paz</h1>
              <p className="text-[#6f8961] dark:text-gray-400 text-base font-normal">Pequeños hábitos conscientes para dominar tu economía.</p>
            </div>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-white dark:bg-[#2d3a26] border border-[#f2f4f0] dark:border-[#3d4a36] text-[#131811] dark:text-white text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
              Ver Historial
            </button>
          </div>

          <div className="flex flex-col gap-3 p-4 bg-white dark:bg-background-dark/50 rounded-xl mb-6 border border-[#f2f4f0] dark:border-[#2d3a26]">
            <div className="flex gap-6 justify-between items-center">
              <p className="text-[#131811] dark:text-white text-base font-bold leading-normal">Enfoque del Día</p>
              <span className="px-3 py-1 bg-secondary-green/20 text-[#131811] dark:text-secondary-green text-xs font-bold rounded-full">{completedCount}/{tips.length} Aprendidos</span>
            </div>
            <div className="h-3 w-full rounded-full bg-[#dfe6db] dark:bg-[#2d3a26] overflow-hidden">
              <div 
                className="h-full rounded-full bg-secondary-green transition-all duration-700" 
                style={{width: `${(completedCount / tips.length) * 100}%`}}
              ></div>
            </div>
            <p className="text-[#6f8961] dark:text-gray-400 text-sm font-normal leading-normal italic">
              {completedCount === tips.length ? "¡Genial! Has completado tu dosis de sabiduría hoy." : "¡Sigue así! Cada consejo es un paso hacia la libertad."}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {tips.map((tip, idx) => (
              <div key={idx} className="p-0 @container group">
                <div className={`flex flex-col items-stretch justify-start rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] bg-white dark:bg-[#1c2a15] border border-[#f2f4f0] dark:border-[#2d3a26] overflow-hidden transition-all duration-300 ${tip.learned ? 'opacity-70 scale-[0.98]' : 'hover:translate-y-[-4px] hover:shadow-lg'}`}>
                  <div className="w-full h-56 bg-center bg-no-repeat bg-cover relative" style={{backgroundImage: `url("${tip.img}")`}}>
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-full text-xs font-bold text-[#131811] dark:text-white uppercase tracking-wider">{tip.tag}</span>
                    </div>
                    {tip.learned && (
                      <div className="absolute inset-0 bg-secondary-green/20 flex items-center justify-center backdrop-blur-[2px]">
                         <span className="material-symbols-outlined text-secondary-green text-6xl">check_circle</span>
                      </div>
                    )}
                  </div>
                  <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-3 p-6">
                    <h3 className="text-[#131811] dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">{tip.title}</h3>
                    <div className="flex flex-col gap-3">
                      <p className="text-[#6f8961] dark:text-gray-300 text-base font-normal leading-relaxed">{tip.text}</p>
                      <div className="flex items-center gap-2 text-[#4a5c41] dark:text-secondary-green/80 font-medium text-sm">
                        <span className="material-symbols-outlined text-lg">{tip.icon}</span>
                        <span>{tip.emotion}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-[#f2f4f0] dark:border-[#2d3a26] mt-2 flex justify-end">
                      <button 
                        onClick={() => markAsLearned(idx)}
                        className={`flex items-center gap-2 min-w-[140px] cursor-pointer justify-center overflow-hidden rounded-xl h-12 px-6 transition-all active:scale-95 shadow-md ${tip.learned ? 'bg-slate-200 dark:bg-slate-700 text-slate-500' : 'bg-secondary-green text-[#131811] hover:brightness-105 shadow-[0_4px_10px_rgba(91,236,19,0.3)]'} font-extrabold leading-normal`}
                      >
                        <span className="material-symbols-outlined">{tip.learned ? 'undo' : 'check_circle'}</span>
                        <span className="truncate">{tip.learned ? 'Revisar' : 'Entendido'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 mb-20 text-center">
            <div className="inline-flex items-center justify-center size-12 rounded-full bg-secondary-green/20 text-secondary-green mb-4">
              <span className="material-symbols-outlined text-2xl">favorite</span>
            </div>
            <p className="text-[#6f8961] dark:text-gray-400 text-sm font-medium">¡Lo estás haciendo muy bien! El conocimiento es poder para tu paz mental.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DailyTips;
