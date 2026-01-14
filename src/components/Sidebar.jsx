import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import navigasi
import { LayoutDashboard, Users, GraduationCap, BookOpen, Settings, X, ChevronRight, LogOut } from 'lucide-react';
import logoSmk from '../assets/logo_smk.png';

const Sidebar = ({ isOpen, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Definisikan menu dengan 'path' yang sesuai di App.js
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { name: 'Siswa', icon: <Users size={18} />, path: '/siswa' },
    { name: 'Guru', icon: <GraduationCap size={18} />, path: '/guru' },
    { name: 'Pelajaran', icon: <BookOpen size={18} />, path: '/pelajaran' },
    { name: 'Pengaturan', icon: <Settings size={18} />, path: '/settings' },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-all duration-300 transform font-['Poppins']
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
      
      <div className="h-full flex flex-col">
        {/* Header Sidebar */}
        <div className="p-5 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <img src={logoSmk} alt="Logo" className="h-8 w-auto" />
            <span className="font-bold text-lg text-blue-600 tracking-tighter">SIMAS</span>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {menuItems.map((item) => {
            // Logika: Jika path di browser sama dengan path menu, maka tombol menjadi biru (aktif)
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path); // Berpindah halaman
                  if (setOpen) setOpen(false); // Tutup sidebar otomatis di mobile
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}
        </nav>

        {/* Footer Sidebar (Tombol Logout) */}
        <div className="p-3 border-t border-slate-100">
          <button 
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;