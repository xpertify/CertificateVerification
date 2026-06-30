import React from 'react';

export default function Input({ label, error, id, className = '', ...rest }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="font-body text-sm font-medium text-ink"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'w-full font-body text-sm text-ink bg-surface border rounded-btn px-3 py-2',
          'placeholder:text-slate/60',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-1',
          error
            ? 'border-invalid focus:border-invalid focus:ring-invalid'
            : 'border-hairline focus:border-brass focus:ring-brass',
        ].join(' ')}
        {...rest}
      />
      {error && (
        <span className="font-body text-xs text-invalid">{error}</span>
      )}
    </div>
  );
}
