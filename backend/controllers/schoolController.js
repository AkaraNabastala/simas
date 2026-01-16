import prisma from '../lib/prisma.js';

export const getSchoolProfile = async (req, res) => {
  try {
    let profile = await prisma.schoolProfile.findUnique({
      where: { id: 1 }
    });

    if (!profile) {
      profile = await prisma.schoolProfile.create({
        data: {
          id: 1,
          schoolName: "Nama Sekolah",
          npsn: "000000",
          schoolStatus: "Negeri",
          level: "SMA",
          principalName: "-",
          principalNip: "-",
          accreditation: "A",
          curriculum: "Merdeka",
          establishedYear: 2000,
          licenseNumber: "-",
          email: "admin@school.id",
          phone: "000",
          address: "Alamat Sekolah",
          socialLinks: []
        }
      });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error Get Profile:", error);
    res.status(500).json({ error: "Gagal mengambil data profil" });
  }
};

export const updateSchoolProfile = async (req, res) => {
  try {
    const data = req.body;

    // 1. Validasi input dasar
    if (!data.schoolName || !data.email) {
      return res.status(400).json({ error: "Nama Sekolah dan Email wajib diisi" });
    }

    // 2. Ambil data LAMA untuk dibandingkan (Audit)
    const oldProfile = await prisma.schoolProfile.findUnique({
      where: { id: 1 }
    });

    // 3. Proses Update
    const updated = await prisma.schoolProfile.update({
      where: { id: 1 },
      data: {
        schoolName: data.schoolName,
        npsn: data.npsn,
        schoolStatus: data.schoolStatus,
        level: data.level,
        principalName: data.principalName,
        principalNip: data.principalNip,
        accreditation: data.accreditation,
        curriculum: data.curriculum,
        establishedYear: parseInt(data.establishedYear) || 2000,
        licenseNumber: data.licenseNumber,
        email: data.email,
        phone: data.phone,
        address: data.address,
        province: data.province,
        city: data.city,
        district: data.district,
        postalCode: data.postalCode,
        socialLinks: data.socialLinks || [],
        buildingPhoto: data.buildingPhoto, // Menambahkan kolom foto gedung
      }
    });

    // 4. CATAT KE TABEL AUDIT LOG
    // req.user didapat dari authenticateToken middleware
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        username: req.user.username || req.user.full_name || "Admin",
        role: req.user.role || "UNKNOWN",
        action: "UPDATE_SCHOOL_PROFILE",
        oldData: oldProfile, // Simpan objek data lama
        newData: updated,    // Simpan objek data baru
        ipAddress: req.ip || req.headers['x-forwarded-for'] || "0.0.0.0"
      }
    });

    res.json({ success: true, message: "Profil diperbarui dan riwayat perubahan dicatat", data: updated });
  } catch (error) {
    console.error("Error Update Profile & Audit:", error);
    res.status(500).json({ error: "Gagal menyimpan perubahan ke database" });
  }
  
};
export const getLatestLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' }
    });
    res.json(logs);
  } catch {
    res.status(500).json({ error: "Gagal menyimpan perubahan ke database" });
  }
};
