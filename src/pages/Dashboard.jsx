import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users, BookOpen, TrendingUp, UserCheck,
  Calendar, Bell, ShieldCheck, Zap, History,
  ArrowUpRight, Info, MessageCircle
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Import Modal
import AuditModal from '../components/modals/AuditModal';
import SupportModal from '../components/modals/SupportModal';
import VersionModal from '../components/modals/VersionModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk kontrol Modal
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || { full_name: 'Pengguna', role: 'Staff' };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.warn("Token tidak ditemukan, mengalihkan ke login...");
          return;
        }

        const res = await axios.get('http://localhost:5000/api/school/logs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLogs(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/');
        }
        console.error("Gagal memuat log audit:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [navigate]);

  const stats = [
    { title: 'Total Siswa', value: '1,240', icon: <Users size={20} />, color: 'bg-blue-600', shadow: 'shadow-blue-200' },
    { title: 'Tenaga Pengajar', value: '86', icon: <UserCheck size={20} />, color: 'bg-indigo-600', shadow: 'shadow-indigo-200' },
    { title: 'Mata Pelajaran', value: '42', icon: <BookOpen size={20} />, color: 'bg-orange-500', shadow: 'shadow-orange-200' },
    { title: 'Kehadiran', value: '98.2%', icon: <TrendingUp size={20} />, color: 'bg-emerald-600', shadow: 'shadow-emerald-200' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden font-['Poppins'] text-[11px] antialiased">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header setOpen={setSidebarOpen} user={user} handleLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
          {/* MENGGUNAKAN isLoading: Menampilkan bar progress kecil di atas saat loading */}
          {isLoading && (
            <div className="fixed top-0 left-0 right-0 h-1 bg-blue-600/20 z-[100]">
              <div className="h-full bg-blue-600 animate-[loading_2s_ease-in-out_infinite] w-1/3"></div>
            </div>
          )}

          <div className="max-w-7xl mx-auto space-y-8">

            {/* WELCOME SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight">Dashboard Utama</h1>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-blue-600" /> SI-MAS KENDALI AKADEMIK
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/60 shadow-sm w-fit">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-500"><Calendar size={16} /></div>
                <div className="pr-4">
                   <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Tahun Ajaran</p>
                   <p className="text-[10px] font-bold text-slate-700">2025/2026</p>
                </div>
              </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl relative overflow-hidden">
                  <div className={`w-10 h-10 rounded-2xl text-white ${stat.color} flex items-center justify-center mb-4 shadow-lg ${stat.shadow}`}>{stat.icon}</div>
                  <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest">{stat.title}</p>
                  <h3 className="text-lg font-black text-slate-900 mt-1">{stat.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* AREA KIRI: GRAFIK */}
              <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                <div className="absolute top-8 left-8 flex items-center gap-3">
                  <div className="w-2 h-6 bg-indigo-600 rounded-full" />
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-[12px]">Grafik Keberangkatan</h3>
                </div>
                <div className="flex flex-col items-center opacity-20">
                   <TrendingUp size={48} className="text-slate-400 mb-4" />
                   <p className="font-bold italic">Area Visualisasi Data Keberangkatan</p>
                </div>
              </div>

              {/* AREA KANAN: INFORMASI & INTERAKSI */}
              <div className="space-y-6">

                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                  <div className="relative z-10">
                    <h3 className="font-black text-[12px] uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Bell size={16} className="text-blue-400" /> Informasi Sistem
                    </h3>

                    <div className="space-y-4">
                      {/* Trigger AuditModal */}
                      <button
                        onClick={() => setShowAuditModal(true)}
                        className="w-full text-left p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Update Terakhir</p>
                          <History size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {logs[0] ? (
                          <>
                            <p className="text-[10px] font-bold truncate uppercase">{logs[0].action.replace(/_/g, ' ')}</p>
                            <p className="text-[8px] text-slate-500 uppercase font-black">Oleh: {logs[0].username}</p>
                          </>
                        ) : (
                          <p className="text-[10px] opacity-50 italic font-bold">Menunggu data...</p>
                        )}
                      </button>

                      {/* Trigger VersionModal */}
                      <button
                        onClick={() => setShowVersionModal(true)}
                        className="w-full text-left p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-between"
                      >
                        <div>
                          <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Versi Aplikasi</p>
                          <p className="text-[11px] font-bold italic uppercase tracking-tighter">SIMAS CORE v1.0.5</p>
                        </div>
                        <Info size={16} className="text-slate-500" />
                      </button>

                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                         <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                         <p className="text-[10px] font-bold uppercase tracking-widest">Server Optimal</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
                </div>

                {/* Trigger SupportModal */}
                <div
                  onClick={() => setShowSupportModal(true)}
                  className="bg-blue-600 rounded-[2.5rem] p-6 text-white flex items-center justify-between shadow-xl shadow-blue-100 group cursor-pointer overflow-hidden relative active:scale-95 transition-all"
                >
                   <div className="relative z-10">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-1">Butuh Bantuan Developer?</p>
                      <p className="text-[11px] font-bold">Hubungi Support SI-MAS</p>
                   </div>
                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center relative z-10 group-hover:rotate-12 transition-transform">
                      <MessageCircle size={20} />
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>

              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* RENDER MODAL: Memperbaiki error ESLint unused variables */}
      {showAuditModal && <AuditModal data={logs} onClose={() => setShowAuditModal(false)} />}
      {showSupportModal && <SupportModal onClose={() => setShowSupportModal(false)} />}
      {showVersionModal && <VersionModal onClose={() => setShowVersionModal(false)} />}

    </div>
  );
};

export default Dashboard;