/* global process */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Gunakan routes
app.use('/api/auth', authRoutes);
app.use('/api/school', schoolRoutes);

app.get('/', (req, res) => {
    res.send('API Simas is Running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});