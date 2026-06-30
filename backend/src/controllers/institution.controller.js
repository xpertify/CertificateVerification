const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Institution = require('../models/Institution');
const User = require('../models/User');
const chainService = require('../services/chain.service');

async function createInstitution(req, res, next) {
  try {
    const { name, address, contactEmail, contactPassword } = req.body;
    if (!name || !address || !contactEmail || !contactPassword) {
      return res.status(400).json({ error: 'name, address, contactEmail, and contactPassword are required' });
    }
    if (contactPassword.length < 8) {
      return res.status(400).json({ error: 'contactPassword must be at least 8 characters' });
    }

    const existing = await User.findOne({ email: contactEmail.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const institutionId = uuidv4();

    let txHash;
    try {
      txHash = await chainService.addInstitution(institutionId);
    } catch (err) {
      return res.status(502).json({ error: `Failed to authorize institution on-chain: ${err.message}` });
    }

    const institution = await Institution.create({
      institutionId,
      name,
      address,
      onChainAuthorized: true,
    });

    const passwordHash = await bcrypt.hash(contactPassword, 10);
    await User.create({
      name,
      email: contactEmail.toLowerCase(),
      passwordHash,
      role: 'institution',
      institutionId,
    });

    res.status(201).json({
      institutionId: institution.institutionId,
      name: institution.name,
      onChainAuthorized: institution.onChainAuthorized,
      chainTxHash: txHash,
    });
  } catch (err) {
    next(err);
  }
}

async function getInstitutions(req, res, next) {
  try {
    const institutions = await Institution.find({}).sort({ createdAt: -1 });
    res.json(institutions);
  } catch (err) {
    next(err);
  }
}

module.exports = { createInstitution, getInstitutions };
