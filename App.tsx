
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Registros from './components/Registros';
import Challenges from './components/Challenges';
import Perfil from './components/Perfil';
import AICoach from './components/AICoach';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const activeTab = location.pathname.split('/')[1] || '';

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-[#111618] dark:text-white pb-24">
      {/* Header con logo ajustado a dimensiones óptimas (184x36) */}
      <header className="px-6 py-4 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center">
          <img 
            src="https://ptown-wap-ar.s3.sa-east-1.amazonaws.com/gastos-en-orden/gastos-logo.png" 
            alt="Gastos en Orden" 
            style={{ width: '184px', height: '36px' }}
            className="object-contain"
          />
        </div>
        <button 
          onClick={() => setShowCoach(true)}
          className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all"
        >
          <span className="material-symbols-outlined">psychology</span>
        </button>
      </header>
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registros" element={<Registros />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/perfil" element={<Perfil isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        </Routes>
      </main>

      {/* Overlay del Coach IA */}
      {showCoach && <AICoach onClose={() => setShowCoach(false)} />}

      {/* Barra de Navegación Inferior (Tab Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-4 z-50">
        <Link to="/" className={`flex flex-col items-center gap-1 transition-all ${activeTab === '' ? 'text-primary scale-110' : 'text-slate-400'}`}>
          <span className="material-symbols-outlined font-variation-fill">home</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Inicio</span>
        </Link>
        <Link to="/registros" className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'registros' ? 'text-primary scale-110' : 'text-slate-400'}`}>
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Registros</span>
        </Link>
        <Link to="/challenges" className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'challenges' ? 'text-primary scale-110' : 'text-slate-400'}`}>
          <span className="material-symbols-outlined">emoji_events</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Retos</span>
        </Link>
        <Link to="/perfil" className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'perfil' ? 'text-primary scale-110' : 'text-slate-400'}`}>
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Perfil</span>
        </Link>
      </nav>
    </div>
  );
};

export default App;
