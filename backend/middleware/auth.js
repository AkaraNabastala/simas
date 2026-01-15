/* global process */
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Akses ditolak, token tidak ditemukan!" });

    jwt.verify(token, process.env.JWT_SECRET || 'secret_fallback_123', (err, user) => {
        if (err) return res.status(403).json({ message: "Sesi habis, silakan login ulang." });
        req.user = user; // Berisi id dan role dari database
        next();
    });
};