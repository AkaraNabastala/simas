import React from 'react';
import { FileText, AlertTriangle, X, CheckCircle2 } from 'lucide-react';

const ImportModal = ({ isOpen, onClose, onConfirm, fileName, dataCount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 font-['Poppins']">
        <div className="p-7">
          <div className="flex justify-between items-start mb-5">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <FileText size={24} />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Ukuran Judul: 14px */}
          <h3 className="text-sm font-black text-slate-900 uppercase italic mb-2 tracking-tight">
            Konfirmasi Import CSV
          </h3>
          
          {/* Ukuran Deskripsi: 12px */}
          <p className="text-xs text-slate-500 font-bold leading-relaxed mb-6">
            File: <span className="text-blue-600 font-black">"{fileName}"</span><br/>
            Total Data: <span className="text-slate-900 font-black">{dataCount} baris terdeteksi</span>.
          </p>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex gap-3">
            <AlertTriangle className="text-amber-500 shrink-0" size={18} />
            {/* Ukuran Warning: 10px (sedikit lebih kecil agar proporsional) */}
            <p className="text-[10px] text-amber-700 font-black uppercase leading-normal">
              Pastikan format kolom (Nama, Username, Identitas, Role) sudah sesuai dengan template.
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="flex-1 py-3.5 rounded-2xl font-black uppercase text-[11px] text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
            >
              Batal
            </button>
            <button 
              onClick={onConfirm} 
              className="flex-1 py-3.5 rounded-2xl font-black uppercase text-[11px] text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <CheckCircle2 size={14} /> Proses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;