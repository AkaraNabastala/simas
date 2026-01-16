/* global process */
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
// PERBAIKAN: Gunakan .js dan index.js, bukan .ts
import { PrismaClient } from '../generated/prisma/index.js'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Setup Prisma dengan Driver Adapter (Wajib menggunakan konfigurasi pool)
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const login = async (req, res) => {
    const { username, password } = req.body;
    
    // 1. Tambahkan IP Address untuk keamanan audit
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        const user = await prisma.users.findUnique({ where: { username } });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            // Log percobaan gagal (Opsional untuk deteksi brute force)
            return res.status(401).json({ success: false, message: "Username atau password salah." });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username }, // Tambah username di sini
            process.env.JWT_SECRET || 'secret_fallback_123',
            { expiresIn: '24h' }
        );

        // 2. AUDIT LOG: Catat aktivitas login berhasil
        await prisma.audit_logs.create({
            data: {
                username: user.username,
                role: user.role,
                action: "LOGIN_SUCCESS",
                ip_address: ip,
                details: { login_at: new Date() }
            }
        });

        res.json({
            success: true,
            token,
            user: { 
                username: user.username, 
                role: user.role,
                full_name: user.full_name
            }
        });
    } catch (error) {
        console.error("ERROR LOGIN:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan sistem." });
    }
};