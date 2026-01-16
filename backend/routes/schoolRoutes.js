import express from 'express';
import { updateSchoolProfile, getSchoolProfile } from '../controllers/schoolController.js';
import prisma from '../lib/prisma.js';

// TAMBAHKAN BARIS INI (Sesuaikan path folder middleware Anda)
import { authenticateToken } from '../middleware/auth.js'; 

const router = express.Router();

// Route untuk mengambil logs
router.get('/logs', authenticateToken, async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    console.error("Error Fetch Logs:", error);
    res.status(500).json({ error: "Gagal mengambil log dari database" });
  }
});

router.get('/profile', getSchoolProfile);
router.put('/update', authenticateToken, updateSchoolProfile);

export default router;