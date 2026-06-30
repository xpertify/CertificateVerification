import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyCertificates, revokeCertificate } from '../api/certificates.js';
import Button from '../components/ui/Button.jsx';
import Table from '../components/ui/Table.jsx';
import Badge from '../components/ui/Badge.jsx';
import LedgerHash from '../components/ui/LedgerHash.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

function StatCard({ value, label, icon }) {
  return (
    <div className="bg-surface border border-hairline rounded-card p-6">
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
      </div>
      <p className="font-display font-bold text-3xl text-ink mb-1">{value}</p>
      <p className="font-body text-sm text-slate">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const { token, role } = useAuth();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(null);

  const fetchCerts = useCallback(async () => {
    try {
      const data = await getMyCertificates(token);
      setCerts(Array.isArray(data) ? data : []);
    } catch {
      setCerts([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchCerts(); }, [fetchCerts]);

  async function handleRevoke(certId) {
    if (!window.confirm('Revoke this certificate? This action is permanent and recorded on the blockchain.')) return;
    setRevoking(certId);
    try {
      await revokeCertificate(certId, token);
      setCerts((prev) => prev.map((c) => c.certId === certId ? { ...c, revoked: true } : c));
    } catch (err) {
      alert(err.message);
    } finally {
      setRevoking(null);
    }
  }

  const certColumns = [
    {
      key: 'certId',
      header: 'Certificate ID',
      render: (val) => <LedgerHash value={val} truncate copyable />,
    },
    { key: 'studentName', header: 'Student' },
    { key: 'course', header: 'Course' },
    { key: 'grade', header: 'Grade' },
    { key: 'issueDate', header: 'Issue Date' },
    {
      key: 'revoked',
      header: 'Status',
      render: (val) => <Badge status={val ? 'revoked' : 'valid'} />,
    },
    {
      key: 'certId',
      header: 'Actions',
      render: (val, row) =>
        !row.revoked ? (
          <Button
            variant="danger"
            size="sm"
            loading={revoking === val}
            onClick={() => handleRevoke(val)}
          >
            Revoke
          </Button>
        ) : (
          <span className="font-body text-xs text-slate">—</span>
        ),
    },
  ];

  // Admin view
  if (role === 'admin') {
    return (
      <div>
        <h1 className="text-ink mb-2">Dashboard</h1>
        <p className="font-body text-sm text-slate mb-8">System overview</p>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard value={certs.length} label="Certificates Issued" icon="📄" />
          <StatCard value="—" label="Institutions Registered" icon="🏛" />
          <StatCard value="—" label="Verifications Today" icon="✓" />
        </div>
        <div className="bg-surface border border-hairline rounded-card p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-ink">Quick Actions</h2>
          </div>
          <p className="font-body text-sm text-slate mb-4">
            Manage institutions and their blockchain authorization.
          </p>
          <Link to="/institutions">
            <Button variant="primary">Manage Institutions →</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Institution view
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-ink mb-1">Dashboard</h1>
          <p className="font-body text-sm text-slate">Your issued certificates</p>
        </div>
        <div className="flex items-center gap-3">
          {loading && <LoadingSpinner size="sm" />}
          <Link to="/issue">
            <Button variant="primary">Issue New Certificate</Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard value={certs.length} label="Certificates Issued" icon="📄" />
        <StatCard value={certs.filter((c) => !c.revoked).length} label="Active" icon="✓" />
        <StatCard value={certs.filter((c) => c.revoked).length} label="Revoked" icon="⚠" />
      </div>

      <div className="bg-surface border border-hairline rounded-card p-6">
        <h2 className="text-ink mb-5">All Certificates</h2>
        {loading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
        ) : (
          <Table
            columns={certColumns}
            data={certs}
            emptyState={
              <EmptyState
                icon="📄"
                heading="No certificates yet"
                subtext="Issue your first certificate using the button above."
              />
            }
          />
        )}
      </div>
    </div>
  );
}
