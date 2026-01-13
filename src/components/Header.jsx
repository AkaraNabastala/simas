import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, User, LogOut, ChevronDown, Settings, Shield } from 'lucide-react';

const Header = ({ setOpen, user, handleLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Menutup dropdown jika klik di luar area
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
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={() => setOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
          <Menu size={20} />
        </button>
        
        {/* Search Bar - Lebih Compact */}
        <div className="hidden sm:flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search size={14} className="text-slate-400" />
          <input type="text" placeholder="Cari data..." className="bg-transparent border-none outline-none ml-2 text-[12px] w-48 font-medium" />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="h-6 w-[1px] bg-slate-200"></div>

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1 hover:bg-slate-50 rounded-xl transition-all"
          >
            <div className="text-right hidden md:block">
              <p className="text-[12px] font-bold text-slate-800 leading-none">{user?.full_name || 'Administrator'}</p>
              <p className="text-[10px] text-blue-600 font-bold uppercase mt-1 tracking-wider">{user?.role || 'Admin'}</p>
            </div>
            <div className="relative">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-100 transition-transform active:scale-95">
                {(user?.full_name || 'A').charAt(0)}
              </div>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* DROPDOWN MENU */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-50 mb-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Menu Akun</p>
              </div>
              
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500 group-hover:text-blue-600"><User size={14} /></div>
                Profil Saya
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500"><Settings size={14} /></div>
                Pengaturan
              </button>

              <div className="h-[1px] bg-slate-100 my-1 mx-2"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors font-bold"
              >
                <div className="p-1.5 bg-red-50 rounded-lg text-red-500"><LogOut size={14} /></div>
                Keluar Aplikasi
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;