import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { addInstitution, getInstitutions } from '../api/institutions.js';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Table from '../components/ui/Table.jsx';
import Badge from '../components/ui/Badge.jsx';
import LedgerHash from '../components/ui/LedgerHash.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

const columns = [
  { key: 'name', header: 'Institution Name' },
  { key: 'address', header: 'Address' },
  {
    key: 'institutionId',
    header: 'Institution ID',
    render: (val) => <LedgerHash value={val} truncate copyable />,
  },
  {
    key: 'onChainAuthorized',
    header: 'Status',
    render: (val) => <Badge status={val ? 'authorized' : 'pending'} />,
  },
  {
    key: 'createdAt',
    header: 'Date Added',
    render: (val) => (val ? new Date(val).toLocaleDateString() : '—'),
  },
];

export default function Institutions() {
  const { token } = useAuth();
  const [form, setForm] = useState({ name: '', address: '', contactEmail: '', contactPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  const fetchInstitutions = useCallback(async () => {
    try {
      const data = await getInstitutions(token);
      setInstitutions(data);
    } catch {
      // non-fatal — table just stays empty
    } finally {
      setListLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchInstitutions(); }, [fetchInstitutions]);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Institution name is required';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.contactEmail.trim()) errs.contactEmail = 'Contact email is required';
    if (!form.contactPassword || form.contactPassword.length < 8)
      errs.contactPassword = 'Password must be at least 8 characters';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    setSuccess(null);
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const data = await addInstitution(
        { name: form.name.trim(), address: form.address.trim(), contactEmail: form.contactEmail.trim(), contactPassword: form.contactPassword },
        token
      );
      setSuccess(data);
      setForm({ name: '', address: '', contactEmail: '', contactPassword: '' });
      fetchInstitutions();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-ink mb-2">Institutions</h1>
        <p className="font-body text-sm text-slate">
          Register institutions and authorize them on the blockchain to issue certificates.
        </p>
      </div>

      {/* Add Institution form */}
      <div className="bg-surface border border-hairline rounded-card p-6 mb-10">
        <h2 className="text-ink mb-5">Add Institution</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Institution Name"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              error={errors.name}
              placeholder="University of Lagos"
            />
            <Input
              label="Physical Address"
              value={form.address}
              onChange={(e) => setField('address', e.target.value)}
              error={errors.address}
              placeholder="University Road, Akoka, Lagos"
            />
            <Input
              label="Login Email"
              type="email"
              value={form.contactEmail}
              onChange={(e) => setField('contactEmail', e.target.value)}
              error={errors.contactEmail}
              placeholder="admin@institution.edu"
            />
            <Input
              label="Login Password"
              type="password"
              value={form.contactPassword}
              onChange={(e) => setField('contactPassword', e.target.value)}
              error={errors.contactPassword}
              placeholder="Min 8 characters"
            />
          </div>

          {apiError && (
            <div className="mt-4 bg-invalid-tint border border-invalid/30 text-invalid rounded-btn px-3 py-2 text-sm font-body" role="alert">
              {apiError}
            </div>
          )}

          {success && (
            <div className="mt-4 bg-verified-tint border border-verified/30 rounded-card p-4 animate-fadein">
              <p className="font-body text-sm font-medium text-verified mb-3">
                Institution added and authorized on the blockchain ✓
              </p>
              <div className="space-y-2">
                <div className="flex gap-3 items-center">
                  <span className="font-body text-xs text-slate w-32">Institution ID</span>
                  <LedgerHash value={success.institutionId} copyable />
                </div>
                <div className="flex gap-3 items-center">
                  <span className="font-body text-xs text-slate w-32">Login email</span>
                  <span className="font-body text-sm text-ink">{form.contactEmail || success.contactEmail}</span>
                </div>
              </div>
              {success.chainTxHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${success.chainTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block font-body text-xs text-brass hover:underline"
                >
                  View authorization on Etherscan ↗
                </a>
              )}
            </div>
          )}

          <div className="mt-5">
            <Button type="submit" variant="primary" loading={loading}>
              {loading ? 'Authorizing on blockchain…' : 'Add Institution & Authorize on Blockchain'}
            </Button>
          </div>
        </form>
      </div>

      {/* Institutions table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-ink">Registered Institutions</h2>
          {listLoading && <LoadingSpinner size="sm" />}
        </div>
        <div className="bg-surface border border-hairline rounded-card p-6">
          <Table
            columns={columns}
            data={institutions}
            emptyState={
              <EmptyState
                icon="🏛"
                heading="No institutions yet"
                subtext="Add the first institution using the form above."
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
