import React, { useState } from 'react';
import { X, Save, User, Key } from 'lucide-react';

const EditUserModal = ({ isOpen, onClose, onSave, userData }) => {
  const [editData, setEditData] = useState({
    id: userData?.id || '',
    full_name: userData?.full_name || '',
    username: userData?.username || '',
    identity_number: userData?.identity_number || '',
    role: userData?.role || '',
    password: '' 
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-['Poppins']">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-900 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <User size={16} className="text-blue-400" />
            <h3 className="text-[11px] font-black tracking-widest uppercase italic text-white">Edit Pengguna</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white">
            <X size={16} />
          </button>
        </div>

        <form className="p-5 space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(editData); }}>
          <div className="space-y-1.5">
            <label htmlFor="edit-full-name" className="text-[9px] font-black text-slate-400 uppercase ml-1">Nama Lengkap</label>
            <input 
              id="edit-full-name"
              name="full_name"
              autoComplete="name"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
              value={editData.full_name}
              onChange={(e) => setEditData({...editData, full_name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="edit-username" className="text-[9px] font-black text-slate-400 uppercase ml-1">Username</label>
              <input 
                id="edit-username"
                name="username"
                autoComplete="username"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                value={editData.username}
                onChange={(e) => setEditData({...editData, username: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="edit-role" className="text-[9px] font-black text-slate-400 uppercase ml-1">Role</label>
              <select 
                id="edit-role"
                name="role"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-900 outline-none focus:border-blue-600 appearance-none transition-all"
                value={editData.role}
                onChange={(e) => setEditData({...editData, role: e.target.value})}
              >
                <option value="Admin">Admin</option>
                <option value="Guru">Guru</option>
                <option value="Siswa">Siswa</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-identity" className="text-[9px] font-black text-slate-400 uppercase ml-1">NIP / NISN</label>
            <input 
              id="edit-identity"
              name="identity_number"
              autoComplete="off"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[11px] font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
              value={editData.identity_number || ''}
              onChange={(e) => setEditData({...editData, identity_number: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-password" className="text-[9px] font-black text-slate-400 uppercase ml-1">Password Baru (Opsional)</label>
            <div className="relative">
              <Key size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                id="edit-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Kosongkan jika tidak diganti"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-[11px] font-bold text-slate-900 outline-none focus:border-blue-600 transition-all placeholder:text-[9px] placeholder:font-normal"
                value={editData.password}
                onChange={(e) => setEditData({...editData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-slate-900 text-white rounded-xl font-black text-[9px] tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 mt-2">
            <Save size={14} /> Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;