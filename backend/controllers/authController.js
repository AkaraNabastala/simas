/* global process */
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { PrismaClient } from '../generated/prisma/client.ts'; 
import jwt from 'jsonwebtoken';

// 1. Setup koneksi PostgreSQL menggunakan Driver 'pg'
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Masukkan adapter ke dalam constructor PrismaClient (Sesuai error tadi)
const prisma = new PrismaClient({ adapter });

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.users.findUnique({
            where: { username }
        });

        if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: "Password salah" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: { username: user.username, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};