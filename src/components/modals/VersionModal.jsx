import React from 'react';
import { X, ShieldCheck, Zap, Globe, Database, Cpu } from 'lucide-react';

const VersionModal = ({ onClose }) => {
  const features = [
    { icon: <ShieldCheck size={16} />, title: "Keamanan Lapisan Ganda", desc: "Enkripsi JWT dan Audit Logging untuk setiap perubahan data." },
    { icon: <Zap size={16} />, title: "Performa Tinggi", desc: "Optimasi query Prisma untuk latensi server yang sangat rendah." },
    { icon: <Database size={16} />, title: "Manajemen Terpusat", desc: "Satu database untuk seluruh data akademik dan kesiswaan." },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Card */}
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col transition-all">
        {/* Header - Dark Style */}
        <div className="bg-slate-900 p-10 text-white relative">
          <div className="relative z-10">
            <p className="text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] mb-2">Build Release</p>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">SI-MAS CORE <span className="text-blue-500">v1.0.5</span></h2>
            <p className="text-slate-400 text-[10px] mt-4 font-bold uppercase tracking-widest flex items-center gap-2">
              <Cpu size={14} /> Powered by Node.js & React 2026
            </p>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl" />
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 space-y-8">
          <div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Globe size={16} className="text-blue-600" /> Tentang SI-MAS
            </h4>
            <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
              SI-MAS (Sistem Informasi Manajemen Sekolah) adalah platform CMS akademik terpadu yang dirancang untuk efisiensi administrasi sekolah. Fokus utama kami adalah transparansi data, kecepatan akses, dan kemudahan bagi tenaga pendidik.
            </p>
          </div>

          <div className="grid gap-4">
            {features.map((item, i) => (
              <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{item.title}</h5>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-400 uppercase leading-none">Status Lisensi</span>
              <span className="text-[10px] font-bold text-emerald-600">Enterprise Verified</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-blue-600 transition-all shadow-lg"
            >
              Tutup Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionModal;