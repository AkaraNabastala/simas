import React from 'react';
import { LayoutDashboard, Users, GraduationCap, BookOpen, Settings, X, ChevronRight } from 'lucide-react';
import logoSmk from '../assets/logo_smk.png';

const Sidebar = ({ isOpen, setOpen, activePage = 'Dashboard' }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Siswa', icon: <Users size={18} /> },
    { name: 'Guru', icon: <GraduationCap size={18} /> },
    { name: 'Pelajaran', icon: <BookOpen size={18} /> },
    { name: 'Pengaturan', icon: <Settings size={18} /> },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-all duration-300 transform 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
      
      <div className="h-full flex flex-col">
        {/* Header Sidebar dengan Tombol Close (Mobile) */}
        <div className="p-5 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <img src={logoSmk} alt="Logo" className="h-8 w-auto" />
            <span className="font-bold text-lg text-blue-600 tracking-tighter">SIMAS</span>
          </div>
          {/* Tombol X hanya muncul di mobile */}
          <button onClick={() => setOpen(false)} className="lg:hidden p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                activePage === item.name 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {activePage === item.name && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;