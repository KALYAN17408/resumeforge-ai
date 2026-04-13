import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, userPlan, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <span className="logo-icon">◈</span> ResumeForge
      </Link>

      <div className={`nav-links ${open ? 'open' : ''}`}>
        {user ? (
          <>
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link>
            <Link to="/builder" className={isActive('/builder') ? 'active' : ''}>Build Resume</Link>
            <Link to="/ats" className={isActive('/ats') ? 'active' : ''}>ATS Analyser</Link>
            <Link to="/templates" className={isActive('/templates') ? 'active' : ''}>Templates</Link>
            <Link to="/pricing" className={isActive('/pricing') ? 'active' : ''}>Upgrade</Link>
            <div className="nav-user">
              <span className={`plan-badge ${userPlan}`}>{userPlan === 'free' ? 'Free' : userPlan === 'pro' ? '⭐ Pro' : '👑 Max'}</span>
              <span className="nav-name">{user.displayName?.split(' ')[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/pricing">Pricing</Link>
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>

      <button className="burger" onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
    </nav>
  );
}
