import React from 'react';
import LoadingSpinner from './LoadingSpinner.jsx';

const variants = {
  primary: 'bg-brass text-white hover:opacity-90 border border-transparent',
  secondary: 'bg-surface text-ink border border-hairline hover:bg-parchment',
  danger: 'bg-invalid text-white hover:opacity-90 border border-transparent',
  ghost: 'bg-transparent text-ink border border-transparent hover:bg-parchment',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2 text-sm',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...rest
}) {
  const isDisabled = disabled || loading;
  return (
    <button
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-body font-medium rounded-btn transition-opacity duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass',
        variants[variant],
        sizes[size],
        isDisabled ? 'opacity-60 cursor-not-allowed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading && <LoadingSpinner size="sm" color="currentColor" />}
      {children}
    </button>
  );
}
