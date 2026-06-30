import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { issueCertificate } from '../api/certificates.js';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import LedgerHash from '../components/ui/LedgerHash.jsx';

export default function IssueCertificate() {
  const { token } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({ studentName: '', course: '', grade: '', issueDate: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(null);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.studentName.trim()) errs.studentName = 'Student name is required';
    if (!form.course.trim()) errs.course = 'Course is required';
    if (!form.grade.trim()) errs.grade = 'Grade is required';
    if (!form.issueDate) errs.issueDate = 'Issue date is required';
    else if (form.issueDate > today) errs.issueDate = 'Issue date cannot be in the future';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const data = await issueCertificate(
        { studentName: form.studentName.trim(), course: form.course.trim(), grade: form.grade.trim(), issueDate: form.issueDate },
        token
      );
      setSuccess(data);
      setForm({ studentName: '', course: '', grade: '', issueDate: '' });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-ink mb-2">Issue Certificate</h1>
        <p className="font-body text-sm text-slate">
          Certificate data will be cryptographically hashed and permanently recorded on
          the Ethereum blockchain.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Form */}
        <div className="bg-surface border border-hairline rounded-card p-6">
          <h2 className="text-ink mb-5">Certificate Details</h2>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Student Full Name"
              value={form.studentName}
              onChange={(e) => setField('studentName', e.target.value)}
              error={errors.studentName}
              placeholder="e.g. Adaeze Okonkwo"
            />
            <Input
              label="Course / Program"
              value={form.course}
              onChange={(e) => setField('course', e.target.value)}
              error={errors.course}
              placeholder="e.g. B.Sc. Computer Science"
            />
            <Input
              label="Grade / Result"
              value={form.grade}
              onChange={(e) => setField('grade', e.target.value)}
              error={errors.grade}
              placeholder="e.g. First Class Honours"
            />
            <Input
              label="Issue Date"
              type="date"
              value={form.issueDate}
              max={today}
              onChange={(e) => setField('issueDate', e.target.value)}
              error={errors.issueDate}
            />

            {apiError && (
              <div className="bg-invalid-tint border border-invalid/30 text-invalid rounded-btn px-3 py-2 text-sm font-body" role="alert">
                {apiError}
              </div>
            )}

            <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
              {loading ? 'Submitting to blockchain…' : 'Issue Certificate'}
            </Button>
          </form>
          <p className="font-body text-xs text-slate mt-3">
            This action sends a transaction to the Ethereum blockchain. It may take
            15–30 seconds.
          </p>
        </div>

        {/* Success panel */}
        {success ? (
          <div className="bg-verified-tint border-2 border-verified rounded-card p-6 animate-fadein">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-verified text-xl" aria-hidden="true">✓</span>
              <h2 className="text-verified">Certificate Issued</h2>
            </div>
            <p className="font-body text-sm text-verified/80 mb-5">
              The certificate has been successfully recorded on the Ethereum blockchain.
            </p>

            <div className="space-y-4">
              <div>
                <span className="font-body text-xs font-medium text-slate uppercase tracking-wide block mb-1.5">
                  Certificate ID
                </span>
                <div className="bg-surface border border-hairline rounded-btn p-3">
                  <LedgerHash value={success.certId} copyable />
                </div>
              </div>

              <div>
                <span className="font-body text-xs font-medium text-slate uppercase tracking-wide block mb-1.5">
                  Blockchain Transaction
                </span>
                <a
                  href={`https://sepolia.etherscan.io/tx/${success.chainTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-brass hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brass break-all"
                >
                  View on Sepolia Etherscan ↗
                </a>
              </div>
            </div>

            <p className="font-body text-xs text-slate mt-5 pt-4 border-t border-verified/20">
              Share the Certificate ID with the certificate holder so they can verify it at
              any time using the public Verify page.
            </p>

            <button
              onClick={() => setSuccess(null)}
              className="mt-4 font-body text-xs text-slate hover:text-brass transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brass"
            >
              Issue another certificate
            </button>
          </div>
        ) : (
          <div className="bg-surface border border-hairline rounded-card p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
            <span className="text-3xl text-hairline mb-3" aria-hidden="true">⛓</span>
            <p className="font-body text-sm text-slate">
              After issuance, the certificate ID and blockchain transaction link will
              appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
