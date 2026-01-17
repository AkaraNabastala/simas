/* global process */

import express from 'express';
import cors from 'cors'; // Variabel ini sekarang digunakan
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

// Panggil CORS agar tidak error ESLint dan mengizinkan frontend mengakses API
app.use(cors());

// Konfigurasi Helmet yang benar (Cukup panggil satu kali)
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate Limit Umum
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);

// Strict Rate Limit Khusus Update Data Sekolah
const strictUpdateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Terlalu banyak upaya perubahan data. Silakan coba lagi nanti." }
});
app.use('/api/school/update', strictUpdateLimiter);

app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('API Simas is Protected & Running...'));

// Route File upload gambar
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));