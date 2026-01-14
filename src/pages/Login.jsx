import React, { useState, useEffect } from 'react';
import { 
  User, Lock, School, Loader2, Eye, EyeOff, MapPin, 
  Globe, Instagram, Facebook, Youtube, Music2, CheckCircle2, 
  Hash, BookOpen
} from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import logoDefault from '../assets/logo_smk.png';
import gedungDefault from '../assets/gedung.jpg';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [school, setSchool] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/school/profile');
        setSchool(res.data);
      } catch (err) {
        console.error("Gagal memuat profil", err);
      }
    };
    fetchProfile();
  }, []);

  const getSocialIcon = (url) => {
    const link = url.toLowerCase();
    if (link.includes('instagram')) return <Instagram size={18} />;
    if (link.includes('facebook')) return <Facebook size={18} />;
    if (link.includes('youtube')) return <Youtube size={18} />;
    if (link.includes('tiktok')) return <Music2 size={18} />;
    return <Globe size={18} />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadId = toast.loading('Memverifikasi...');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', form);
      if (response.data.success) {
        toast.success(`Selamat Datang, ${response.data.user.full_name}!`, { id: loadId });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Akses Ditolak.';
      toast.error(msg, { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center antialiased font-['Poppins'] text-[10px]">
      <Toaster position="top-center" />
      
      <div className="flex w-full min-h-screen overflow-hidden">
        
        {/* SISI KIRI: Form Login */}
        <div className="w-full lg:w-[38%] flex flex-col justify-between px-10 md:px-16 lg:px-12 xl:px-20 py-10 bg-white z-10 border-r border-slate-100">
          
          {/* Logo Section */}
          <div className="flex items-center justify-center lg:justify-start gap-4">
            <img src={school?.schoolLogo || logoDefault} alt="Logo" className="h-14 w-auto object-contain" />
            <div className="hidden lg:block h-10 w-[1px] bg-slate-200" />
            <div className="hidden lg:flex flex-col">
              <span className="font-black text-lg tracking-tighter text-blue-600 leading-none uppercase">SI-MAS</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sistem Management Akademik</span>
            </div>
          </div>

          {/* Form Section */}
          <div className="max-w-sm w-full mx-auto lg:mx-0 py-8 lg:py-0">
            <div className="mb-10 text-center lg:text-left">
              {/* MOBILE: Tampilkan Nama Sekolah & Alamat */}
              <div className="lg:hidden mb-10">
                <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter uppercase leading-none">
                  {school?.schoolName || 'NAMA SEKOLAH'}
                </h2>
                <p className="text-[10px] text-slate-500 font-medium italic uppercase tracking-tight">
                  <MapPin size={10} className="inline mr-1" /> {school?.address}
                </p>
              </div>
              
              <h2 className="hidden lg:block text-3xl font-black text-slate-900 mb-2 tracking-tight uppercase italic">Portal Masuk</h2>
              <p className="text-slate-500 font-medium italic text-[11px]">Silakan autentikasi identitas Anda.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="font-black text-slate-700 uppercase tracking-[0.15em] text-[9px] ml-1">Username / NISN</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors"><User size={20}/></span>
                  <input required type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-800 text-[11px]" placeholder="Masukkan ID" onChange={(e) => setForm({...form, username: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-black text-slate-700 uppercase tracking-[0.15em] text-[9px] ml-1">Kata Sandi</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors"><Lock size={20}/></span>
                  <input required type={showPassword ? "text" : "password"} className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-800 text-[11px]" placeholder="••••••••" onChange={(e) => setForm({...form, password: e.target.value})} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">{showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-2xl shadow-blue-200 transition-all active:scale-[0.97] flex items-center justify-center gap-3 tracking-[0.2em] uppercase">
                {loading ? <Loader2 className="animate-spin" /> : 'Buka Akses'}
              </button>
            </form>

            {/* SOSIAL MEDIA: Jarak diperjauh untuk mobile dengan mt-16 */}
            {school?.socialLinks?.length > 0 && (
              <div className="mt-16 lg:mt-8 flex flex-col items-center lg:items-start gap-3">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Ikuti Kami</span>
                <div className="flex gap-2">
                  {school.socialLinks.map((link, i) => (
                    <a key={i} href={link} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      {getSocialIcon(link)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER: Alamat Paling Bawah dengan Jarak pt-12 untuk mobile */}
          <div className="pt-12 lg:pt-8 border-t border-slate-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-2xl"><MapPin size={22} className="text-blue-600" /></div>
              <div className="flex flex-col">
                <p className="font-black text-slate-900 uppercase tracking-tight text-[12px] leading-tight">
                  {school?.schoolName || 'NAMA INSTITUSI'}
                </p>
                <p className="font-medium text-slate-400 leading-tight max-w-[280px] mt-1 italic uppercase text-[10px]">
                  {school?.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SISI KANAN: Visual Experience (Hidden on Mobile) */}
        <div className="hidden lg:flex w-[62%] relative items-end justify-start bg-slate-900 p-20 overflow-hidden">
          <div className="absolute inset-0">
            <img src={school?.buildingPhoto || gedungDefault} alt="Gedung" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
          </div>

          <div className="relative z-10 w-full">
            <div className="flex flex-col gap-8 max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="px-5 py-2 bg-blue-600 text-white rounded-full font-black text-[9px] uppercase tracking-[0.2em]">
                   Sistem Terintegrasi
                </div>
                <div className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-black text-[9px] uppercase tracking-[0.2em]">
                   {school?.schoolStatus || 'NEGERI'} • {school?.level || 'SMA/SMK'}
                </div>
              </div>

              <h1 className="text-6xl font-black text-white leading-none tracking-tighter uppercase italic">
                {school?.schoolName || 'INSTITUSI PENDIDIKAN'}
              </h1>

              <div className="flex flex-wrap items-center gap-10 py-8 px-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] mt-4">
                <div className="flex items-center gap-4">
                   <Hash className="text-blue-400" size={24} />
                   <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">NPSN</p>
                     <p className="text-[14px] font-black text-white">{school?.npsn || '-'}</p>
                   </div>
                </div>
                <div className="w-[1px] h-10 bg-white/10" />
                <div className="flex items-center gap-4">
                   <CheckCircle2 className="text-emerald-400" size={24} />
                   <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Akreditasi</p>
                     <p className="text-[14px] font-black text-white">{school?.accreditation || '-'}</p>
                   </div>
                </div>
                <div className="w-[1px] h-10 bg-white/10" />
                <div className="flex items-center gap-4">
                   <BookOpen className="text-orange-400" size={24} />
                   <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Kurikulum</p>
                     <p className="text-[14px] font-black text-white">{school?.curriculum || '-'}</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;