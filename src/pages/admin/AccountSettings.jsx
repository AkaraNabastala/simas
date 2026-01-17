import axios from 'axios';
import React, { useState } from 'react';
import { Fingerprint, Key, ShieldCheck, Smartphone, Save, UserCircle } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import toast, { Toaster } from 'react-hot-toast';

const AccountSettings = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem('user')) || { full_name: 'User', username: 'admin', role: 'Admin' };
  const [accountData, setAccountData] = useState({
    username: storedUser.username || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    if (accountData.newPassword && accountData.newPassword !== accountData.confirmPassword) {
      return toast.error("Konfirmasi sandi baru tidak cocok!");
    }
    if (accountData.currentPassword === accountData.newPassword && accountData.newPassword !== '') {
      return toast.error("Sandi baru tidak boleh sama dengan sandi lama!");
    }

    setLoading(true);
    const loadId = toast.loading('Mengamankan kredensial...');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/users/account/update',
        {
          username: accountData.username,
          currentPassword: accountData.currentPassword,
          newPassword: accountData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Akun berhasil diamankan!', { id: loadId });
        // Reset field password setelah sukses
        setAccountData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));

        // Update username di localStorage jika berubah
        const updatedUser = { ...storedUser, username: accountData.username };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal memperbarui data';
      toast.error(msg, { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex overflow-hidden font-['Poppins'] text-[11px] text-slate-700">
      <Toaster position="top-right" />
      <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header setOpen={setSidebarOpen} user={storedUser} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-4xl mx-auto space-y-4 pb-6">

            {/* Header Section - Lebih Ringkas */}
            <div className="flex flex-col border-l-4 border-blue-600 pl-4 py-1">
              <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Account Settings</h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Keamanan Kredensial & Otoritas</p>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Identitas Login */}
                <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Fingerprint size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] italic">Kredensial Login</h3>
                      <p className="text-[9px] text-blue-600 font-bold uppercase">Identitas Masuk Ekosistem</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-black text-slate-800 uppercase tracking-widest text-[9px] ml-1">Username / ID Unik</label>
                      <div className="relative">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={16} />
                        <input
                          type="text"
                          value={accountData.username}
                          onChange={(e) => setAccountData({...accountData, username: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-black text-slate-800 uppercase tracking-widest text-[9px] ml-1">Role/Otoritas</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" readOnly defaultValue={storedUser.role} className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-bold text-slate-400 cursor-not-allowed outline-none italic" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Password Management */}
                <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-100">
                      <Key size={20} />
                    </div>
                    <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] italic text-red-600">Perbarui Kata Sandi</h3>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Sandi Saat Ini"
                      value={accountData.currentPassword}
                      onChange={(e) => setAccountData({...accountData, currentPassword: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:border-red-500 transition-all text-[10px]"
                    />
                    <input
                      type="password"
                      placeholder="Sandi Baru"
                      value={accountData.newPassword}
                      onChange={(e) => setAccountData({...accountData, newPassword: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:border-red-500 transition-all text-[10px]"
                    />
                    <input
                      type="password"
                      placeholder="Konfirmasi Sandi Baru"
                      value={accountData.confirmPassword}
                      onChange={(e) => setAccountData({...accountData, confirmPassword: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:border-red-500 transition-all text-[10px]"
                    />
                  </div>
                </section>
              </div>

              {/* 2FA Section - Diperkecil */}
              <section className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 rounded-full blur-[50px] -mr-20 -mt-20"></div>
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-blue-400">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black uppercase tracking-wider text-[11px] italic text-blue-400">Two-Factor Auth</h3>
                        <span className="px-1.5 py-0.5 bg-blue-500/20 rounded text-[7px] font-black text-blue-400">RECOMENDED</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-medium uppercase mt-1 leading-tight max-w-xs">Keamanan ekstra dengan verifikasi perangkat.</p>
                    </div>
                  </div>
                  <button type="button" className="w-full sm:w-auto bg-white hover:bg-blue-600 hover:text-white text-slate-900 px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-[9px] transition-all active:scale-95">
                    Aktifkan
                  </button>
                </div>
              </section>

              {/* Action Button - Lebih Proporsional */}
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-200 transition-all active:scale-95">
                  <Save size={16} /> {loading ? 'Memproses...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AccountSettings;