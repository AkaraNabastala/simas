import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  UserPlus, Users, Key, Trash2, 
  Edit3, Search, Save, FileUp,
  ShieldCheck, GraduationCap, UserRound, LayoutGrid
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ImportModal from '../../components/modals/ImportModal';
import EditUserModal from '../../components/modals/EditUserModal';
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
      console.error(error); // ESLint FIX: Panggil variabel error
      toast.error("Gagal mengambil data user");
    }
  }, [getAuthHeader]);

  useEffect(() => { 
    fetchUsers(); 
  }, [fetchUsers]); // ESLint FIX: Tambahkan fetchUsers sebagai dependency

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
      console.error(error); // ESLint FIX
      toast.error(error.response?.data?.message || "Gagal menyimpan");
    } finally { setLoading(false); }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${updatedData.id}`, updatedData, getAuthHeader());
      toast.success("User berhasil diperbarui");
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error(error); // ESLint FIX
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
      console.error(error); // ESLint FIX
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
      console.error(error); // ESLint FIX
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
    <div className="min-h-screen bg-[#F4F7FE] flex overflow-hidden font-['Poppins'] text-[11px] text-slate-700">
      <Toaster position="top-right" />
      
      <ImportModal 
        isOpen={showImportModal} 
        onClose={() => setShowImportModal(false)} 
        onConfirm={handleConfirmImport} 
        fileName={currentFileName}
        dataCount={tempParsedData.length}
      />

      <EditUserModal 
        key={selectedUser?.id || 'edit-modal'} // FIX: Gunakan key untuk mereset state modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        userData={selectedUser}
        onSave={handleUpdateUser}
      />

      <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header setOpen={setSidebarOpen} user={storedUser} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 italic">
          <div className="max-w-6xl mx-auto space-y-5 pb-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between border-l-4 border-blue-600 pl-4 py-1">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">User Management</h1>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Otoritas Pengguna & Kontrol Akses</p>
              </div>
              <div className="mt-4 md:mt-0">
                <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileSelection} />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-black uppercase text-[9px] transition-all shadow-md active:scale-95"
                >
                  <FileUp size={14} /> Import Data (CSV)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              <div className="lg:col-span-4">
                <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4 text-blue-600">
                    <UserPlus size={20} />
                    <h3 className="font-black text-slate-900 uppercase text-[11px] italic">Registrasi User</h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-black text-slate-800 uppercase text-[9px] ml-1">Nama Lengkap</label>
                      <input required name="full_name" value={formData.full_name} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:border-blue-600 transition-all placeholder:text-[10px]" placeholder="Nama lengkap..." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-black text-slate-800 uppercase text-[9px] ml-1">Username</label>
                        <input required name="username" value={formData.username} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:border-blue-600 transition-all placeholder:text-[10px]" placeholder="ID Unik" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-black text-slate-800 uppercase text-[9px] ml-1">Role</label>
                        <select name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:border-blue-600 appearance-none">
                          <option value="Admin">Admin</option>
                          <option value="Guru">Guru</option>
                          <option value="Siswa">Siswa</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-black text-slate-800 uppercase text-[9px] ml-1">Nomor Identitas</label>
                      <input name="identity_number" value={formData.identity_number} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:border-blue-600 transition-all placeholder:text-[10px]" placeholder="NIP/NISN" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-black text-slate-800 uppercase text-[9px] ml-1">Password</label>
                      <input required name="password" value={formData.password} onChange={handleInputChange} type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:border-blue-600 transition-all placeholder:text-[10px]" placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white py-3.5 rounded-xl font-black uppercase text-[9px] transition-all shadow-lg mt-2">
                      <Save size={16} /> {loading ? 'Memproses...' : 'Simpan User'}
                    </button>
                  </form>
                </section>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="flex bg-white p-1 border border-slate-200 rounded-2xl shadow-sm gap-1 overflow-x-auto no-scrollbar scroll-smooth">
                  {[
                    { id: 'Semua', icon: <LayoutGrid size={12} /> },
                    { id: 'Admin', icon: <ShieldCheck size={12} /> },
                    { id: 'Guru', icon: <GraduationCap size={12} /> },
                    { id: 'Siswa', icon: <UserRound size={12} /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-1 items-center justify-center gap-2 px-3 py-2 rounded-xl font-black uppercase text-[8px] tracking-widest transition-all min-w-[75px] ${
                        activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {tab.icon} {tab.id}
                    </button>
                  ))}
                </div>

                <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 italic text-slate-400">
                      <Users size={18} />
                      <h3 className="font-black text-slate-900 uppercase text-[11px]">Daftar {activeTab}</h3>
                    </div>
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        type="text" placeholder="Cari..." 
                        className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold text-slate-900 outline-none focus:border-blue-600 w-full transition-all text-[11px]"
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[500px]">
                      <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-[11px]">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-white ${
                                  user.role === 'Admin' ? 'bg-slate-800' : user.role === 'Guru' ? 'bg-emerald-600' : 'bg-blue-600'
                                }`}>
                                  {user.full_name?.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 uppercase">{user.full_name}</p>
                                  <p className="text-[9px] text-slate-400 font-medium">@{user.username} | {user.identity_number || '-'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[11px]">
                              <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${
                                user.role === 'Admin' ? 'bg-red-50 text-red-600' : 
                                user.role === 'Guru' ? 'bg-emerald-50 text-emerald-600' : 
                                'bg-blue-50 text-blue-600'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => handleEditClick(user)} className="p-2 hover:bg-blue-600 hover:text-white text-slate-400 rounded-lg transition-all"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-600 hover:text-white text-slate-400 rounded-lg transition-all"><Trash2 size={14} /></button>
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