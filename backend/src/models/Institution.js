const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  institutionId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  onChainAuthorized: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Institution', institutionSchema);
