const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/env');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = { userId: user._id, role: user.role };
    if (user.role === 'institution') {
      payload.institutionId = user.institutionId;
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, role: user.role, institutionId: user.institutionId || null });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
