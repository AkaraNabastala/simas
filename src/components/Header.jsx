import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, User, LogOut, ChevronDown, Settings } from 'lucide-react';

const Header = ({ setOpen, user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const internalLogout = () => {
    // Gunakan removeItem jika ingin lebih spesifik, atau clear untuk semua
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    setShowDropdown(false);
    navigate('/', { replace: true }); // 'replace' mencegah user klik 'back' ke dashboard
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40 font-['Poppins']">
      
      {/* BAGIAN KIRI: Menu & Search */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setOpen(true)} 
          className="lg:hidden p-2.5 text-slate-700 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Buka Menu"
        >
          <Menu size={22} />
        </button>
        
        {/* PERBAIKAN AKSESIBILITAS: Menambahkan Label dan ID */}
        <div className="hidden sm:flex items-center bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all w-72">
          <label htmlFor="topbar-search" className="sr-only">Cari data</label>
          <Search size={16} className="text-slate-400" />
          <input 
            id="topbar-search"
            name="search"
            type="text" 
            placeholder="Cari data..." 
            className="bg-transparent border-none outline-none ml-3 text-[13px] w-full font-medium text-slate-800 placeholder:text-slate-400" 
          />
        </div>
      </div>

      {/* BAGIAN KANAN: Notifikasi & Profil */}
      <div className="flex items-center gap-3">
        <button 
          className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all group"
          aria-label="Notifikasi"
        >
          <Bell size={20} className="group-hover:scale-110 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 hidden md:block mx-1"></div>

        {/* PROFIL DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center gap-3 p-1.5 rounded-2xl transition-all ${showDropdown ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
            aria-haspopup="true"
            aria-expanded={showDropdown}
          >
            <div className="text-right hidden md:block">
              <p className="text-[12px] font-bold text-slate-900 leading-tight">
                {user?.full_name || 'Administrator'}
              </p>
              <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">
                {user?.role || 'Guest'}
              </p>
            </div>
            
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white text-[14px] font-bold shadow-md shadow-blue-100 uppercase">
               {(user?.full_name || 'A').substring(0, 1)}
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* MENU DROPDOWN */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 py-2 z-50 animate-in fade-in zoom-in duration-150">
              <div className="px-5 py-2 border-b border-slate-50 mb-1 md:hidden">
                <p className="text-[12px] font-bold text-slate-900">{user?.full_name}</p>
                <p className="text-[10px] text-blue-600 uppercase">{user?.role}</p>
              </div>

              <button 
                onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
              >
                <User size={16} /> Profil Saya
              </button>
              
              <button 
                onClick={() => { navigate('/account-settings'); setShowDropdown(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
              >
                <Settings size={16} /> Pengaturan
              </button>

              <div className="h-[1px] bg-slate-100 my-1 mx-4"></div>
              
              <button 
                onClick={internalLogout} 
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;