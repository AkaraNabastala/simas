import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Save, Building2, Image as ImageIcon, Mail, Phone, Upload, 
  User, Globe, Landmark, School, Trash2, Plus, Instagram, 
  Facebook, Youtube, Music2, Link as LinkIcon, Fingerprint, 
  Calendar, ShieldCheck, Camera
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Settings = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // State Form Lengkap - Variabel Tetap Sesuai Keinginan Anda
  const [formData, setFormData] = useState({
    namaSekolah: '',
    npsn: '',
    statusSekolah: 'Negeri',
    jenjang: 'SMA',
    kepalaSekolah: '',
    nipKepala: '',
    akreditasi: 'Terakreditasi A',
    kurikulum: '',
    tahunBerdiri: 2000,
    skIzin: '',
    email: '',
    telepon: '',
    alamat: '',
    socialLinks: [] // Inisialisasi array kosong agar tidak eror .map()
  });

  const [previews, setPreviews] = useState({ sekolah: null, yayasan: null, gedung: null });
  const [currentLink, setCurrentLink] = useState('');

  // 1. Fetch Data dari Database (Dengan Mapping ke variabel lokal)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/school/profile');
        if (res.data) {
          const db = res.data;
          // Memasukkan data DB ke variabel asli Anda
          setFormData({
            namaSekolah: db.schoolName || '',
            npsn: db.npsn || '',
            statusSekolah: db.schoolStatus || 'Negeri',
            jenjang: db.level || 'SMA',
            kepalaSekolah: db.principalName || '',
            nipKepala: db.principalNip || '',
            akreditasi: db.accreditation || 'Terakreditasi A',
            kurikulum: db.curriculum || '',
            tahunBerdiri: db.establishedYear || 2000,
            skIzin: db.licenseNumber || '',
            email: db.email || '',
            telepon: db.phone || '',
            alamat: db.address || '',
            socialLinks: db.socialLinks || []
          });
        }
      } catch (err) {
        console.error("Gagal mengambil data", err);
      }
    };
    fetchData();
  }, []);

  // 2. Fungsi Simpan ke Database (Mapping variabel lokal ke field DB)
    const handleSave = async () => {
    setLoading(true);
    const loadId = toast.loading('Menyimpan data ke PostgreSQL...');
    
    // Mapping data agar sesuai dengan model SchoolProfile di Prisma
    const dataToSave = {
      schoolName: formData.namaSekolah,
      npsn: formData.npsn,
      schoolStatus: formData.statusSekolah,
      level: formData.jenjang,
      principalName: formData.kepalaSekolah,
      principalNip: formData.nipKepala,
      accreditation: formData.akreditasi,
      curriculum: formData.kurikulum,
      establishedYear: parseInt(formData.tahunBerdiri),
      licenseNumber: formData.skIzin,
      email: formData.email,
      phone: formData.telepon,
      address: formData.alamat,
      socialLinks: formData.socialLinks
    };

    try {
        const response = await axios.put('http://localhost:5000/api/school/update', dataToSave);
        
        if (response.status === 200) {
        toast.success('Data berhasil disimpan ke database!', { id: loadId });
        }
    } catch (err) {
        console.error(err);
        toast.error('Gagal terhubung ke server database', { id: loadId });
    } finally {
        setLoading(false);
    }
    };

  const getIcon = (url) => {
    const link = url.toLowerCase();
    if (link.includes('instagram')) return <Instagram size={14} className="text-pink-600" />;
    if (link.includes('facebook')) return <Facebook size={14} className="text-blue-700" />;
    if (link.includes('youtube')) return <Youtube size={14} className="text-red-600" />;
    if (link.includes('tiktok')) return <Music2 size={14} className="text-slate-900" />;
    return <LinkIcon size={14} className="text-slate-500" />;
  };

  const handleImage = (e, key) => {
    const file = e.target.files[0];
    if (file) setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  const user = JSON.parse(localStorage.getItem('user')) || { full_name: 'Admin User', role: 'Administrator' };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex overflow-hidden font-['Poppins'] text-[12px] text-slate-700">
      <Toaster position="top-right" reverseOrder={false} />
      <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <Header setOpen={setSidebarOpen} user={user} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-10">
          <div className="max-w-6xl mx-auto space-y-6 pb-10">
            
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 shrink-0">
                  <School size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">Profil Satuan Pendidikan</h1>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sistem Management Sekolah</p>
                </div>
              </div>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-blue-100 active:scale-95"
              >
                <Save size={18} /> {loading ? 'Memproses...' : 'Simpan Perubahan'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-4 space-y-8">
                <section className="bg-white p-7 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
                    <ImageIcon size={16} className="text-blue-600" /> Identitas Visual
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3 text-center">
                      <div className="relative aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-[2rem] flex items-center justify-center overflow-hidden group">
                        {previews.sekolah ? <img src={previews.sekolah} className="w-full h-full object-contain p-3" /> : <Building2 size={30} className="text-slate-300" />}
                        <label className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center transition-all"><Upload className="text-blue-700" /><input type="file" className="hidden" onChange={(e) => handleImage(e, 'sekolah')} /></label>
                      </div>
                      <span className="text-[9px] font-black text-slate-800 uppercase">Logo Sekolah</span>
                    </div>
                    <div className="space-y-3 text-center">
                      <div className="relative aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-[2rem] flex items-center justify-center overflow-hidden group">
                        {previews.yayasan ? <img src={previews.yayasan} className="w-full h-full object-contain p-3" /> : <Landmark size={30} className="text-slate-300" />}
                        <label className="absolute inset-0 bg-slate-800/20 opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center transition-all"><Upload className="text-slate-800" /><input type="file" className="hidden" onChange={(e) => handleImage(e, 'yayasan')} /></label>
                      </div>
                      <span className="text-[9px] font-black text-slate-800 uppercase">Logo Yayasan</span>
                    </div>
                  </div>
                </section>

                <section className="bg-white p-7 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col max-h-[450px] overflow-hidden">
                  <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2 shrink-0">
                    <Globe size={16} className="text-blue-600" /> Sosial Media
                  </h3>
                  <div className="flex gap-2 mb-6 shrink-0">
                    <div className="flex-1 min-w-0"> 
                      <input 
                        type="text" 
                        value={currentLink}
                        onChange={(e) => setCurrentLink(e.target.value)}
                        placeholder="Paste link..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none focus:border-blue-500 transition-all placeholder:font-normal placeholder:text-slate-400"
                      />
                    </div>
                    <button 
                      onClick={() => { if(currentLink) { setFormData({...formData, socialLinks: [...formData.socialLinks, currentLink]}); setCurrentLink(''); }}} 
                      className="shrink-0 p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                    {/* Perbaikan: Gunakan opsional chaining atau array fallback */}
                    {(formData.socialLinks || []).map((link, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl">
                        <div className="flex items-center gap-3 overflow-hidden min-w-0">
                          <div className="shrink-0">{getIcon(link)}</div>
                          <span className="font-bold text-[10px] text-slate-700 truncate">{link}</span>
                        </div>
                        <button onClick={() => setFormData({...formData, socialLinks: formData.socialLinks.filter((_, i) => i !== index)})} className="text-slate-300 hover:text-red-500 shrink-0 ml-2"><Trash2 size={14}/></button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-white p-8 lg:p-12 rounded-[3rem] border border-slate-200 shadow-sm space-y-12">
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-3 italic">
                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span> Data Utama Sekolah
                      </h3>
                      <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                        {['SD', 'SMP', 'SMA', 'SMK'].map((j) => (
                          <button key={j} onClick={() => setFormData({...formData, jenjang: j})} className={`px-4 py-1.5 rounded-lg font-black text-[9px] transition-all ${formData.jenjang === j ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{j}</button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="font-black text-slate-800 uppercase tracking-widest text-[9px]">Nama Satuan Pendidikan</label>
                        <input type="text" value={formData.namaSekolah} onChange={(e) => setFormData({...formData, namaSekolah: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="font-black text-slate-800 uppercase tracking-widest text-[9px]">NPSN</label>
                        <input type="text" value={formData.npsn} onChange={(e) => setFormData({...formData, npsn: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="font-black text-slate-800 uppercase tracking-widest text-[9px]">Status</label>
                        <div className="flex p-1.5 bg-slate-100 rounded-2xl gap-2 border border-slate-200">
                          {['Negeri', 'Swasta'].map((s) => (
                            <button key={s} onClick={() => setFormData({...formData, statusSekolah: s})} className={`flex-1 py-3 rounded-xl font-black text-[10px] ${formData.statusSekolah === s ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}>{s}</button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2"><label className="font-black text-slate-800 uppercase tracking-widest text-[9px]">Kepala Sekolah</label><input type="text" value={formData.kepalaSekolah} onChange={(e) => setFormData({...formData, kepalaSekolah: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none" /></div>
                      <div className="space-y-2"><label className="font-black text-slate-800 uppercase tracking-widest text-[9px]">NIP/NIPY</label><input type="text" value={formData.nipKepala} onChange={(e) => setFormData({...formData, nipKepala: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none" /></div>
                    </div>
                  </div>

                  <div className="space-y-8 pt-4 border-t border-slate-50">
                    <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-3 italic">
                        <span className="w-2 h-6 bg-emerald-500 rounded-full"></span> Administrasi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Baris 1: 3 Kolom */}
                        <div className="space-y-2">
                        <label className="font-black text-slate-800 uppercase tracking-widest text-[9px]">Akreditasi</label>
                        <select value={formData.akreditasi} onChange={(e) => setFormData({...formData, akreditasi: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-800 appearance-none outline-none">
                            <option>Terakreditasi A</option>
                            <option>Terakreditasi B</option>
                            <option>Terakreditasi C</option>
                            <option>Terakreditasi D</option>
                            <option>Belum Akreditasi</option>
                        </select>
                        </div>
                        
                        <div className="space-y-2">
                        <label className="font-black text-slate-800 uppercase tracking-widest text-[9px]">Kurikulum</label>
                        <input type="text" value={formData.kurikulum} onChange={(e) => setFormData({...formData, kurikulum: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-800 outline-none" />
                        </div>
                        
                        <div className="space-y-2">
                        <label className="font-black text-slate-800 uppercase tracking-widest text-[9px]">Tahun</label>
                        <input type="number" value={formData.tahunBerdiri} onChange={(e) => setFormData({...formData, tahunBerdiri: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-800 outline-none" />
                        </div>

                        {/* Baris 2: Full Width (Membentang 3 kolom) */}
                        <div className="md:col-span-3 space-y-2">
                        <label className="font-black text-slate-800 uppercase tracking-widest text-[9px]">SK Operasional</label>
                        <input type="text" value={formData.skIzin} onChange={(e) => setFormData({...formData, skIzin: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none focus:border-emerald-500 transition-all shadow-sm" />
                        </div>
                    </div>
                    </div>

                  <div className="space-y-8 pt-4 border-t border-slate-50">
                    <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-3 italic">
                       <span className="w-2 h-6 bg-orange-500 rounded-full"></span> Kontak & Alamat
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2"><label className="font-black text-slate-800 uppercase tracking-widest text-[9px]">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none" /></div>
                      <div className="space-y-2"><label className="font-black text-slate-800 uppercase tracking-widest text-[9px]">Telepon</label><input type="text" value={formData.telepon} onChange={(e) => setFormData({...formData, telepon: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none" /></div>
                      <div className="md:col-span-2 space-y-2"><label className="font-black text-slate-800 uppercase tracking-widest text-[9px]">Alamat Lengkap</label><textarea rows="3" value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-6 font-bold text-slate-800 outline-none resize-none shadow-sm focus:border-orange-500 transition-all"></textarea></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Settings;