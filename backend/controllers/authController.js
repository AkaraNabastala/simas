/* global process */
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { PrismaClient } from '../generated/prisma/client.ts'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Tambahkan import bcrypt

// Setup Prisma (Tetap sama seperti milik Anda)
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const login = async (req, res) => {
    const { username, password } = req.body;
    console.log("Mencoba login dengan:", username); // DEBUG 1
    try {
        const user = await prisma.users.findUnique({ where: { username } });
        if (!user) {
            console.log("User TIDAK ditemukan di DB"); // DEBUG 2
            return res.status(404).json({ success: false, message: "Pengguna tidak terdaftar!" });
        }
        console.log("User ditemukan. Membandingkan password..."); // DEBUG 3
        // Memastikan password yang diketik vs hash di DB
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log("Hasil perbandingan:", isPasswordMatch); // DEBUG 4
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: "Kata sandi salah." });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '24h' }
        );

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
        res.status(500).json({ success: false, message: error.message });
    }
};