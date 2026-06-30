const crypto = require('crypto');

function canonicalize(data) {
  // Fixed key order — never derived from Object.keys() or JSON.stringify default order
  const ordered = {
    studentName: data.studentName.trim(),
    course: data.course.trim(),
    grade: data.grade.trim(),
    issueDate: data.issueDate,
    institutionId: data.institutionId,
  };
  return JSON.stringify(ordered);
}

function computeHash(data) {
  const canonical = canonicalize(data);
  return crypto.createHash('sha256').update(canonical, 'utf8').digest('hex');
}

module.exports = { canonicalize, computeHash };
