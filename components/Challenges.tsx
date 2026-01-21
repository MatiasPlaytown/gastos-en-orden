
import React from 'react';
import { Challenge } from '../types';

const Challenges: React.FC = () => {
  const challenges: Challenge[] = [
    {
      title: "Revisa tus suscripciones",
      time: "5 min",
      desc: "Busca servicios de streaming o apps que ya no uses y que no te aporten alegría.",
      quote: "Tu 'yo' del futuro te agradecerá este pequeño momento de orden.",
      icon: "tv",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAm2a5AjL__Lrtz9k4GsqrL6mQeHyF8koNWTUCNEiEHasyLw96s_R2rQYW1tBAQ3CxbcoX0JOm3W8DAsIAHCJBt62nzOBXIrmA0IFzc_FqOVP-V4BOMQF6WJkL30GPfwFpDypCBUxZ6a9dq8v3yRgFlubJjP93RkWVDRJ1iWRB9wIog1GPgOGVmPS23ubFjlddz_m_01o8vc8thK5Y5DylpHwVIXvzHuHycSGwjpZjTJu2PGMqUaFqruPua6vN8JklPmu5sFLdKsXY"
    },
    {
      title: "Café en casa",
      time: "2 min",
      desc: "Disfruta del ritual de preparar tu propia bebida favorita hoy.",
      quote: "Saborea el momento, cuida tus ahorros.",
      icon: "coffee",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAus0S8e6RyFq6uXjjbw76tVqVtwQ0BEdxO32HHxcHEAv5h0pJumRvTt5ZcsXqpaAZJrfT6KUBzj6XSIlL5SP779j1WXNckH1z2EGR1AFSaMCF7QkYZY4uwmHqYmD-OLZUVwsqHEPcIzoG9zXFeXyToCeuSD6jEde1gxRW_-T9ZmToKtySlJ1w9BUVdZsVy9YoGTw3WzNOrma8TxoAIMUNK8_0KqESjPpDs_DyR5Dc6IjGTqGLI1W6bhf8ZKrmqTM0hBX5oQ-XxJzs"
    },
    {
      title: "Limpieza digital",
      time: "10 min",
      desc: "Cancela la suscripción a 3 correos de publicidad que te tientan a comprar.",
      quote: "Silencia el ruido, encuentra tu equilibrio.",
      icon: "receipt_long",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2Fbak2xrSX1ngvDubz56v1Z6m1tNISKuzg2uuuemuNWnHNthz7b0IRrXe7P38QJSfwzPAxKBc1HO_SX7c__0FRk-v5WV9vIu3nLl6rns8GzrGcHLItYakbZdY1wP7-wegQEYlxQDzICbXm2FjB8Ys582neZO3c4QOf9jtZ1oKz7RbtdGtPcno8s4jNe0ysxp6nCs_EjapNFWEBAzsTTaawZ3T6zsOx06SU1C5acaCtU1FztEm-kG3WOlSvm3xLatCW1qiQ6pMYOU"
    }
  ];

  return (
    <div className="animate-in fade-in duration-500 p-6 space-y-8 max-w-lg mx-auto">
      <header>
        <h2 className="text-2xl font-black tracking-tight">Mini Retos</h2>
        <p className="text-sm text-slate-500">Pequeñas victorias que alimentan tu libertad financiera.</p>
      </header>

      {/* Progreso General */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase tracking-widest text-primary">Progreso Semanal</span>
          <span className="text-sm font-bold">2 / 5 Retos</span>
        </div>
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-2/5 rounded-full"></div>
        </div>
        <p className="text-xs text-slate-400 italic">"Paso a paso, el camino se hace corto."</p>
      </section>

      {/* Grid de Retos */}
      <section className="space-y-6">
        {challenges.map((c, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group active:scale-[0.98] transition-all">
            <div className="relative h-44">
              <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url("${c.img}")`}}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur text-[10px] font-black uppercase rounded-full text-slate-800">
                {c.time}
              </span>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-bold text-lg leading-tight">{c.title}</h3>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{c.desc}</p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-bold text-primary italic">"{c.quote}"</span>
                <button className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl active:scale-95 transition-transform">
                  Aceptar Reto
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Challenges;
