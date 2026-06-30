const mongoose = require('mongoose');

const verificationLogSchema = new mongoose.Schema({
  certId: { type: String, required: true },
  result: {
    type: String,
    enum: ['valid', 'invalid', 'revoked', 'not_found'],
    required: true,
  },
  checkedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VerificationLog', verificationLogSchema);
