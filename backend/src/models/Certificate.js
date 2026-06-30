const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certId: { type: String, required: true, unique: true, index: true },
  studentName: { type: String, required: true },
  course: { type: String, required: true },
  grade: { type: String, required: true },
  issueDate: { type: String, required: true },
  institutionId: { type: String, required: true },
  dataHash: { type: String, required: true },
  chainTxHash: { type: String, required: true },
  revoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Certificate', certificateSchema);
