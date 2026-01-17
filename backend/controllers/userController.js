import prisma from '../lib/prisma.js';
import bcrypt from 'bcrypt';

// 1. Ambil Semua User (Admin Only Logic)
export const getUsers = async (req, res) => {
  try {
    const response = await prisma.users.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Gagal mengambil data database" });
  }
};

// 2. Simpan User Baru
export const createUser = async (req, res) => {
  const { username, password, full_name, identity_number, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.users.create({
      data: {
        username: username.toLowerCase().trim(),
        password: hashedPassword,
        full_name: full_name.trim(),
        identity_number: identity_number ? identity_number.trim() : null,
        role: role || 'Siswa',
        is_active: true
      }
    });
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "Username atau Nomor Identitas sudah digunakan" });
    }
    res.status(500).json({ message: "Gagal menyimpan ke database" });
  }
};
// 3. Update Profil
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { full_name, identity_number } = req.body;

        const updated = await prisma.users.update({
            where: { id: userId },
            data: {
                full_name: full_name.trim(),
                identity_number: identity_number ? identity_number.trim() : null,
                updated_at: new Date()
            }
        });

        const { password: _, ...safeData } = updated;
        res.json({ success: true, user: safeData });
    } catch (error) {
        console.error("Update Profile Error:", error); // PERBAIKAN ESLINT
        res.status(500).json({ message: "Gagal memperbarui profil" });
    }
};

// 4. Update Akun
export const updateAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, currentPassword, newPassword } = req.body;

        const user = await prisma.users.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        const updateData = {};

        // 1. Logika Ganti Username
        if (username && username !== user.username) {
            updateData.username = username.toLowerCase().trim();
        }

        // 2. Logika Ganti Password
        if (newPassword) {
            // Validasi: Apakah sandi saat ini diisi?
            if (!currentPassword) {
                return res.status(400).json({ message: "Sandi saat ini wajib diisi" });
            }

            // A. Verifikasi apakah sandi saat ini benar
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Sandi saat ini salah" });
            }

            // B. VALIDASI BARU: Cek apakah sandi baru sama dengan sandi lama
            const isSameAsOld = await bcrypt.compare(newPassword, user.password);
            if (isSameAsOld) {
                return res.status(400).json({
                    success: false,
                    message: "Sandi baru tidak boleh sama dengan sandi saat ini!"
                });
            }

            // C. Hash sandi baru jika sudah lolos validasi
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        // Jika tidak ada perubahan sama sekali
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Tidak ada perubahan yang dideteksi" });
        }

        await prisma.users.update({
            where: { id: userId },
            data: { ...updateData, updated_at: new Date() }
        });

        res.json({ success: true, message: "Kredensial berhasil diperbarui" });
    } catch (error) {
        console.error("Update Account Error:", error);
        res.status(500).json({ message: "Gagal memperbarui akun" });
    }
};

// 5. Hapus User
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.users.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error("Delete User Error:", error); // PERBAIKAN ESLINT
    res.status(500).json({ message: "Gagal menghapus user" });
  }
};
// 6. Import Banyak User dari CSV
export const importUsers = async (req, res) => {
    try {
        const { users } = req.body; // Menerima array of objects dari frontend

        if (!users || !Array.isArray(users)) {
            return res.status(400).json({ message: "Format data tidak valid" });
        }

        // Proses hashing password dan persiapan data
        const preparedData = await Promise.all(users.map(async (user) => {
            // Default password jika tidak ada di CSV adalah '123456'
            const defaultPassword = await bcrypt.hash('123456', 10);

            return {
                full_name: user.full_name,
                username: user.username.toLowerCase().trim(),
                identity_number: user.identity_number || null,
                password: defaultPassword, // Keamanan: Tetap di-hash
                role: user.role || 'Siswa',
                is_active: true
            };
        }));

        // Simpan banyak data sekaligus ke database (Transaction)
        const createdUsers = await prisma.users.createMany({
            data: preparedData,
            skipDuplicates: true, // Cyber Security: Mencegah error jika ada username ganda
        });

        res.status(201).json({
            success: true,
            message: `${createdUsers.count} user berhasil diimpor ke sistem.`
        });
    } catch (error) {
        console.error("Import Database Error:", error);
        res.status(500).json({ message: "Gagal memproses import data ke database" });
    }
};