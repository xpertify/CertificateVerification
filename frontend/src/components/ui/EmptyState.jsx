import React from 'react';

export default function EmptyState({ icon = '○', heading, subtext }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-3xl text-slate/40 mb-3" aria-hidden="true">{icon}</span>
      {heading && (
        <p className="font-body font-medium text-slate text-sm">{heading}</p>
      )}
      {subtext && (
        <p className="font-body text-slate/70 text-xs mt-1">{subtext}</p>
      )}
    </div>
  );
}
