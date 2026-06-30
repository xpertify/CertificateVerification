import React, { useState } from 'react';
import { verifyCertificate } from '../api/certificates.js';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import ResultCard from '../components/ui/ResultCard.jsx';

function NetworkErrorCard({ message }) {
  return (
    <div className="rounded-card border-2 border-ink/20 bg-surface p-6 animate-fadein">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-slate text-xl" aria-hidden="true">⚠</span>
        <h2 className="font-display font-semibold text-xl text-ink">Server Error</h2>
      </div>
      <p className="font-body text-sm text-slate">
        Unable to reach the server or an unexpected error occurred. Please try again.
      </p>
      {message && (
        <p className="font-mono text-xs text-slate mt-2 break-all">{message}</p>
      )}
    </div>
  );
}

export default function Verify() {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState(null);
  const [networkError, setNetworkError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setResult(null);
    setNetworkError('');

    const id = certId.trim();
    if (!id) return;

    setLoading(true);
    try {
      const data = await verifyCertificate(id);
      setResult(data);
    } catch (err) {
      setNetworkError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-verify mx-auto">
      <div className="mb-8">
        <h1 className="text-ink mb-2">Verify a Certificate</h1>
        <p className="font-body text-base text-slate leading-relaxed">
          Enter a Certificate ID to check its authenticity against the Ethereum blockchain.
          No account required.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Certificate ID"
          id="certId"
          type="text"
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
          placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
          autoComplete="off"
          spellCheck={false}
        />
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={!certId.trim()}
          size="md"
        >
          {loading ? 'Checking blockchain record…' : 'Verify'}
        </Button>
      </form>

      <div className="mt-8">
        {result && <ResultCard result={result.result} data={result} />}
        {networkError && <NetworkErrorCard message={networkError} />}
      </div>

      <p className="font-body text-xs text-slate mt-8 pt-6 border-t border-hairline leading-relaxed">
        Verification reads directly from the Ethereum blockchain. Results are real-time
        and cannot be forged. Each verification attempt is logged for audit purposes.
      </p>
    </div>
  );
}
