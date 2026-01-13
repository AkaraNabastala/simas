import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, TrendingUp, UserCheck } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  // State untuk kontrol Sidebar di Mobile
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || { full_name: 'Admin User', role: 'Administrator' };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const stats = [
    { title: 'Total Siswa', value: '1,240', icon: <Users size={18} />, color: 'bg-blue-600' },
    { title: 'Tenaga Pengajar', value: '86', icon: <UserCheck size={18} />, color: 'bg-emerald-600' },
    { title: 'Mata Pelajaran', value: '42', icon: <BookOpen size={18} />, color: 'bg-orange-600' },
    { title: 'Kehadiran', value: '98%', icon: <TrendingUp size={18} />, color: 'bg-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-['Poppins'] text-sm">
      {/* Overlay untuk menutup sidebar saat klik di luar (Mobile Only) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR - Kirimkan setOpen agar tombol X berfungsi */}
      <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <Header setOpen={setSidebarOpen} user={user} handleLogout={handleLogout} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="mb-2">
              <h1 className="text-xl font-bold text-slate-800">Dashboard Utama</h1>
              <p className="text-[11px] text-slate-400 font-medium">Selamat datang kembali di sistem kendali akademik SIMAS.</p>
            </div>

            {/* STATS GRID - Diatur menjadi 2 kolom di mobile/tablet, 4 di desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
                  <div className={`w-9 h-9 rounded-xl text-white ${stat.color} flex items-center justify-center mb-3 shadow-lg shadow-blue-100`}>
                    {stat.icon}
                  </div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-lg font-bold text-slate-800 mt-0.5">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl p-6 min-h-[300px]">
                <h3 className="font-bold text-slate-800 mb-4">Aktivitas Terkini</h3>
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                  <p className="text-xs italic">Belum ada data aktivitas terbaru untuk ditampilkan.</p>
                </div>
              </div>
              
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6">
                <h3 className="font-bold text-slate-800 mb-4">Informasi Sistem</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Versi Aplikasi</p>
                    <p className="text-xs font-bold text-slate-700">SIMAS PRO v1.0.2</p>
                  </div>
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