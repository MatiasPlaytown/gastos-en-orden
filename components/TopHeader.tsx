
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface TopHeaderProps {
  activeTab: string;
}

const TopHeader: React.FC<TopHeaderProps> = ({ activeTab }) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dce3e5] dark:border-slate-800 px-6 lg:px-10 py-4 bg-white dark:bg-background-dark sticky top-0 z-50">
      <div className="flex items-center gap-4 text-[#111618] dark:text-white cursor-pointer" onClick={() => navigate('/')}>
        <div className="size-8 text-primary">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
            <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
          </svg>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] font-display hidden sm:block">Gastos en Orden</h2>
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
