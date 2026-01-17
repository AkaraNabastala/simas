import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  Save, Building2, Image as ImageIcon, Mail, Phone, Upload,
  Globe, Landmark, School, Trash2, Plus, Instagram,
  Facebook, Youtube, Link as LinkIcon, Hash
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const SchoolProfile = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    namaSekolah: '', npsn: '', kategori: 'Sekolah', statusSekolah: 'Negeri',
    jenjang: 'SMA', kepalaSekolah: '', nipKepala: '', akreditasi: 'Akreditasi A',
    kurikulum: '', tahunBerdiri: 2000, skIzin: '', email: '', telepon: '',
    alamat: '', province: '', city: '', district: '', postalCode: '',
    socialLinks: []
  });

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  // Previews untuk menampilkan gambar sementara di UI
  const [previews, setPreviews] = useState({ sekolah: null, yayasan: null, background: null });
  // imageFiles untuk menampung File Object yang akan dikirim ke Backend
  const [imageFiles, setImageFiles] = useState({ sekolah: null, yayasan: null, background: null });

  const [currentLink, setCurrentLink] = useState('');

  const listJenjang = {
    'Sekolah': ['SD', 'SMP', 'SMA', 'SMK'],
    'Madrasah': ['MI', 'MTs', 'MA', 'MAK']
  };

  const handleImage = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("File harus berupa gambar!");
        return;
      }
      setImageFiles(prev => ({ ...prev, [key]: file }));
      setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
      toast.success(`Preview ${key} berhasil dimuat`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, provRes] = await Promise.all([
          axios.get('http://localhost:5000/api/school/profile'),
          axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
        ]);

        setProvinces(provRes.data);
        if (profileRes.data) {
          const db = profileRes.data;
          setFormData({
            namaSekolah: db.schoolName || '',
            npsn: db.npsn || '',
            kategori: db.category || 'Sekolah',
            statusSekolah: db.schoolStatus || 'Negeri',
            jenjang: db.level || 'SMA',
            kepalaSekolah: db.principalName || '',
            nipKepala: db.principalNip || '',
            akreditasi: db.accreditation || 'Akreditasi A',
            kurikulum: db.curriculum || '',
            tahunBerdiri: db.establishedYear || 2000,
            skIzin: db.licenseNumber || '',
            email: db.email || '',
            telepon: db.phone || '',
            alamat: db.address || '',
            province: db.province || '',
            city: db.city || '',
            district: db.district || '',
            postalCode: db.postalCode || '',
            socialLinks: db.socialLinks || []
          });

          // Set existing images to previews
          setPreviews({
            sekolah: db.schoolLogo ? `http://localhost:5000/uploads/${db.schoolLogo}` : null,
            yayasan: db.foundationLogo ? `http://localhost:5000/uploads/${db.foundationLogo}` : null,
            background: db.buildingPhoto ? `http://localhost:5000/uploads/${db.buildingPhoto}` : null
          });
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.province) {
      const target = provinces.find(p => p.name === formData.province);
      if (target) {
        axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${target.id}.json`)
             .then(r => setCities(r.data)).catch(err => console.error(err));
      }
    }
  }, [formData.province, provinces]);

  useEffect(() => {
    if (formData.city) {
      const target = cities.find(c => c.name === formData.city);
      if (target) {
        axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${target.id}.json`)
             .then(r => setDistricts(r.data)).catch(err => console.error(err));
      }
    }
  }, [formData.city, cities]);

  const handleSave = async () => {
    const confirmSave = window.confirm("Apakah Anda yakin ingin menyimpan semua perubahan profil?");
    if (!confirmSave) return;
    setLoading(true);
    const loadId = toast.loading('Menyimpan data...');
    const token = localStorage.getItem('token');

    const dataToSend = new FormData();

    // Append data text
    dataToSend.append('schoolName', formData.namaSekolah);
    dataToSend.append('npsn', formData.npsn);
    dataToSend.append('schoolStatus', formData.statusSekolah);
    dataToSend.append('level', formData.jenjang);
    dataToSend.append('principalName', formData.kepalaSekolah);
    dataToSend.append('principalNip', formData.nipKepala);
    dataToSend.append('accreditation', formData.akreditasi);
    dataToSend.append('curriculum', formData.kurikulum);
    dataToSend.append('establishedYear', formData.tahunBerdiri);
    dataToSend.append('licenseNumber', formData.skIzin);
    dataToSend.append('email', formData.email);
    dataToSend.append('phone', formData.telepon);
    dataToSend.append('address', formData.alamat);
    dataToSend.append('province', formData.province);
    dataToSend.append('city', formData.city);
    dataToSend.append('district', formData.district);
    dataToSend.append('postalCode', formData.postalCode);
    dataToSend.append('socialLinks', JSON.stringify(formData.socialLinks));

    // Append files
    if (imageFiles.sekolah) dataToSend.append('schoolLogo', imageFiles.sekolah);
    if (imageFiles.yayasan) dataToSend.append('foundationLogo', imageFiles.yayasan);
    if (imageFiles.background) dataToSend.append('buildingPhoto', imageFiles.background);

    try {
      const response = await axios.put('http://localhost:5000/api/school/update', dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const updatedData = response.data.data;
        localStorage.setItem('school_profile', JSON.stringify(updatedData));
        window.dispatchEvent(new Event("storage"));
        if (response.data.data.schoolLogo) {
          const favicon = document.querySelector("link[rel~='icon']");
          if (favicon) {
            favicon.href = `http://localhost:5000/uploads/${response.data.data.schoolLogo}`;
          }
        }
        toast.success('Berhasil diperbarui!', { id: loadId });
        // Refresh untuk sinkronisasi semua komponen
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal simpan ke server';
      toast.error(errorMsg, { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (url) => {
    const link = url.toLowerCase();
    if (link.includes('instagram')) return <Instagram size={16} className="text-pink-600" />;
    if (link.includes('facebook')) return <Facebook size={16} className="text-blue-700" />;
    if (link.includes('youtube')) return <Youtube size={16} className="text-red-600" />;
    return <LinkIcon size={16} className="text-slate-500" />;
  };

  const user = JSON.parse(localStorage.getItem('user')) || { full_name: 'Admin', role: 'Admin' };
  const removeImage = (key) => {
    const mapping = {
      sekolah: 'sekolah',
      yayasan: 'yayasan',
      background: 'background'
    };
    const target = mapping[key];
    setPreviews(prev => ({ ...prev, [target]: null }));
    setImageFiles(prev => ({ ...prev, [target]: null }));
    toast.success(`Preview ${key} dihapus`);
  };
  return (
    <div className="min-h-screen bg-[#F4F7FE] flex overflow-hidden font-['Poppins'] text-[13px] text-slate-700">
      <Toaster position="top-right" />
      <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header setOpen={setSidebarOpen} user={user} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6 pb-10">

            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm gap-4">
              <div className="flex items-center gap-5 w-full sm:w-auto">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                  <School size={28} />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Identitas Satuan Pendidikan</h1>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1.5">Profil Instansi & Kontrol Database</p>
                </div>
              </div>
              <button onClick={handleSave} disabled={loading} className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] transition-all shadow-xl active:scale-95 disabled:bg-slate-300 tracking-widest">
                <Save size={20} /> {loading ? 'Saving...' : 'Simpan Perubahan'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              <div className="lg:col-span-8 order-1 lg:order-2">
                <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-sm space-y-12">
                  <div className="space-y-8">
                    <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 italic">
                      <span className="w-2.5 h-6 bg-blue-600 rounded-full"></span> Identitas Sekolah
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2 space-y-2.5">
                        <label htmlFor="namaSekolah" className="font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">Nama Lengkap Satuan Pendidikan</label>
                        <input id="namaSekolah" name="namaSekolah" type="text" value={formData.namaSekolah} onChange={(e) => setFormData({...formData, namaSekolah: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 text-sm shadow-sm" />
                      </div>

                      <div className="space-y-2.5">
                        <label htmlFor="kategori" className="font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">Kategori</label>
                        <select id="kategori" name="kategori" value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value, jenjang: listJenjang[e.target.value][0]})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-slate-900 outline-none appearance-none text-sm shadow-sm">
                          <option value="Sekolah">Sekolah Umum</option>
                          <option value="Madrasah">Madrasah</option>
                        </select>
                      </div>

                      {/* JENJANG PENDIDIKAN */}
                      <div className="space-y-2.5">
                        {/* Menggunakan span alih-alih label untuk elemen non-input */}
                        <span className="block font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">
                          Jenjang Pendidikan
                        </span>
                        <div
                          role="group"
                          className="flex bg-slate-100 p-1.5 rounded-2xl gap-1.5"
                        >
                          {listJenjang[formData.kategori].map(j => (
                            <button
                              key={j}
                              type="button"
                              onClick={() => setFormData({...formData, jenjang: j})}
                              className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all ${
                                formData.jenjang === j
                                ? 'bg-white text-blue-600 shadow-md'
                                : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              {j}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <label htmlFor="npsn" className="font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">NPSN</label>
                        <input id="npsn" name="npsn" type="text" value={formData.npsn} onChange={(e) => setFormData({...formData, npsn: e.target.value})} className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-sm text-slate-900 outline-none shadow-inner" />
                      </div>

                      {/* STATUS SEKOLAH */}
                      <div className="space-y-2.5">
                        <span className="block font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">
                          Status
                        </span>
                        <div
                          role="group"
                          className="flex bg-slate-100 p-1.5 rounded-2xl gap-1.5"
                        >
                          {['Negeri', 'Swasta'].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setFormData({...formData, statusSekolah: s})}
                              className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all ${
                                formData.statusSekolah === s
                                ? 'bg-white text-blue-600 shadow-md'
                                : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <label htmlFor="kepalaSekolah" className="font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">Kepala Sekolah</label>
                        <input id="kepalaSekolah" name="kepalaSekolah" type="text" value={formData.kepalaSekolah} onChange={(e) => setFormData({...formData, kepalaSekolah: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-slate-900 text-sm outline-none shadow-sm" />
                      </div>

                      <div className="space-y-2.5">
                        <label htmlFor="nipKepala" className="font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">NIP Kepala</label>
                        <input id="nipKepala" name="nipKepala" type="text" value={formData.nipKepala} onChange={(e) => setFormData({...formData, nipKepala: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-slate-900 text-sm outline-none shadow-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8 pt-10 border-t border-slate-100">
                    <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 italic">
                      <span className="w-2.5 h-6 bg-emerald-500 rounded-full"></span> Administrasi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2.5">
                        <label htmlFor="akreditasi" className="font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">Akreditasi</label>
                        <select id="akreditasi" name="akreditasi" value={formData.akreditasi} onChange={(e) => setFormData({...formData, akreditasi: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-slate-900 text-sm outline-none appearance-none shadow-sm">
                          <option>Akreditasi A</option>
                          <option>Akreditasi B</option>
                          <option>Akreditasi C</option>
                        </select>
                      </div>
                      <div className="space-y-2.5">
                        <label htmlFor="kurikulum" className="font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">Kurikulum</label>
                        <input id="kurikulum" name="kurikulum" type="text" value={formData.kurikulum} onChange={(e) => setFormData({...formData, kurikulum: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-slate-900 text-sm outline-none shadow-sm" />
                      </div>
                      <div className="space-y-2.5">
                        <label htmlFor="tahunBerdiri" className="font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">Tahun Berdiri</label>
                        <input id="tahunBerdiri" name="tahunBerdiri" type="number" value={formData.tahunBerdiri} onChange={(e) => setFormData({...formData, tahunBerdiri: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-slate-900 text-sm outline-none shadow-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8 pt-10 border-t border-slate-100">
                    <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 italic">
                      <span className="w-2.5 h-6 bg-orange-500 rounded-full"></span> Kontak & Lokasi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2.5">
                        <label htmlFor="emailResmi" className="font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">Email Resmi</label>
                        <input id="emailResmi" name="emailResmi" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-slate-900 text-sm outline-none shadow-inner" />
                      </div>
                      <div className="space-y-2.5">
                        <label htmlFor="telepon" className="font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">Nomor Telepon</label>
                        <input id="telepon" name="telepon" type="text" value={formData.telepon} onChange={(e) => setFormData({...formData, telepon: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-slate-900 text-sm outline-none shadow-sm" />
                      </div>
                      <div className="space-y-2.5">
                        <label htmlFor="province" className="font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">Provinsi</label>
                        <select id="province" name="province" value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value, city:'', district:''})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-slate-900 text-sm outline-none appearance-none shadow-sm">
                          <option value="">Pilih Provinsi</option>
                          {provinces.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2.5">
                        <label htmlFor="city" className="font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">Kota / Kabupaten</label>
                        <select id="city" name="city" disabled={!formData.province} value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value, district:''})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-slate-900 text-sm outline-none appearance-none disabled:opacity-50 shadow-sm">
                          <option value="">Pilih Kota</option>
                          {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2.5">
                        <label htmlFor="district" className="font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">Kecamatan</label>
                        <select id="district" name="district" disabled={!formData.city} value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4.5 font-bold text-slate-900 text-sm outline-none appearance-none disabled:opacity-50 shadow-sm">
                          <option value="">Pilih Kecamatan</option>
                          {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2.5">
                        <label htmlFor="postalCode" className="font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">Kode Pos</label>
                        <div className="relative">
                          <Hash size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input id="postalCode" name="postalCode" type="text" value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-14 pr-6 py-4.5 font-bold text-slate-900 text-sm outline-none shadow-inner" />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2.5">
                        <label htmlFor="alamat" className="font-black text-slate-600 uppercase text-[10px] ml-1 tracking-wider">Alamat Lengkap Jalan</label>
                        <textarea id="alamat" name="alamat" rows="4" value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-6 font-bold text-slate-900 text-sm outline-none resize-none focus:border-orange-500 transition-all shadow-sm"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 order-2 lg:order-1 space-y-6">
                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <h3 className="font-black text-slate-800 uppercase tracking-widest text-[11px] mb-8 flex items-center gap-3 italic">
                    <ImageIcon size={18} className="text-blue-600" /> Branding & Media
                  </h3>

                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      {/* LOGO INSTANSI */}
                      <div className="space-y-4 text-center">
                        <div className="relative aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-[2.5rem] flex items-center justify-center overflow-hidden group">
                          {previews.sekolah ? (
                            <>
                              <img src={previews.sekolah} className="w-full h-full object-contain p-4" alt="Logo Sekolah" />
                              <button
                                type="button"
                                onClick={() => removeImage('sekolah')}
                                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg z-20"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          ) : (
                            <Building2 size={35} className="text-slate-300" />
                          )}
                          <label htmlFor="input-logo-sekolah" className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center transition-all z-10">
                            <Upload className="text-blue-700" size={24} />
                            <input
                              id="input-logo-sekolah"
                              name="schoolLogo"
                              type="file"
                              className="hidden"
                              onChange={(e) => handleImage(e, 'sekolah')}
                            />
                          </label>
                        </div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">Logo Instansi</span>
                      </div>

                      {/* LOGO YAYASAN */}
                      <div className="space-y-4 text-center">
                        <div className="relative aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-[2.5rem] flex items-center justify-center overflow-hidden group">
                          {previews.yayasan ? (
                            <>
                              <img src={previews.yayasan} className="w-full h-full object-contain p-4" alt="Logo Yayasan" />
                              <button
                                type="button"
                                onClick={() => removeImage('yayasan')}
                                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg z-20"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          ) : (
                            <Building2 size={35} className="text-slate-300" />
                          )}
                          <label htmlFor="input-logo-yayasan" className="absolute inset-0 bg-slate-800/20 opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center transition-all z-10">
                            <Upload className="text-slate-800" size={24} />
                            <input
                              id="input-logo-yayasan"
                              name="foundationLogo"
                              type="file"
                              className="hidden"
                              onChange={(e) => handleImage(e, 'yayasan')}
                            />
                          </label>
                        </div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">Logo Yayasan</span>
                      </div>
                    </div>

                    {/* FOTO GEDUNG / BACKGROUND LOGIN */}
                    <div className="space-y-4 text-center">
                      <div className="relative aspect-video bg-slate-50 border-2 border-dashed border-slate-300 rounded-[2.5rem] flex items-center justify-center overflow-hidden group">
                        {previews.background ? (
                          <>
                            <img src={previews.background} className="w-full h-full object-contain p-4" alt="Logo background" />
                            <button
                              type="button"
                              onClick={() => removeImage('background')} // FUNGSI DIGUNAKAN DISINI
                              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg z-20"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <ImageIcon size={35} className="text-slate-300" />
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Belum ada foto gedung</span>
                          </div>
                        )}
                        <label htmlFor="input-foto-gedung" className="absolute inset-0 bg-emerald-600/20 opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center transition-all z-10">
                          <Upload className="text-emerald-700" size={24} />
                          <input
                            id="input-foto-gedung"
                            name="buildingPhoto"
                            type="file"
                            className="hidden"
                            onChange={(e) => handleImage(e, 'background')}
                          />
                        </label>
                      </div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">Foto Gedung (Login Background)</span>
                    </div>
                  </div>
                </section>

                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
                  <h3 className="font-black text-slate-800 uppercase tracking-widest text-[11px] mb-6 flex items-center gap-3 italic">
                    <Globe size={18} className="text-blue-600" /> Sosial Media
                  </h3>
                  <div className="flex gap-3 mb-6 items-center">
                    <input id="social-input" type="text" value={currentLink} onChange={(e) => setCurrentLink(e.target.value)} placeholder="Paste link..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-blue-500 text-sm shadow-sm" />
                    <button type="button" onClick={() => { if(currentLink) { setFormData(prev => ({...prev, socialLinks: [...prev.socialLinks, currentLink]})); setCurrentLink(''); }}} className="shrink-0 w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition-all active:scale-90"><Plus size={24} /></button>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {formData.socialLinks.map((link, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl group transition-all hover:border-blue-200">
                        <div className="flex items-center gap-4 overflow-hidden min-w-0">
                          <div className="shrink-0">{getIcon(link)}</div>
                          <span className="font-bold text-[11px] text-slate-900 truncate tracking-tight">{link}</span>
                        </div>
                        <button type="button" onClick={() => setFormData(prev => ({...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== index)}))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default SchoolProfile;