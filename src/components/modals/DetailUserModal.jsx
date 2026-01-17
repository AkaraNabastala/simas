import React from 'react';
import { X, ShieldCheck, Calendar, Hash } from 'lucide-react';

// PINDAHKAN InfoRow ke luar agar tidak menyebabkan error "Cannot create components during render"
const InfoRow = (props) => {
  const { icon: Icon, label, value, colorClass = "text-slate-900" } = props;
  return (
    <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className={`text-[12px] font-bold ${colorClass}`}>{value || '-'}</p>
      </div>
    </div>
  );
};

const DetailUserModal = ({ isOpen, onClose, userData }) => {
  if (!isOpen || !userData) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-['Poppins']">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">

        {/* Header Visual */}
        <div className="relative h-24 bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"
          >
            <X size={18} />
          </button>
          <div className="absolute -bottom-10 left-8">
            <div className={`w-20 h-20 rounded-[2rem] border-4 border-white flex items-center justify-center text-2xl font-black text-white shadow-xl ${
              userData.role === 'Admin' ? 'bg-slate-800' : userData.role === 'Guru' ? 'bg-emerald-600' : 'bg-blue-600'
            }`}>
              {userData.full_name?.charAt(0)}
            </div>
          </div>
        </div>

        <div className="pt-14 px-8 pb-8">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900 uppercase italic leading-none">{userData.full_name}</h3>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-[0.2em] mt-2">ID: {userData.username}</p>
          </div>

          <div className="grid grid-cols-1 gap-1">
            <InfoRow icon={Hash} label="Nomor Identitas (NIP/NISN)" value={userData.identity_number} />

            <InfoRow
              icon={ShieldCheck}
              label="Hak Akses Sistem"
              value={userData.role}
              colorClass={userData.role === 'Admin' ? 'text-red-600' : userData.role === 'Guru' ? 'text-emerald-600' : 'text-blue-600'}
            />

            <InfoRow
              icon={Calendar}
              label="Terdaftar Sejak"
              value={userData.created_at ? new Date(userData.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
              }) : '-'}
            />

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${userData.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Status: {userData.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailUserModal;