/* global process */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Rate Limit Umum
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 
});
app.use('/api/', limiter);

// --- TAMBAHAN: Strict Rate Limit Khusus Update Data Sekolah ---
const strictUpdateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Menit
    max: 10, // Maksimal 10 kali klik simpan
    message: { success: false, message: "Terlalu banyak upaya perubahan data. Silakan coba lagi nanti." }
});
app.use('/api/school/update', strictUpdateLimiter);
// -------------------------------------------------------------

app.use(express.json({ limit: '10mb' })); 

app.use('/api/auth', authRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('API Simas is Protected & Running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));