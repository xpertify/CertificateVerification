import React, { useState } from 'react';

export default function LedgerHash({ value = '', truncate = false, copyable = false }) {
  const [copied, setCopied] = useState(false);

  const display =
    truncate && value.length > 20
      ? `${value.slice(0, 8)}…${value.slice(-8)}`
      : value;

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="font-mono text-mono tracking-[0.01em] text-ink break-all"
        title={truncate ? value : undefined}
      >
        {display}
      </span>
      {copyable && (
        <button
          onClick={handleCopy}
          className="flex-shrink-0 font-body text-xs text-slate hover:text-brass transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brass"
          title="Copy to clipboard"
          aria-label="Copy to clipboard"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      )}
    </span>
  );
}
