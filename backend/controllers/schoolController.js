import prisma from '../lib/prisma.js';

// Pastikan ada kata 'export' di depan const
export const getSchoolProfile = async (req, res) => {
  try {
    let profile = await prisma.schoolProfile.findUnique({
      where: { id: 1 }
    });

    if (!profile) {
      // Jika data tidak ada, buatkan data default agar aplikasi tidak crash
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

// Pastikan ada kata 'export' di depan const
export const updateSchoolProfile = async (req, res) => {
  try {
    const data = req.body;

    // Proteksi Keamanan: Validasi input dasar
    if (!data.schoolName || !data.email) {
      return res.status(400).json({ error: "Nama Sekolah dan Email wajib diisi" });
    }

    const updated = await prisma.schoolProfile.upsert({
      where: { id: 1 },
      update: {
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
        socialLinks: data.socialLinks || [],
      },
      create: {
        id: 1,
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
        socialLinks: data.socialLinks || [],
      }
    });

    res.json(updated);
  } catch (error) {
    console.error("Error Update Profile:", error);
    res.status(500).json({ error: "Gagal menyimpan perubahan ke database" });
  }
};