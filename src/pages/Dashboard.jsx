import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, TrendingUp, UserCheck, 
  Calendar, Bell, ShieldCheck, Zap 
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || { full_name: 'Admin User', role: 'Administrator' };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const stats = [
    { title: 'Total Siswa', value: '1,240', icon: <Users size={20} />, color: 'bg-blue-600', shadow: 'shadow-blue-200' },
    { title: 'Tenaga Pengajar', value: '86', icon: <UserCheck size={20} />, color: 'bg-indigo-600', shadow: 'shadow-indigo-200' },
    { title: 'Mata Pelajaran', value: '42', icon: <BookOpen size={20} />, color: 'bg-orange-500', shadow: 'shadow-orange-200' },
    { title: 'Kehadiran Hari Ini', value: '98.2%', icon: <TrendingUp size={20} />, color: 'bg-emerald-600', shadow: 'shadow-emerald-200' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden font-['Poppins'] text-[11px] antialiased">
      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header setOpen={setSidebarOpen} user={user} handleLogout={handleLogout} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* WELCOME SECTION */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
                  Dashboard Utama
                </h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-blue-600" />
                  Sistem Kendali Akademik SI-MAS • 2026
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/60 shadow-sm w-fit">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-500">
                  <Calendar size={16} />
                </div>
                <div className="pr-4">
                  <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Hari Ini</p>
                  <p className="text-[11px] font-bold text-slate-700">Kamis, 15 Januari 2026</p>
                </div>
              </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="group bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden">
                  <div className={`w-11 h-11 rounded-2xl text-white ${stat.color} flex items-center justify-center mb-4 shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.15em]">{stat.title}</p>
                  <h3 className="text-xl font-black text-slate-900 mt-1 tracking-tight">{stat.value}</h3>
                  {/* Decorative element */}
                  <div className="absolute -right-2 -bottom-2 opacity-[0.03] text-slate-900 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Activity */}
              <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-6 bg-blue-600 rounded-full" />
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-[12px]">Aktivitas Terkini</h3>
                  </div>
                  <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Lihat Semua</button>
                </div>
                
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-50 rounded-[2rem]">
                  <div className="p-4 bg-slate-50 rounded-full mb-4">
                    <Zap size={24} className="text-slate-300" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 italic">Belum ada aktivitas terekam hari ini.</p>
                </div>
              </div>
              
              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                  <div className="relative z-10">
                    <h3 className="font-black text-[12px] uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Bell size={16} className="text-blue-400" /> Informasi Sistem
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                        <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Status Server</p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                          <p className="text-[11px] font-bold">Optimal (Low Latency)</p>
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                        <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Versi Aplikasi</p>
                        <p className="text-[11px] font-bold">SIMAS CORE v1.0.5</p>
                      </div>
                    </div>
                  </div>
                  {/* Decorative circle */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
                </div>

                <div className="bg-blue-600 rounded-[2.5rem] p-6 text-white flex items-center justify-between shadow-xl shadow-blue-100 group cursor-pointer overflow-hidden relative">
                   <div className="relative z-10">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Butuh Bantuan?</p>
                      <p className="text-[11px] font-bold">Panduan Penggunaan</p>
                   </div>
                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                      <BookOpen size={20} />
                   </div>
                   <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </div>
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;