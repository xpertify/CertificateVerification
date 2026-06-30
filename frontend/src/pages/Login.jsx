import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { login as apiLogin } from '../api/auth.js';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      const data = await apiLogin(email.trim(), password);
      login(data);
      navigate(data.role === 'admin' ? '/institutions' : '/issue');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center py-8">
      <div className="bg-surface border border-hairline rounded-card shadow-card p-8 w-full max-w-form">
        <div className="mb-6 text-center">
          <span className="font-display font-bold text-xl text-ink">CertVerify</span>
          <p className="font-body text-sm text-slate mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@institution.edu"
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="bg-invalid-tint border border-invalid/30 text-invalid rounded-btn px-3 py-2 text-sm font-body" role="alert">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full mt-2"
          >
            {loading ? 'Signing in…' : 'Log In'}
          </Button>
        </form>

        <p className="font-body text-xs text-slate text-center mt-5">
          Just want to verify?{' '}
          <Link to="/verify" className="text-brass hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brass">
            No login required →
          </Link>
        </p>
      </div>
    </div>
  );
}
