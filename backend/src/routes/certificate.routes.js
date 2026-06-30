const express = require('express');
const {
  issueCertificate,
  verifyCertificate,
  revokeCertificate,
  getCertificate,
  getMyCertificates,
} = require('../controllers/certificate.controller');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const { verifyRateLimit } = require('../middleware/rateLimit.middleware');

const router = express.Router();

// Public verify endpoint
router.get('/verify/:certId', verifyRateLimit, verifyCertificate);

// List certificates (institution sees own, admin sees all)
router.get('/', authenticate, requireRole('admin', 'institution'), getMyCertificates);

// Institution issues a certificate
router.post('/', authenticate, requireRole('institution'), issueCertificate);

// Revoke a certificate (institution owns it or admin)
router.post('/:certId/revoke', authenticate, requireRole('admin', 'institution'), revokeCertificate);

// Get a specific certificate (institution owns it or admin)
router.get('/:certId', authenticate, requireRole('admin', 'institution'), getCertificate);

module.exports = router;
