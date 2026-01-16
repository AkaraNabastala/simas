import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import SchoolProfile from './pages/admin/SchoolProfile';
import Profile from './pages/admin/Profile';
import UserManagement from './pages/admin/UserManagement';
import AccountSettings from './pages/admin/AccountSettings';
import ProtectedRoute from './components/ProtectedRoute';

// Jika Anda nanti membuat halaman Siswa, import di sini
// import SiswaPage from './pages/Siswa'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Rute Publik: Login */}
        <Route path="/" element={<LoginPage />} />

        {/* 2. Kelompok Rute Admin (Diproteksi) */}
        {/* Setiap halaman harus memiliki Route-nya sendiri-sendiri */}
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/account-settings" 
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/management-user" 
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profil-sekolah" 
          element={
            <ProtectedRoute>
              <SchoolProfile />
            </ProtectedRoute>
          } 
        />

        {/* Contoh Rute Siswa (Jika sudah ada filenya nanti) */}
        {/* <Route 
          path="/siswa" 
          element={
            <ProtectedRoute>
              <SiswaPage />
            </ProtectedRoute>
          } 
        /> 
        */}

        {/* 3. Rute 404: Jika halaman tidak ditemukan, arahkan ke dashboard atau login */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;