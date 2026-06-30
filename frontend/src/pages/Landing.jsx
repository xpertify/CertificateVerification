import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';

function StepCard({ number, icon, heading, description }) {
  return (
    <div className="bg-surface border border-hairline rounded-card p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-xs text-slate bg-parchment border border-hairline rounded-full w-6 h-6 flex items-center justify-center">
          {number}
        </span>
        <span className="text-xl" aria-hidden="true">{icon}</span>
      </div>
      <h3 className="font-display font-semibold text-base text-ink mb-2">{heading}</h3>
      <p className="font-body text-sm text-slate leading-relaxed">{description}</p>
    </div>
  );
}

function TrustPill({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4 border-r border-hairline last:border-r-0">
      <span className="text-xl" aria-hidden="true">{icon}</span>
      <span className="font-mono text-xs text-ink font-medium">{value}</span>
      <span className="font-body text-xs text-slate">{label}</span>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-12 items-center py-8">
        <div>
          <span className="inline-block font-mono text-xs text-brass border border-brass/40 bg-brass/5 px-3 py-1 rounded-full mb-6">
            Blockchain-Anchored · SHA-256 · Ethereum
          </span>
          <h1 className="text-ink mb-4 leading-tight">
            Tamper-Proof Academic Certificates, Anchored on the Blockchain.
          </h1>
          <p className="font-body text-base text-slate leading-relaxed mb-8">
            Every certificate issued through CertVerify is cryptographically sealed on
            the Ethereum blockchain. Authenticity can be verified by anyone, anywhere,
            instantly — with no login required.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/verify">
              <Button variant="primary" size="md">Verify a Certificate</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="md">Institution Login</Button>
            </Link>
          </div>
        </div>

        {/* Visual element — ledger motif */}
        <div className="hidden md:block bg-surface border border-hairline rounded-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-hairline">
            <span className="w-2 h-2 rounded-full bg-verified" />
            <span className="font-body text-xs text-slate font-medium">Certificate verified</span>
          </div>
          <div className="space-y-2">
            {[
              ['Student', 'Adaeze Okonkwo'],
              ['Course', 'B.Sc. Computer Science'],
              ['Issued by', 'University of Lagos'],
              ['Issue date', '2025-07-15'],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3 text-sm">
                <span className="font-body text-slate w-24 flex-shrink-0">{k}</span>
                <span className="font-body font-medium text-ink">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-hairline space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-body text-xs text-slate w-24">Computed hash</span>
              <span className="font-mono text-xs text-verified">a3f5c8d1…e92c</span>
            </div>
            <div className="flex items-center gap-2 pl-24">
              <span className="font-mono text-xs font-bold text-verified">‖  MATCH</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-body text-xs text-slate w-24">On-chain hash</span>
              <span className="font-mono text-xs text-ink">a3f5c8d1…e92c</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="text-ink mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <StepCard
            number="1"
            icon="📝"
            heading="Issue"
            description="An authorized institution submits student certificate data. A SHA-256 cryptographic hash of that data is computed and permanently written to the Ethereum blockchain."
          />
          <StepCard
            number="2"
            icon="🔒"
            heading="Anchor"
            description="The certificate metadata is stored securely in our database. The blockchain record is the immutable source of truth — it cannot be altered after issuance."
          />
          <StepCard
            number="3"
            icon="✓"
            heading="Verify"
            description="Anyone enters a Certificate ID. The system recomputes the hash from stored data and compares it against the blockchain record in real time. No account required."
          />
        </div>
      </section>

      {/* Trust signals */}
      <section className="bg-surface border border-hairline rounded-card overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-hairline">
          <TrustPill icon="⛓" value="Ethereum" label="Blockchain" />
          <TrustPill icon="🔐" value="SHA-256" label="Hash algorithm" />
          <TrustPill icon="🌐" value="Sepolia" label="Testnet" />
          <TrustPill icon="⚡" value="Real-time" label="Verification" />
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-surface border border-t-2 border-brass/30 rounded-card p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-ink mb-1">Ready to check a certificate?</h2>
          <p className="font-body text-sm text-slate">No account required. Enter a Certificate ID and get an instant result.</p>
        </div>
        <Link to="/verify">
          <Button variant="primary" size="md">Verify Now →</Button>
        </Link>
      </section>
    </div>
  );
}
