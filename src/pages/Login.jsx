import React, { useState } from 'react';
import { User, Lock, School, Loader2, Eye, EyeOff, MapPin } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import logoSmk from '../assets/logo_smk.png';
import gedungImg from '../assets/gedung.jpg';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: form.username,
        password: form.password
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center antialiased">
      <div className="flex w-full min-h-screen overflow-hidden">
        
        {/* SISI KIRI: Form Login */}
        <div className="w-full lg:w-[40%] flex flex-col justify-between px-10 md:px-16 lg:px-14 xl:px-20 py-10 bg-white z-10">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <img src={logoSmk} alt="Logo Sekolah" className="h-12 w-auto object-contain" />
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-600 rounded text-white">
                <School size={18} />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-800 uppercase">Simas</span>
            </div>
          </div>

          {/* Form Section */}
          <div className="max-w-sm w-full mx-auto lg:mx-0">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Selamat Datang</h2>
              <p className="text-sm text-slate-500">Silakan masuk ke akun Anda.</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3 bg-red-50 border-l-2 border-red-500 text-red-700 text-xs font-medium rounded flex items-center gap-2">
                <Lock size={14} />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 ml-1">Username / NISN</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <User size={18} />
                  </span>
                  <input
                    name="username"
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm shadow-sm"
                    placeholder="Masukkan username"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 ml-1">Password</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={18} />
                  </span>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm shadow-sm"
                    placeholder="••••••••"
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl shadow-lg font-semibold text-white transition-all active:scale-[0.98] text-sm ${
                  loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
                }`}
              >
                {loading ? <Loader2 className="animate-spin size-5" /> : 'Masuk'}
              </button>
            </form>
          </div>

          {/* Footer Address */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-start gap-3 text-slate-400">
              <MapPin size={16} className="mt-0.5 flex-shrink-0 text-blue-600" />
              <div className="text-[11px] leading-relaxed">
                <p className="font-bold text-slate-700 uppercase tracking-tight">SMK NEGERI 1 KOTA ANDA</p>
                <p>Jl. Pendidikan No. 123, Kota Pintar, Indonesia</p>
              </div>
            </div>
          </div>
        </div>

        {/* SISI KANAN: Visual Experience */}
        <div className="hidden lg:flex w-[60%] relative items-center justify-center bg-black">
          <div className="absolute inset-0">
            <img src={gedungImg} alt="Gedung" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>

          <div className="relative z-10 p-16 max-w-lg text-white text-center lg:text-left">
            <h1 className="text-4xl font-bold leading-tight mb-4 tracking-tight">
              Membangun Masa Depan <br/>
              <span className="text-blue-500">Pendidikan Digital</span>
            </h1>
            <p className="text-base text-slate-300 font-normal leading-relaxed opacity-90">
              Platform manajemen sekolah terpadu untuk kemudahan kolaborasi akademik dan transparansi data.
            </p>
            
            <div className="mt-8 flex justify-center lg:justify-start gap-4">
               <div className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-[11px] font-medium uppercase tracking-wider">
                 Integrated System
               </div>
               <div className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-[11px] font-medium uppercase tracking-wider">
                 Real-time Data
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;