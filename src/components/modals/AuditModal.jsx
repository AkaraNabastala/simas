import React from 'react';
import { X, History, User, Clock, Shield } from 'lucide-react';

const AuditModal = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
              <History size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Riwayat Aktivitas</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Log Audit Sistem</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {data.map((log, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 transition-all flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                <User size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-slate-900 text-[11px] uppercase truncate">{log.username}</span>
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                    <Clock size={10} /> {new Date(log.createdAt).toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  Melakukan aksi <span className="text-blue-600 font-bold">{log.action.replace(/_/g, ' ')}</span>
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[8px] font-black text-slate-500 uppercase">{log.role}</span>
                  <span className="px-2 py-0.5 bg-blue-50 rounded-md text-[8px] font-black text-blue-600 uppercase tracking-tighter italic">IP: {log.ipAddress || 'Internal'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditModal;