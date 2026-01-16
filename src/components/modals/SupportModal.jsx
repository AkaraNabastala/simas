import React, { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

const SupportModal = ({ onClose }) => {
  const [form, setForm] = useState({ sekolah: '', keluhan: '' });

  const handleWhatsApp = () => {
    const text = `Halo Developer SI-MAS,\n\nAsal Sekolah: ${form.sekolah}\nKeluhan: ${form.keluhan}`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative p-8">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900"><X size={20} /></button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <MessageCircle size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">Support SI-MAS</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Laporkan kendala sistem</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">Asal Sekolah</label>
            <input 
              type="text" 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 transition-all font-bold text-slate-700 outline-none"
              placeholder="Contoh: SMA Negeri 1..."
              onChange={(e) => setForm({...form, sekolah: e.target.value})}
            />
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">Keluhan / Pesan</label>
            <textarea 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 transition-all font-bold text-slate-700 outline-none min-h-[120px]"
              placeholder="Jelaskan masalah Anda..."
              onChange={(e) => setForm({...form, keluhan: e.target.value})}
            />
          </div>
          <button 
            onClick={handleWhatsApp}
            className="w-full p-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
          >
            Kirim ke WhatsApp <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;