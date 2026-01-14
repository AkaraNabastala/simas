import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Tambahkan ini
import { Bell, Search, Menu, User, LogOut, ChevronDown, Settings } from 'lucide-react';

const Header = ({ setOpen, user }) => { // Hapus handleLogout dari props
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // Inisialisasi navigasi di sini

  // FUNGSI LOGOUT UNIVERSAL
  const internalLogout = () => {
    localStorage.clear();
    navigate('/'); // Langsung arahkan ke login
  };

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
      <div className="flex items-center gap-4">
        <button onClick={() => setOpen(true)} className="lg:hidden p-2.5 text-slate-700 bg-slate-50 rounded-xl">
          <Menu size={22} />
        </button>
        
        <div className="hidden sm:flex items-center bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 focus-within:border-blue-500 transition-all w-72">
          <Search size={16} className="text-slate-500" />
          <input type="text" placeholder="Cari data..." className="bg-transparent border-none outline-none ml-3 text-[12px] w-full font-bold text-slate-800" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 hidden md:block mx-2"></div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-2xl transition-all"
          >
            <div className="text-right hidden md:block">
              <p className="text-[12px] font-black text-slate-900 leading-none uppercase">{user?.full_name || 'Admin'}</p>
              <p className="text-[10px] text-blue-700 font-bold uppercase mt-1 tracking-wider">{user?.role || 'User'}</p>
            </div>
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center text-white text-[14px] font-black shadow-lg">
               {(user?.full_name || 'A').charAt(0)}
            </div>
            <ChevronDown size={14} className="text-slate-500" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-4 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50">
              {/* Menu Profil */}
              <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-5 py-3 text-[12px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all">
                <User size={16} /> Profil Saya
              </button>
              <button onClick={() => navigate('/account-settings')} className="w-full flex items-center gap-3 px-5 py-3 text-[12px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all">
                <Settings size={16} /> Pengaturan
              </button>
              <div className="h-[1px] bg-slate-100 my-1"></div>
              
              {/* GUNAKAN FUNGSI INTERNAL DI SINI */}
              <button 
                onClick={internalLogout} 
                className="w-full flex items-center gap-3 px-5 py-3 text-[12px] font-black text-red-600 hover:bg-red-50 transition-all"
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