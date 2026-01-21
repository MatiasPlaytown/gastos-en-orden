
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface TopHeaderProps {
  activeTab: string;
}

const TopHeader: React.FC<TopHeaderProps> = ({ activeTab }) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dce3e5] dark:border-slate-800 px-6 lg:px-10 py-4 bg-white dark:bg-background-dark sticky top-0 z-50">
      <div className="flex items-center text-[#111618] dark:text-white cursor-pointer" onClick={() => navigate('/')}>
        <img 
          src="https://ptown-wap-ar.s3.sa-east-1.amazonaws.com/gastos-en-orden/gastos-logo.png" 
          alt="Logo" 
          className="h-11 w-auto object-contain"
        />
      </div>
      <div className="flex flex-1 justify-end gap-4 sm:gap-8">
        <nav className="hidden md:flex items-center gap-9">
          <Link className={`text-sm font-medium leading-normal hover:text-primary transition-colors ${activeTab === 'dashboard' || activeTab === '' ? 'text-primary' : ''}`} to="/">Resumen</Link>
          <Link className={`text-sm font-medium leading-normal hover:text-primary transition-colors ${activeTab === 'tips' ? 'text-primary' : ''}`} to="/tips">Consejos</Link>
          <Link className={`text-sm font-medium leading-normal hover:text-primary transition-colors ${activeTab === 'challenges' ? 'text-primary' : ''}`} to="/challenges">Desafíos</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-[#637f88] dark:text-slate-400 hover:text-primary transition-colors">notifications</button>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20 shadow-sm" style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCVGKZxqWrP6r_WuMOa1LtzDbQSJYriU-Rnis0oUxzMsQsaGgvTsQSGIOV9iex1XBmEoRzg9zIO84RVWtvlIvTbknk3a-V7pVPaNMkMNAJJ5PCCt7pV_UF-jUTp0F2xXl09QpGjnp0jvNQ6O8Y8XKyYBcY6IyqFq7mqqsQamJTuhhIeVFDUehwdmtDXeBJdqEk1b6g2u80FAlYvKDedsUPPhbLoD_4zbZmA7-Si5FkYyUL5cbN9OAAu_v1IUsKfQCM1WK66OEHgkDk")`}}></div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
