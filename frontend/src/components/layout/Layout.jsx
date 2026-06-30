import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Nav from './Nav.jsx';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <header className="bg-ink border-b border-ink/20 sticky top-0 z-30">
        <div className="max-w-content mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="font-display font-bold text-xl text-parchment tracking-tight hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
          >
            CertVerify
          </Link>
          <Nav />
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-content mx-auto px-6 py-12">
          <Outlet />
        </div>
      </main>

      <footer className="bg-ink border-t border-white/10">
        <div className="max-w-content mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-body text-xs text-slate">
            Blockchain-Anchored Certificate Verification
          </span>
          <span className="font-mono text-xs text-slate/60">
            Sepolia Testnet · Ethereum · SHA-256
          </span>
        </div>
      </footer>
    </div>
  );
}
