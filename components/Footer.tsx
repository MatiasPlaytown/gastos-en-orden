
import React from 'react';

const Footer: React.FC = () => (
    <footer className="mt-20 py-10 border-t border-[#dce3e5] dark:border-slate-800 text-center px-4">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#637f88] dark:text-slate-500 text-sm">© 2024 Mis Gastos en Orden. La sencillez es la máxima sofisticación.</p>
            <div className="flex gap-6 text-[#637f88] dark:text-slate-500 text-sm">
                <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
                <a href="#" className="hover:text-primary transition-colors">Términos</a>
                <a href="#" className="hover:text-primary transition-colors">Soporte</a>
            </div>
        </div>
    </footer>
);

export default Footer;
