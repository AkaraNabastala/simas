/* global process */
import "dotenv/config";
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts'; 
import bcrypt from 'bcrypt';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Memulai Reset Database ---');
  
  try {
    await prisma.schoolProfile.deleteMany(); 
    await prisma.users.deleteMany();
    console.log('✓ Data lama berhasil dibersihkan.');
  } catch (error) {
    console.log('Catatan: Tabel mungkin kosong.');
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 1. Seed User Admin
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
  console.log('✓ User Admin berhasil dibuat.');

  // 2. Seed Profil Sekolah (Lengkap sesuai Model)
  await prisma.schoolProfile.create({
    data: {
      id: 1,
      schoolName: 'SMK NEGERI SIMAS INDONESIA',
      npsn: '12345678',
      schoolStatus: 'NEGERI',
      level: 'SMK',
      principalName: 'Dr. Nama Kepala Sekolah, M.Pd',
      principalNip: '197001012000031001',
      accreditation: 'A',
      curriculum: 'Kurikulum Merdeka',
      establishedYear: 2005,
      licenseNumber: '421.3/123/DISDIK/2005',
      email: 'info@smksimas.sch.id',
      phone: '02112345678',
      address: 'Jl. Pendidikan No. 45, Jakarta Selatan',
      // Properti opsional (tanda tanya di model) boleh dikosongkan/null
      schoolLogo: null,
      foundationLogo: null,
      buildingPhoto: null,
      socialLinks: ['https://instagram.com/sekolah_kita', 'https://facebook.com/sekolah_kita']
    },
  });
  console.log('✓ Profil Sekolah berhasil dibuat.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log('--- Seeding Selesai ---');
  })
  .catch(async (e) => {
    console.error('Error saat seeding:', e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });