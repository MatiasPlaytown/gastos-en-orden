
import React, { useState } from 'react';
import { parseExpense } from '../services/geminiService';

const Registros: React.FC = () => {
  const [expenseInput, setExpenseInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { id: 'var', label: 'Gasto Variable', icon: 'shopping_bag', color: 'bg-blue-500' },
    { id: 'fijo', label: 'Gasto Fijo', icon: 'home', color: 'bg-indigo-500' },
    { id: 'ingreso', label: 'Ingreso', icon: 'payments', color: 'bg-emerald-500' },
    { id: 'ahorro', label: 'Ahorro', icon: 'savings', color: 'bg-amber-500' },
  ];

  const handleQuickAdd = (catId: string) => {
    setActiveCategory(catId);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!expenseInput) return;
    setIsProcessing(true);
    // Lógica para enviar a Gemini y parsear
    await parseExpense(expenseInput);
    setTimeout(() => {
      setIsProcessing(false);
      setExpenseInput("");
      setShowForm(false);
      alert("Registro guardado con éxito. ¡Mente despejada!");
    }, 1000);
  };

  const recentEntries = [
    { title: 'Supermercado', amount: '-$45.00', date: 'Hoy', icon: 'shopping_cart' },
    { title: 'Sueldo', amount: '+$1,200.00', date: 'Ayer', icon: 'work' },
    { title: 'Internet', amount: '-$30.00', date: '2 Mar', icon: 'router' },
  ];

  return (
    <div className="animate-in fade-in duration-500 p-6 space-y-8 max-w-lg mx-auto">
      <header>
        <h2 className="text-2xl font-black tracking-tight">Registros</h2>
        <p className="text-sm text-slate-500">Mantén tus cuentas claras y tu mente en paz.</p>
      </header>

      {/* Botones de Categorías Rápidas */}
      <section className="grid grid-cols-2 gap-4">
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => handleQuickAdd(cat.id)}
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 active:scale-95 transition-all gap-2"
          >
            <div className={`size-12 rounded-2xl ${cat.color} text-white flex items-center justify-center shadow-lg shadow-${cat.color.split('-')[1]}/20`}>
              <span className="material-symbols-outlined">{cat.icon}</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">{cat.label}</span>
          </button>
        ))}
      </section>

      {/* Formulario Inteligente (Solo si está activo) */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[3rem] p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom-20">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl">Nuevo {categories.find(c => c.id === activeCategory)?.label}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-slate-500 italic">Describe tu registro de forma natural (ej: "Ayer gasté $20 en el cine")</p>
              <textarea 
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-primary text-sm min-h-[100px]"
                placeholder="¿Qué quieres registrar hoy?..."
                value={expenseInput}
                onChange={(e) => setExpenseInput(e.target.value)}
                autoFocus
              />
              <button 
                onClick={handleSave}
                disabled={isProcessing || !expenseInput}
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? <span className="animate-spin material-symbols-outlined">sync</span> : 'Guardar Registro'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Historial Reciente */}
      <section className="space-y-4">
        <h3 className="font-bold text-lg">Actividad Reciente</h3>
        <div className="space-y-3">
          {recentEntries.map((entry, i) => (
            <div key={i} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-50 dark:border-slate-800/50">
              <div className="size-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-sm">{entry.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold">{entry.title}</h4>
                <p className="text-[10px] text-slate-400 uppercase font-bold">{entry.date}</p>
              </div>
              <span className={`font-bold text-sm ${entry.amount.startsWith('+') ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`}>
                {entry.amount}
              </span>
            </div>
          ))}
        </div>
        <button className="w-full py-3 text-primary text-xs font-bold uppercase tracking-widest bg-primary/5 rounded-xl">
          Ver historial completo
        </button>
      </section>
    </div>
  );
};

export default Registros;
