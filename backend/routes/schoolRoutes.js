import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { updateSchoolProfile, getSchoolProfile } from '../controllers/schoolController.js';
import { authenticateToken } from '../middleware/auth.js';
import prisma from '../lib/prisma.js';

const router = express.Router();

// Memastikan folder uploads tersedia
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        // Nama file unik: fieldname-timestamp-random.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Batas 5MB sesuai permintaan
});

// Daftarkan ketiga field gambar
const uploadMiddleware = upload.fields([
    { name: 'schoolLogo', maxCount: 1 },
    { name: 'foundationLogo', maxCount: 1 },
    { name: 'buildingPhoto', maxCount: 1 } // Pastikan field ini ada
]);

router.get('/profile', getSchoolProfile);

router.get('/logs', authenticateToken, async (req, res) => {
    try {
        const logs = await prisma.auditLog.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' }
        });
        res.json(logs);
    } catch (err) {
        console.error("Log Fetch Error:", err.message);
        res.status(500).json({ error: "Gagal mengambil log" });
    }
});

router.put('/update', authenticateToken, uploadMiddleware, updateSchoolProfile);

export default router;