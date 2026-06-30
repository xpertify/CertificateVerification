import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Nav() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const linkClass =
    'font-body text-sm font-medium text-parchment/80 hover:text-parchment transition-colors duration-150';
  const activeClass = 'text-parchment';

  return (
    <nav className="flex items-center gap-6">
      <Link to="/verify" className={linkClass}>Verify</Link>

      {!token && (
        <Link
          to="/login"
          className="font-body text-sm font-medium bg-brass text-white px-4 py-1.5 rounded-btn hover:opacity-90 transition-opacity duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
        >
          Log In
        </Link>
      )}

      {token && role === 'admin' && (
        <>
          <Link to="/institutions" className={linkClass}>Institutions</Link>
          <Link to="/dashboard" className={linkClass}>Dashboard</Link>
        </>
      )}

      {token && role === 'institution' && (
        <>
          <Link to="/issue" className={linkClass}>Issue Certificate</Link>
          <Link to="/dashboard" className={linkClass}>Dashboard</Link>
        </>
      )}

      {token && (
        <button
          onClick={handleLogout}
          className="font-body text-sm font-medium text-parchment/60 hover:text-parchment transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
        >
          Log Out
        </button>
      )}
    </nav>
  );
}
