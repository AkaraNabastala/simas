import React, { useState } from 'react'; // useEffect dihapus (ESLint fix)
import { User, Mail, Camera, Save, Briefcase, ShieldCheck, Phone, Info } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [profileData, setProfileData] = useState({
    full_name: storedUser.full_name || '',
    email: storedUser.email || '',
    role: storedUser.role || '',
    phone: storedUser.phone || '',
    bio: storedUser.bio || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadId = toast.loading('Sinkronisasi data aman...');
    
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        full_name: profileData.full_name,
        identity_number: profileData.identity_number || null,
      };

      const response = await axios.put(
        'http://localhost:5000/api/users/profile/update', 
        payload,
        { headers: { Authorization: `Bearer ${token}` } } // Kirim Token ke Backend
      );
      
      if (response.data.success) {
        // Perbarui LocalStorage agar UI (Header/Sidebar) berubah otomatis
        const updatedUser = { ...storedUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setProfileData(prev => ({ ...prev, ...response.data.user }));
        toast.success('Profil berhasil diamankan di database!', { id: loadId });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Server sedang sibuk atau mati';
      toast.error(msg, { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex overflow-hidden font-['Poppins'] text-[12px] text-slate-700">
      <Toaster position="top-right" />
      <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header setOpen={setSidebarOpen} user={profileData} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 bg-[radial-gradient(circle_at_top_right,_#e2e8f0,_transparent_40%)]">
          <div className="max-w-5xl mx-auto space-y-8 pb-10">
            
            {/* Hero Card - Desain Login Style */}
            <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="relative">
                  <div className="w-36 h-36 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl border-4 border-white/10">
                    {profileData.full_name?.charAt(0)}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-3 bg-white text-blue-600 rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-90">
                    <Camera size={20} />
                  </button>
                </div>
                
                <div className="text-center md:text-left">
                  <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
                    <span className="text-blue-400 font-black uppercase tracking-[0.3em] text-[9px]">Personal Identity</span>
                  </div>
                  <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none mb-3">
                    {profileData.full_name}
                  </h1>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] flex items-center justify-center md:justify-start gap-2">
                    <Briefcase size={16} className="text-blue-500" /> {profileData.role} • Level Akses Utama
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-[13px] italic">Informasi Personal</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-black text-slate-800 uppercase tracking-widest text-[10px] ml-1">Nama Lengkap Sesuai Identitas</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" value={profileData.full_name} onChange={(e) => setProfileData({...profileData, full_name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4.5 font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-black text-slate-800 uppercase tracking-widest text-[10px] ml-1">Email Official</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4.5 font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-black text-slate-800 uppercase tracking-widest text-[10px] ml-1">Nomor Telepon/WA</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4.5 font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm" />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center gap-4">
                   <Save size={20} /> {loading ? 'Memproses...' : 'Perbarui Profil Visual'}
                </button>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                  <ShieldCheck size={48} className="mb-6 opacity-30 group-hover:rotate-12 transition-transform duration-500" />
                  <h4 className="font-black uppercase tracking-widest text-[12px] mb-3 italic">Verified Badge</h4>
                  <p className="font-bold text-[11px] leading-relaxed opacity-80 uppercase">Akun ini memiliki otoritas penuh dalam manajemen database sekolah.</p>
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-tighter uppercase">
                       <Info size={14} /> Keamanan Berlapis Aktif
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Profile;