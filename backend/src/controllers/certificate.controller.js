const certificateService = require('../services/certificate.service');
const Institution = require('../models/Institution');

async function issueCertificate(req, res, next) {
  try {
    const { studentName, course, grade, issueDate } = req.body;
    if (!studentName || !course || !grade || !issueDate) {
      return res.status(400).json({ error: 'studentName, course, grade, and issueDate are required' });
    }

    // Validate issueDate is not in the future
    const today = new Date().toISOString().split('T')[0];
    if (issueDate > today) {
      return res.status(400).json({ error: 'issueDate cannot be in the future' });
    }

    const institutionId = req.user.institutionId;

    const institution = await Institution.findOne({ institutionId });
    if (!institution || !institution.onChainAuthorized) {
      return res.status(403).json({ error: 'Institution not authorized on-chain' });
    }

    const result = await certificateService.issueCertificate({
      studentName,
      course,
      grade,
      issueDate,
      institutionId,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function verifyCertificate(req, res, next) {
  try {
    const { certId } = req.params;
    if (!certId || typeof certId !== 'string' || certId.trim().length === 0) {
      return res.status(400).json({ error: 'certId is required' });
    }
    const result = await certificateService.verifyCertificate(certId.trim());
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function revokeCertificate(req, res, next) {
  try {
    const { certId } = req.params;
    const result = await certificateService.revokeCertificate(certId, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getCertificate(req, res, next) {
  try {
    const { certId } = req.params;
    const cert = await certificateService.getCertificate(certId, req.user);
    res.json(cert);
  } catch (err) {
    next(err);
  }
}

async function getMyCertificates(req, res, next) {
  try {
    const Certificate = require('../models/Certificate');
    const query =
      req.user.role === 'admin'
        ? {}
        : { institutionId: req.user.institutionId };
    const certs = await Certificate.find(query).sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    next(err);
  }
}

module.exports = { issueCertificate, verifyCertificate, revokeCertificate, getCertificate, getMyCertificates };
