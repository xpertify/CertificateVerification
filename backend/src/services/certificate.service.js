const { v4: uuidv4 } = require('uuid');
const { computeHash } = require('./hash.service');
const chainService = require('./chain.service');
const Certificate = require('../models/Certificate');
const VerificationLog = require('../models/VerificationLog');
const Institution = require('../models/Institution');

async function issueCertificate({ studentName, course, grade, issueDate, institutionId }) {
  const certId = uuidv4();
  const dataHash = computeHash({ studentName, course, grade, issueDate, institutionId });

  let txHash;
  try {
    txHash = await chainService.issueCertificate(certId, institutionId, dataHash);
  } catch (err) {
    throw Object.assign(
      new Error(`Issuance failed on-chain: ${err.message}`),
      { statusCode: 502 }
    );
  }

  try {
    await Certificate.create({
      certId,
      studentName,
      course,
      grade,
      issueDate,
      institutionId,
      dataHash,
      chainTxHash: txHash,
    });
  } catch (err) {
    console.error(
      `CRITICAL: Certificate issued on-chain but Mongo write failed. certId=${certId} txHash=${txHash}`,
      err
    );
    throw Object.assign(
      new Error(
        `Issued on-chain but failed to save — contact admin with certificate ID: ${certId} and transaction: ${txHash}`
      ),
      { statusCode: 500 }
    );
  }

  return { certId, chainTxHash: txHash };
}

async function verifyCertificate(certId) {
  const cert = await Certificate.findOne({ certId });
  if (!cert) {
    await VerificationLog.create({ certId, result: 'not_found' });
    return { result: 'not_found' };
  }

  const recomputedHash = computeHash({
    studentName: cert.studentName,
    course: cert.course,
    grade: cert.grade,
    issueDate: cert.issueDate,
    institutionId: cert.institutionId,
  });

  let chainRecord;
  try {
    chainRecord = await chainService.getCertificate(certId);
  } catch (err) {
    throw Object.assign(new Error(`Blockchain read failed: ${err.message}`), { statusCode: 502 });
  }

  if (!chainRecord.exists) {
    console.warn(`Data inconsistency: certId ${certId} exists in Mongo but not on-chain`);
    await VerificationLog.create({ certId, result: 'not_found' });
    return { result: 'not_found' };
  }

  if (chainRecord.revoked) {
    await VerificationLog.create({ certId, result: 'revoked' });
    const institution = await Institution.findOne({ institutionId: cert.institutionId });
    return {
      result: 'revoked',
      institutionName: institution ? institution.name : cert.institutionId,
      issueDate: cert.issueDate,
    };
  }

  const onChainHash = chainRecord.dataHash.startsWith('0x')
    ? chainRecord.dataHash.slice(2)
    : chainRecord.dataHash;

  if (recomputedHash !== onChainHash) {
    await VerificationLog.create({ certId, result: 'invalid' });
    return { result: 'invalid', computedHash: recomputedHash, onChainHash };
  }

  await VerificationLog.create({ certId, result: 'valid' });
  const institution = await Institution.findOne({ institutionId: cert.institutionId });
  return {
    result: 'valid',
    institutionName: institution ? institution.name : cert.institutionId,
    issueDate: cert.issueDate,
    course: cert.course,
    studentName: cert.studentName,
    computedHash: recomputedHash,
    onChainHash,
  };
}

async function revokeCertificate(certId, requestingUser) {
  const cert = await Certificate.findOne({ certId });
  if (!cert) {
    throw Object.assign(new Error('Certificate not found'), { statusCode: 404 });
  }

  if (requestingUser.role === 'institution' && cert.institutionId !== requestingUser.institutionId) {
    throw Object.assign(
      new Error('Not authorized: you can only revoke your own certificates'),
      { statusCode: 403 }
    );
  }

  try {
    await chainService.revokeCertificate(certId);
  } catch (err) {
    throw Object.assign(new Error(`Revocation failed on-chain: ${err.message}`), { statusCode: 502 });
  }

  await Certificate.updateOne({ certId }, { revoked: true });

  return { certId, revoked: true };
}

async function getCertificate(certId, requestingUser) {
  const cert = await Certificate.findOne({ certId });
  if (!cert) {
    throw Object.assign(new Error('Certificate not found'), { statusCode: 404 });
  }

  if (requestingUser.role === 'institution' && cert.institutionId !== requestingUser.institutionId) {
    throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
  }

  return cert;
}

module.exports = { issueCertificate, verifyCertificate, revokeCertificate, getCertificate };
