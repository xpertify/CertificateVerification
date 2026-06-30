import React from 'react';
import LedgerHash from './LedgerHash.jsx';

function DetailRow({ label, value }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="font-body text-slate min-w-[100px] flex-shrink-0">{label}</span>
      <span className="font-body font-medium text-ink">{value}</span>
    </div>
  );
}

function LedgerStrip({ computedHash, onChainHash, match }) {
  return (
    <div className="mt-5 rounded-card border border-hairline bg-surface overflow-hidden">
      <div className="px-4 py-2 border-b border-hairline bg-parchment">
        <span className="font-body text-xs font-medium text-slate uppercase tracking-wide">
          Cryptographic verification
        </span>
      </div>
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-start gap-3">
          <span className="font-body text-xs text-slate w-[110px] flex-shrink-0 pt-0.5">Computed hash</span>
          <LedgerHash value={computedHash || '—'} />
        </div>
        <div className="flex items-center gap-3 py-0.5">
          <span className="w-[110px] flex-shrink-0" />
          <span
            className={`font-mono text-sm font-bold ${match ? 'text-verified' : 'text-invalid'}`}
            aria-label={match ? 'hashes match' : 'hashes do not match'}
          >
            {match ? '‖  MATCH' : '≠  MISMATCH'}
          </span>
        </div>
        <div className="flex items-start gap-3">
          <span className="font-body text-xs text-slate w-[110px] flex-shrink-0 pt-0.5">On-chain hash</span>
          <LedgerHash value={onChainHash || '—'} />
        </div>
      </div>
    </div>
  );
}

export default function ResultCard({ result, data }) {
  if (result === 'valid') {
    return (
      <div className="rounded-card border-2 border-verified bg-verified-tint p-6 animate-fadein">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-verified text-xl" aria-hidden="true">✓</span>
          <h2 className="font-display font-semibold text-xl text-verified">Valid Certificate</h2>
        </div>
        <div className="space-y-2">
          <DetailRow label="Student" value={data.studentName} />
          <DetailRow label="Course" value={data.course} />
          <DetailRow label="Issued by" value={data.institutionName} />
          <DetailRow label="Issue date" value={data.issueDate} />
        </div>
        {data.computedHash && data.onChainHash && (
          <LedgerStrip
            computedHash={data.computedHash}
            onChainHash={data.onChainHash}
            match={true}
          />
        )}
      </div>
    );
  }

  if (result === 'invalid') {
    return (
      <div className="rounded-card border-2 border-invalid bg-invalid-tint p-6 animate-fadein">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-invalid text-xl" aria-hidden="true">✗</span>
          <h2 className="font-display font-semibold text-xl text-invalid">Invalid Certificate</h2>
        </div>
        <p className="font-body text-sm text-invalid mb-1">
          Data does not match the blockchain record.
        </p>
        <p className="font-body text-xs text-slate">
          This certificate may have been tampered with. No student or institution
          details are shown when data integrity cannot be confirmed.
        </p>
        {data.computedHash && data.onChainHash && (
          <LedgerStrip
            computedHash={data.computedHash}
            onChainHash={data.onChainHash}
            match={false}
          />
        )}
      </div>
    );
  }

  if (result === 'revoked') {
    return (
      <div className="rounded-card border-2 border-revoked bg-revoked-tint p-6 animate-fadein">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-revoked text-xl" aria-hidden="true">⚠</span>
          <h2 className="font-display font-semibold text-xl text-revoked">Certificate Revoked</h2>
        </div>
        <p className="font-body text-sm text-revoked mb-4">
          This certificate has been explicitly revoked by the issuing institution.
        </p>
        <div className="space-y-2">
          {data.institutionName && <DetailRow label="Issued by" value={data.institutionName} />}
          {data.issueDate && <DetailRow label="Issue date" value={data.issueDate} />}
        </div>
      </div>
    );
  }

  if (result === 'not_found') {
    return (
      <div className="rounded-card border border-hairline bg-surface p-6 animate-fadein">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-neutral text-xl" aria-hidden="true">—</span>
          <h2 className="font-display font-semibold text-xl text-neutral">Not Found</h2>
        </div>
        <p className="font-body text-sm text-slate">
          No certificate found with this ID. Please check the ID and try again.
        </p>
      </div>
    );
  }

  return null;
}
