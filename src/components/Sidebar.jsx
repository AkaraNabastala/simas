import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog ,GraduationCap, BookOpen, Settings, X, ChevronRight, LogOut, School } from 'lucide-react';
import axios from 'axios';
import logoDefault from '../assets/logo_smk.png';

const Sidebar = ({ isOpen, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // 1. Inisialisasi State (Langsung ambil dari localStorage saat pertama kali load)
const [school, setSchool] = useState(() => {
  const cached = localStorage.getItem('school_profile');
  return cached ? JSON.parse(cached) : null;
});

  useEffect(() => {
    // BAGIAN INI DIHAPUS (if cachedProfile { ... }) karena sudah ditangani oleh useState di atas

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/school/profile');
        setSchool(res.data);
        // Update cache agar navigasi berikutnya selalu mendapatkan data terbaru
        localStorage.setItem('school_profile', JSON.stringify(res.data));
      } catch (err) {
        console.error("Gagal memuat logo", err);
      }
    };

    fetchProfile();

    // Listener untuk menangkap perubahan data jika user update profil di halaman lain
    const handleStorageChange = () => {
      const updated = localStorage.getItem('school_profile');
      if (updated) {
        setSchool(JSON.parse(updated));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { name: 'Profil Sekolah', icon: <School size={18} />, path: '/profil-sekolah' },
    { name: 'Management User', icon: <UserCog size={18} />, path: '/management-user' },
    { name: 'Pelajaran', icon: <BookOpen size={18} />, path: '/pelajaran' },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-all duration-300 transform font-['Poppins']
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>

      <div className="h-full flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
          {/* SINKRONISASI LOGO DENGAN BACKEND */}
          <div className="flex items-center gap-3">
            {/* Container Logo dengan ukuran terkontrol */}
            <div className="w-14 h-14 flex items-center justify-center overflow-hidden rounded-lg bg-slate-50">
              <img
                src={school?.schoolLogo ? `http://localhost:5000/uploads/${school.schoolLogo}` : logoDefault}
                alt="Logo Sekolah"
                className="w-full h-full object-contain transition-opacity duration-300"
                key={school?.schoolLogo || 'default'}
                onLoad={(e) => e.target.style.opacity = 1}
              />
            </div>

            <div className="flex flex-col">
              <span className="font-black text-lg text-blue-700 tracking-tighter leading-none uppercase">
                SI-MAS
              </span>
              <span className="text-[12px] font-bold text-slate-600 uppercase tracking-widest mt-1">
                Akademik Sistem
              </span>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl"
            aria-label="Tutup Menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-6">
          <p className="px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Navigasi Utama</p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  navigate(item.path);
                  if (setOpen) setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-[12px] font-bold transition-all ${
                  isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                  : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => { localStorage.clear(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[12px] font-black text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span className="uppercase">Keluar Sistem</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;