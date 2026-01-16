/* global process */
import "dotenv/config";
import prisma from '../lib/prisma.ts';
import bcrypt from 'bcrypt';

async function main() {
  console.log('--- 🛡️ Memulai Reset & Seeding Database ---');
  
  try {
    // 1. Bersihkan data lama
    await prisma.schoolProfile.deleteMany(); 
    await prisma.users.deleteMany();
    console.log('✓ Database berhasil dikosongkan.');

    // 2. Persiapkan Password Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // 3. Masukkan User Admin
    await prisma.users.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        full_name: 'Administrator SIMAS',
        role: 'admin',
        is_active: true,
        identity_number: '1234567890'
      },
    });
    console.log('✓ Akun Admin berhasil dibuat.');

    // 4. Masukkan Profil Sekolah
    await prisma.schoolProfile.create({
      data: {
        id: 1,
        schoolName: 'SMK NEGERI SIMAS INDONESIA',
        npsn: '12345678',
        schoolStatus: 'NEGERI',
        level: 'SMK',
        principalName: 'Dr. Nama Kepala Sekolah, M.Pd',
        principalNip: '197001012000031001',
        accreditation: 'Terakreditasi A',
        curriculum: 'Kurikulum Merdeka',
        establishedYear: 2005,
        licenseNumber: '421.3/123/DISDIK/2005',
        email: 'info@smksimas.sch.id',
        phone: '02112345678',
        address: 'Jl. Pendidikan No. 45, Jakarta Selatan',
        province: 'DKI JAKARTA',
        city: 'KOTA ADM. JAKARTA SELATAN',
        district: 'TEBET',
        postalCode: '12810',
        socialLinks: [
          'https://instagram.com/sekolah_kita',
          'https://facebook.com/sekolah_kita'
        ]
      },
    });
    console.log('✓ Data Profil Sekolah berhasil dimasukkan.');

  } catch (error) {
    console.error('❌ Terjadi kesalahan saat seeding:', error);
    process.exit(1);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('--- 🎉 Proses Selesai ---');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });