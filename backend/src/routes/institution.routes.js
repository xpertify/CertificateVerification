const express = require('express');
const { createInstitution, getInstitutions } = require('../controllers/institution.controller');
const { authenticate, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', authenticate, requireRole('admin'), getInstitutions);
router.post('/', authenticate, requireRole('admin'), createInstitution);

module.exports = router;
