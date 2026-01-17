import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  UserPlus, Users, Key, Trash2, 
  Edit3, Search, Save, FileUp,
  ShieldCheck, GraduationCap, UserRound, LayoutGrid, Eye
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ImportModal from '../../components/modals/ImportModal';
import EditUserModal from '../../components/modals/EditUserModal';
import DetailUserModal from '../../components/modals/DetailUserModal';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const UserManagement = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState([]);
  const [activeTab, setActiveTab] = useState('Semua');
  
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tempParsedData, setTempParsedData] = useState([]);
  const [currentFileName, setCurrentFileName] = useState("");

  const fileInputRef = useRef(null);
  const storedUser = JSON.parse(localStorage.getItem('user')) || { full_name: 'Admin', role: 'Admin' };

  const [formData, setFormData] = useState({
    full_name: '', username: '', identity_number: '', password: '', role: 'Siswa'
  });

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', getAuthHeader());
      setUserList(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data user");
    }
  }, [getAuthHeader]);

  useEffect(() => { 
    fetchUsers(); 
  }, [fetchUsers]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/users', formData, getAuthHeader());
      toast.success('User berhasil ditambahkan!');
      setFormData({ full_name: '', username: '', identity_number: '', password: '', role: 'Siswa' });
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal menyimpan");
    } finally { setLoading(false); }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
    // setShowDetailModal(true);
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${updatedData.id}`, updatedData, getAuthHeader());
      toast.success("User berhasil diperbarui");
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui user");
    }
  };

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.csv')) return toast.error("File harus CSV");

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split('\n').slice(1);
      const parsed = rows.filter(row => row.trim() !== '').map(row => {
        const cols = row.split(',');
        return {
          full_name: cols[0]?.trim(),
          username: cols[1]?.trim(),
          identity_number: cols[2]?.trim(),
          role: cols[3]?.trim()
        };
      });
      setTempParsedData(parsed);
      setCurrentFileName(file.name);
      setShowImportModal(true);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    setShowImportModal(false);
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/users/import', { users: tempParsedData }, getAuthHeader());
      toast.success("Import berhasil");
      fetchUsers();
    } catch (error) { 
      console.error(error);
      toast.error("Gagal import"); 
    } finally { 
      setLoading(false); 
      if (fileInputRef.current) fileInputRef.current.value = ""; 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus pengguna secara permanen?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, getAuthHeader());
      toast.success("User terhapus");
      fetchUsers();
    } catch (error) { 
      console.error(error);
      toast.error("Gagal menghapus user"); 
    }
  };

  const filteredUsers = userList.filter(u => {
    const matchesSearch = u.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'Semua' || 
                      u.role?.toLowerCase() === activeTab.toLowerCase();
                      
    return matchesSearch && matchesTab;
  });

  return (
    // Base text diperbesar ke 13px (text-[13px])
    <div className="min-h-screen bg-[#F4F7FE] flex overflow-hidden font-['Poppins'] text-[13px] text-slate-700">
      <Toaster position="top-right" />
      
      <ImportModal 
        isOpen={showImportModal} 
        onClose={() => setShowImportModal(false)} 
        onConfirm={handleConfirmImport} 
        fileName={currentFileName}
        dataCount={tempParsedData.length}
      />

      <EditUserModal 
        key={selectedUser?.id || 'edit-modal'}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        userData={selectedUser}
        onSave={handleUpdateUser}
      />

      <DetailUserModal 
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        userData={selectedUser}
      />

      <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header setOpen={setSidebarOpen} user={storedUser} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 italic">
          <div className="max-w-6xl mx-auto space-y-5 pb-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between border-l-4 border-blue-600 pl-4 py-1">
              <div>
                {/* Judul diperbesar ke text-2xl */}
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">User Management</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Otoritas Pengguna & Kontrol Akses</p>
              </div>
              <div className="mt-4 md:mt-0">
                <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileSelection} />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-black uppercase text-[10px] transition-all shadow-md active:scale-95"
                >
                  <FileUp size={16} /> Import Data (CSV)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Card Registrasi (h-fit agar menyesuaikan isi) */}
              <div className="lg:col-span-4 h-fit">
                <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4 text-blue-600">
                    <UserPlus size={22} />
                    <h3 className="font-black text-slate-900 uppercase text-[13px] italic">Registrasi User</h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="full_name" className="font-black text-slate-800 uppercase text-[10px] ml-1">Nama Lengkap</label>
                      <input 
                        required 
                        id="full_name"
                        name="full_name"
                        autoComplete="name"
                        value={formData.full_name} 
                        onChange={handleInputChange} 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-900 outline-none focus:border-blue-600 transition-all text-[13px] placeholder:text-[11px]" 
                        placeholder="Nama lengkap..." 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label htmlFor="username" className="font-black text-slate-800 uppercase text-[10px] ml-1">Username</label>
                        <input 
                          required 
                          id="username"
                          name="username" 
                          autoComplete="username"
                          value={formData.username} 
                          onChange={handleInputChange} 
                          type="text" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-900 outline-none focus:border-blue-600 transition-all text-[13px]" 
                          placeholder="ID Unik" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="role" className="font-black text-slate-800 uppercase text-[10px] ml-1">Role</label>
                        <select 
                          id="role"
                          name="role" 
                          value={formData.role} 
                          onChange={handleInputChange} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-900 outline-none focus:border-blue-600 appearance-none text-[13px]"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Guru">Guru</option>
                          <option value="Siswa">Siswa</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="identity_number" className="font-black text-slate-800 uppercase text-[10px] ml-1">Nomor Identitas</label>
                      <input 
                        id="identity_number"
                        name="identity_number" 
                        autoComplete="off" // Karena ini nomor unik sekolah, kita matikan autocomplete-nya
                        value={formData.identity_number} 
                        onChange={handleInputChange} 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-900 outline-none focus:border-blue-600 transition-all text-[13px]" 
                        placeholder="NIP/NISN" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="password" className="font-black text-slate-800 uppercase text-[10px] ml-1">Password</label>
                      <input 
                        required 
                        id="password"
                        name="password" 
                        autoComplete="new-password" // Beritahu browser ini adalah pembuatan password baru
                        value={formData.password} 
                        onChange={handleInputChange} 
                        type="password" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-900 outline-none focus:border-blue-600 transition-all text-[13px]" 
                        placeholder="••••••••" 
                      />
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-xl font-black uppercase text-[11px] transition-all shadow-lg mt-2">
                      <Save size={18} /> {loading ? 'Memproses...' : 'Simpan User'}
                    </button>
                  </form>
                </section>
              </div>

              {/* Card List User (h-fit agar menyesuaikan isi) */}
              <div className="lg:col-span-8 space-y-4 h-fit">
                <div className="flex bg-white p-1.5 border border-slate-200 rounded-2xl shadow-sm gap-1 overflow-x-auto no-scrollbar scroll-smooth">
                  {[
                    { id: 'Semua', icon: <LayoutGrid size={14} /> },
                    { id: 'Admin', icon: <ShieldCheck size={14} /> },
                    { id: 'Guru', icon: <GraduationCap size={14} /> },
                    { id: 'Siswa', icon: <UserRound size={14} /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all min-w-[90px] ${
                        activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {tab.icon} {tab.id}
                    </button>
                  ))}
                </div>

                <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden h-fit">
                  <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 italic text-slate-400">
                      <Users size={22} className="text-blue-600" />
                      <h3 className="font-black text-slate-900 uppercase text-[13px]">Daftar {activeTab}</h3>
                    </div>
                    <div className="relative w-full md:w-72">
                      {/* Label SR-Only agar terbaca browser tapi tidak merusak UI */}
                      <label htmlFor="search-user" className="sr-only">Cari Pengguna</label>
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        id="search-user"
                        type="text" 
                        placeholder="Cari..." 
                        className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-bold text-slate-900 outline-none focus:border-blue-600 w-full transition-all text-[13px]"
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[500px]">
                      <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-[13px]">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-white ${
                                  user.role === 'Admin' ? 'bg-slate-800' : user.role === 'Guru' ? 'bg-emerald-600' : 'bg-blue-600'
                                }`}>
                                  {user.full_name?.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 uppercase">{user.full_name}</p>
                                  <p className="text-[10px] text-slate-400 font-medium tracking-tight">@{user.username} | {user.identity_number || '-'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[13px]">
                              <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                                user.role === 'Admin' ? 'bg-red-50 text-red-600' : 
                                user.role === 'Guru' ? 'bg-emerald-50 text-emerald-600' : 
                                'bg-blue-50 text-blue-600'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => { setSelectedUser(user); setShowDetailModal(true); }} 
                                  className="p-2.5 hover:bg-emerald-50 hover:text-emerald-600 text-slate-400 rounded-lg transition-all"
                                  title="Lihat Biodata"
                                >
                                  <Eye size={16} />
                                </button>
                                
                                <button onClick={() => handleEditClick(user)} className="p-2.5 hover:bg-blue-600 hover:text-white text-slate-400 rounded-lg transition-all"><Edit3 size={16} /></button>
                                <button onClick={() => handleDelete(user.id)} className="p-2.5 hover:bg-red-600 hover:text-white text-slate-400 rounded-lg transition-all"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default UserManagement;