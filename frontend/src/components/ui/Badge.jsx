import React from 'react';

const config = {
  valid:     { icon: '✓', label: 'Valid',     bg: 'bg-verified-tint', text: 'text-verified', border: 'border-verified/30' },
  revoked:   { icon: '⚠', label: 'Revoked',   bg: 'bg-revoked-tint',  text: 'text-revoked',  border: 'border-revoked/30'  },
  invalid:   { icon: '✗', label: 'Invalid',   bg: 'bg-invalid-tint',  text: 'text-invalid',  border: 'border-invalid/30'  },
  not_found: { icon: '—', label: 'Not Found', bg: 'bg-neutral-tint',  text: 'text-neutral',  border: 'border-neutral/30'  },
  authorized:{ icon: '✓', label: 'Authorized',bg: 'bg-verified-tint', text: 'text-verified', border: 'border-verified/30' },
  pending:   { icon: '·', label: 'Pending',   bg: 'bg-neutral-tint',  text: 'text-neutral',  border: 'border-neutral/30'  },
};

export default function Badge({ status }) {
  const c = config[status] ?? config.not_found;
  return (
    <span
      className={`inline-flex items-center gap-1 font-body font-medium text-xs px-2.5 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}
    >
      <span aria-hidden="true">{c.icon}</span>
      {c.label}
    </span>
  );
}
