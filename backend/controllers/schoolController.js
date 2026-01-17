import prisma from '../lib/prisma.js';
import fs from 'fs';
import path from 'path';

export const getSchoolProfile = async (req, res) => {
  try {
    let profile = await prisma.schoolProfile.findUnique({ where: { id: 1 } });

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
          accreditation: "Terakreditasi A",
          curriculum: "Merdeka",
          establishedYear: 2000,
          email: "admin@school.id",
          phone: "000",
          address: "Alamat Sekolah",
          socialLinks: []
        }
      });
    }
    res.json(profile);
  } catch (err) {
    console.error("Error Get Profile:", err);
    res.status(500).json({ error: "Gagal mengambil data profil" });
  }
};

export const updateSchoolProfile = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;

    // Ambil data lama untuk audit log dan penghapusan file
    const oldProfile = await prisma.schoolProfile.findUnique({ where: { id: 1 } });

    const parsedSocialLinks = typeof data.socialLinks === 'string'
      ? JSON.parse(data.socialLinks)
      : data.socialLinks;

    const updateData = {
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
      socialLinks: parsedSocialLinks || [],
    };

    // Fungsi pembantu untuk hapus file lama jika ada upload baru
    const deleteOldFile = (filename) => {
      if (filename) {
        const fullPath = path.join('uploads', filename);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    };

    // Mapping & Hapus file lama jika ada file baru masuk
    if (files['schoolLogo']) {
      deleteOldFile(oldProfile?.schoolLogo);
      updateData.schoolLogo = files['schoolLogo'][0].filename;
    }
    if (files['foundationLogo']) {
      deleteOldFile(oldProfile?.foundationLogo);
      updateData.foundationLogo = files['foundationLogo'][0].filename;
    }
    if (files['buildingPhoto']) {
      deleteOldFile(oldProfile?.buildingPhoto);
      updateData.buildingPhoto = files['buildingPhoto'][0].filename;
    }

    const updated = await prisma.schoolProfile.update({
      where: { id: 1 },
      data: updateData
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        username: req.user.username || req.user.full_name || "Admin",
        role: req.user.role || "UNKNOWN",
        action: "UPDATE_SCHOOL_PROFILE",
        oldData: oldProfile,
        newData: updated,
        ipAddress: req.ip || "0.0.0.0"
      }
    });

    res.json({ success: true, message: "Profil diperbarui", data: updated });
  } catch (err) {
    console.error("Error Update Profile:", err);
    res.status(500).json({ error: "Gagal menyimpan perubahan" });
  }
};