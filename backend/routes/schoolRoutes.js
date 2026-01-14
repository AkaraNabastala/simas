import express from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// Ambil Data
router.get('/profile', async (req, res) => {
    try {
        const profile = await prisma.schoolProfile.findUnique({
            where: { id: 1 }
        });
        res.json(profile || {});
    } catch (error) {
        res.status(500).json({ message: "Database Error", error: error.message });
    }
});

// Update Data
router.put('/update', async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        // Pastikan establishedYear adalah Integer
        if (updateData.establishedYear) {
            updateData.establishedYear = parseInt(updateData.establishedYear);
        }

        const profile = await prisma.schoolProfile.upsert({
            where: { id: 1 },
            update: updateData,
            create: { id: 1, ...updateData },
        });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: "Gagal menyimpan data", error: error.message });
    }
});

export default router;