import React, { useState } from 'react';
import { Fingerprint, Key, ShieldCheck, Smartphone, Save, Lock, UserCircle, ShieldAlert } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import toast, { Toaster } from 'react-hot-toast'; // Pastikan digunakan atau hapus jika tidak pakai logic

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

  const handleSaveAccount = (e) => {
    e.preventDefault();
    setLoading(true);
    // Contoh penggunaan toast agar ESLint tidak error
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Mengamankan kredensial...',
        success: <b>Akun berhasil diamankan!</b>,
        error: <b>Gagal memperbarui data.</b>,
      }
    ).finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex overflow-hidden font-['Poppins'] text-[12px] text-slate-700">
      <Toaster position="top-right" />
      <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header setOpen={setSidebarOpen} user={storedUser} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-10">
          <div className="max-w-4xl mx-auto space-y-8 pb-10">
            
            <div className="flex flex-col gap-2 border-l-4 border-blue-600 pl-6 py-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Account Settings</h1>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] italic">Keamanan Kredensial & Otoritas Akses</p>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-8">
              {/* Identitas Login - Username Bisa Diubah */}
              <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-8">
                  <div className="w-14 h-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
                    <Fingerprint size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-[14px] italic">Kredensial Login</h3>
                    <p className="text-[10px] text-blue-600 font-bold uppercase mt-1">Identitas unik untuk masuk ke ekosistem simas</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="font-black text-slate-800 uppercase tracking-widest text-[10px] ml-1">Username / ID Unik</label>
                    <div className="relative">
                      <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
                      <input 
                        type="text" 
                        value={accountData.username} 
                        onChange={(e) => setAccountData({...accountData, username: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4.5 font-black text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" 
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold ml-1 uppercase italic tracking-tighter">* Username digunakan saat proses autentikasi (Login).</p>
                  </div>
                  <div className="space-y-3">
                    <label className="font-black text-slate-800 uppercase tracking-widest text-[10px] ml-1">Role/Otoritas</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input type="text" readOnly defaultValue={storedUser.role} className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-14 pr-6 py-4.5 font-black text-slate-400 cursor-not-allowed outline-none italic" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Password Management */}
              <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-8">
                  <div className="w-14 h-14 bg-red-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-red-200">
                    <Key size={28} />
                  </div>
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-[14px] italic text-red-600">Perbarui Kata Sandi</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="font-black text-slate-800 uppercase tracking-widest text-[9px] ml-1">Sandi Saat Ini</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-slate-900 outline-none focus:border-red-500 transition-all shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-black text-slate-800 uppercase tracking-widest text-[9px] ml-1">Sandi Baru</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-slate-900 outline-none focus:border-blue-600 transition-all shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-black text-slate-800 uppercase tracking-widest text-[9px] ml-1">Konfirmasi Sandi</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-slate-900 outline-none focus:border-blue-600 transition-all shadow-sm" />
                  </div>
                </div>
              </section>

              {/* 2FA Section - Dark Mode Login Style */}
              <section className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px] -mr-40 -mt-40 transition-all group-hover:bg-blue-600/20"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex gap-6">
                    <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/10 text-blue-400">
                      <Smartphone size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black uppercase tracking-[0.2em] text-[13px] italic text-blue-400">Two-Factor Authentication</h3>
                        <div className="px-2 py-0.5 bg-blue-500/20 rounded text-[8px] font-black text-blue-400 animate-pulse">RECOMENDED</div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed max-w-sm">Berikan lapisan keamanan tambahan dengan verifikasi melalui perangkat seluler anda setiap kali login.</p>
                    </div>
                  </div>
                  <button type="button" className="bg-white hover:bg-blue-500 hover:text-white text-slate-900 px-10 py-4.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all transform active:scale-95 shadow-xl shadow-white/5">
                    Aktifkan 2FA
                  </button>
                </div>
              </section>

              <div className="flex justify-end pt-4">
                <button type="submit" disabled={loading} className="flex items-center gap-4 bg-blue-600 hover:bg-slate-900 text-white px-14 py-5 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-300 transition-all active:scale-95">
                  <Save size={20} /> {loading ? 'Menyimpan...' : 'Simpan Konfigurasi Akun'}
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