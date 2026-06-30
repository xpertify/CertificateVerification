/**
 * Seed script — run after deploying the contract and starting the backend.
 * Usage: node scripts/seed.js
 *
 * Creates: 1 admin, 2 institutions, 5 certificates.
 * One certificate is tampered after seeding to demonstrate fraud detection.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Load models
const User = require('../backend/src/models/User');
const Institution = require('../backend/src/models/Institution');
const Certificate = require('../backend/src/models/Certificate');

// Load services
const chainService = require('../backend/src/services/chain.service');
const { computeHash } = require('../backend/src/services/hash.service');

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@certverify.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin1234!';

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // --- Admin user ---
  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({ name: 'System Admin', email: ADMIN_EMAIL, passwordHash, role: 'admin' });
    console.log(`Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } else {
    console.log('Admin already exists, skipping');
  }

  // --- Institutions ---
  const institutions = [
    {
      name: 'University of Lagos',
      address: 'University Road, Akoka, Lagos',
      email: 'unilag@certverify.com',
      password: 'Unilag1234!',
    },
    {
      name: 'Obafemi Awolowo University',
      address: 'Ile-Ife, Osun State',
      email: 'oau@certverify.com',
      password: 'OAU12345!',
    },
  ];

  const createdInstitutions = [];

  for (const inst of institutions) {
    const existing = await Institution.findOne({ name: inst.name });
    if (existing) {
      console.log(`Institution already exists: ${inst.name}`);
      createdInstitutions.push(existing);
      continue;
    }

    const institutionId = uuidv4();
    const txHash = await chainService.addInstitution(institutionId);
    console.log(`Institution authorized on-chain: ${inst.name} (txHash: ${txHash})`);

    const institution = await Institution.create({
      institutionId,
      name: inst.name,
      address: inst.address,
      onChainAuthorized: true,
    });

    const passwordHash = await bcrypt.hash(inst.password, 10);
    await User.create({
      name: inst.name,
      email: inst.email,
      passwordHash,
      role: 'institution',
      institutionId,
    });

    console.log(`Institution user created: ${inst.email} / ${inst.password}`);
    createdInstitutions.push(institution);
  }

  // --- Certificates ---
  const certData = [
    { studentName: 'Adaeze Okonkwo', course: 'B.Sc. Computer Science', grade: 'First Class Honours', issueDate: '2025-07-15', instIndex: 0 },
    { studentName: 'Emeka Nwosu', course: 'B.Eng. Electrical Engineering', grade: 'Second Class Upper', issueDate: '2025-07-15', instIndex: 0 },
    { studentName: 'Fatimah Bello', course: 'B.Sc. Mathematics', grade: 'First Class Honours', issueDate: '2025-11-20', instIndex: 1 },
    { studentName: 'Chidi Obi', course: 'LL.B Law', grade: 'Second Class Upper', issueDate: '2025-11-20', instIndex: 1 },
    { studentName: 'Ngozi Eze', course: 'B.Sc. Biochemistry', grade: 'Second Class Lower', issueDate: '2025-11-20', instIndex: 1 },
  ];

  const issuedCertIds = [];

  for (const cd of certData) {
    const inst = createdInstitutions[cd.instIndex];
    if (!inst) continue;

    const existingCert = await Certificate.findOne({ studentName: cd.studentName, institutionId: inst.institutionId });
    if (existingCert) {
      console.log(`Certificate already exists for ${cd.studentName}, skipping`);
      issuedCertIds.push(existingCert.certId);
      continue;
    }

    const certId = uuidv4();
    const dataHash = computeHash({
      studentName: cd.studentName,
      course: cd.course,
      grade: cd.grade,
      issueDate: cd.issueDate,
      institutionId: inst.institutionId,
    });

    const txHash = await chainService.issueCertificate(certId, inst.institutionId, dataHash);
    await Certificate.create({
      certId,
      studentName: cd.studentName,
      course: cd.course,
      grade: cd.grade,
      issueDate: cd.issueDate,
      institutionId: inst.institutionId,
      dataHash,
      chainTxHash: txHash,
    });

    console.log(`Certificate issued: ${cd.studentName} — certId: ${certId}`);
    issuedCertIds.push(certId);
  }

  // --- Tamper one certificate for demo fraud detection ---
  // The LAST certificate's studentName is altered in Mongo so verification returns Invalid/Tampered
  if (issuedCertIds.length > 0) {
    const tamperedId = issuedCertIds[issuedCertIds.length - 1];
    await Certificate.updateOne(
      { certId: tamperedId },
      { studentName: 'TAMPERED NAME — FRAUD DEMO' }
    );
    console.log(`\nTampered certificate for fraud demo: certId = ${tamperedId}`);
    console.log('Verifying this certId will return: Invalid / Tampered\n');
  }

  console.log('\n=== Seed complete ===');
  console.log('Admin login:', ADMIN_EMAIL, '/', ADMIN_PASSWORD);
  institutions.forEach(i => console.log(`Institution login: ${i.email} / ${i.password}`));
  console.log('\nCertificate IDs issued:');
  issuedCertIds.forEach((id, i) => console.log(`  ${i + 1}. ${id}${i === issuedCertIds.length - 1 ? ' (TAMPERED — use for fraud demo)' : ''}`));

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
