
import React from 'react';

interface PerfilProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

const Perfil: React.FC<PerfilProps> = ({ isDarkMode, setIsDarkMode }) => {
  
  const handleResetData = () => {
    if (confirm("¿Estás seguro de que quieres borrar todos tus datos? Esta acción no se puede deshacer.")) {
      alert("Datos borrados. Tu mente (y la app) vuelven a estar en blanco.");
      window.location.reload();
    }
  };

  const handleSwitchUser = () => {
    const user = prompt("Introduce el nuevo nombre de usuario:");
    if (user) {
      alert(`Bienvenido, ${user}. Comencemos de nuevo.`);
      window.location.reload();
    }
  };

  return (
    <div className="animate-in fade-in duration-500 p-6 space-y-8 max-w-lg mx-auto">
      <header className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="size-24 rounded-full bg-primary/20 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVGKZxqWrP6r_WuMOa1LtzDbQSJYriU-Rnis0oUxzMsQsaGgvTsQSGIOV9iex1XBmEoRzg9zIO84RVWtvlIvTbknk3a-V7pVPaNMkMNAJJ5PCCt7pV_UF-jUTp0F2xXl09QpGjnp0jvNQ6O8Y8XKyYBcY6IyqFq7mqqsQamJTuhhIeVFDUehwdmtDXeBJdqEk1b6g2u80FAlYvKDedsUPPhbLoD_4zbZmA7-Si5FkYyUL5cbN9OAAu_v1IUsKfQCM1WK66OEHgkDk" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 size-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>
        <div>
          <h2 className="text-xl font-black">Alex García</h2>
          <p className="text-sm text-slate-500">Explorador de Paz Financiera</p>
        </div>
      </header>

      <section className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Configuración</h3>
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          {/* Toggle Modo Oscuro */}
          <div className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">
                {isDarkMode ? 'dark_mode' : 'light_mode'}
              </span>
              <span className="text-sm font-bold">Modo {isDarkMode ? 'Oscuro' : 'Claro'}</span>
            </div>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-primary' : 'bg-slate-200'}`}
            >
              <div className={`size-4 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {/* Cambiar Usuario */}
          <button 
            onClick={handleSwitchUser}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-50 dark:border-slate-700/50"
          >
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <span className="material-symbols-outlined">switch_account</span>
              <span className="text-sm font-bold">Cambiar Usuario</span>
            </div>
            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
          </button>

          {/* Ayuda y Soporte */}
          <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <span className="material-symbols-outlined">help</span>
              <span className="text-sm font-bold">Ayuda y Soporte</span>
            </div>
            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Privacidad y Datos</h3>
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
           <button 
            onClick={handleResetData}
            className="w-full p-4 flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <span className="material-symbols-outlined">delete_forever</span>
            <span className="text-sm font-bold">Borrar todos mis datos</span>
          </button>
        </div>
      </section>

      <footer className="text-center pt-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Versión 1.2.0 - Mis Gastos en Orden</p>
      </footer>
    </div>
  );
};

export default Perfil;
