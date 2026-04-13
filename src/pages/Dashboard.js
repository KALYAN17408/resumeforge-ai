import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './Dashboard.css';

export default function Dashboard() {
  const { user, userPlan } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      const q = query(collection(db, 'resumes'), where('uid', '==', user.uid));
      const snap = await getDocs(q);
      setResumes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchResumes(); }, []);

  const deleteResume = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    await deleteDoc(doc(db, 'resumes', id));
    setResumes(r => r.filter(x => x.id !== id));
  };

  const canCreate = userPlan === 'free' ? resumes.length < 2 : true;

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h1>My Resumes</h1>
          <p className="dash-sub">Welcome back, <strong>{user?.displayName}</strong></p>
        </div>
        <div className="dash-header-actions">
          <span className={`plan-chip ${userPlan}`}>
            {userPlan === 'free' ? '🆓 Free Plan' : userPlan === 'pro' ? '⭐ Pro — Lifetime' : '👑 Max — Lifetime'}
          </span>
          {userPlan === 'free' && (
            <Link to="/pricing" className="btn btn-gold btn-sm">Upgrade to Pro — $1</Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="ds-card">
          <div className="ds-num">{resumes.length}</div>
          <div className="ds-label">Resumes Created</div>
        </div>
        <div className="ds-card">
          <div className="ds-num">{userPlan === 'free' ? '2' : '∞'}</div>
          <div className="ds-label">Resume Limit</div>
        </div>
        <div className="ds-card">
          <div className="ds-num" style={{color:'var(--green)'}}>
            {userPlan !== 'free' ? '✓' : '—'}
          </div>
          <div className="ds-label">AI Features</div>
        </div>
        <div className="ds-card">
          <div className="ds-num" style={{color:'var(--gold)'}}>
            {userPlan === 'max' ? '✓' : '—'}
          </div>
          <div className="ds-label">All Templates</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dash-quick">
        <Link to="/builder" className={`quick-action ${!canCreate ? 'disabled' : ''}`}
          onClick={e => !canCreate && e.preventDefault()}>
          <div className="qa-icon">✏️</div>
          <div className="qa-text">
            <strong>New Resume</strong>
            <span>{canCreate ? 'Start from scratch or a template' : 'Upgrade to create more'}</span>
          </div>
          <span className="qa-arrow">→</span>
        </Link>
        <Link to="/ats" className="quick-action">
          <div className="qa-icon">🎯</div>
          <div className="qa-text">
            <strong>ATS Analyser</strong>
            <span>Score your resume with AI</span>
          </div>
          <span className="qa-arrow">→</span>
        </Link>
        <Link to="/templates" className="quick-action">
          <div className="qa-icon">🎨</div>
          <div className="qa-text">
            <strong>Browse Templates</strong>
            <span>Pick a professional design</span>
          </div>
          <span className="qa-arrow">→</span>
        </Link>
      </div>

      {/* Resumes list */}
      <div className="dash-section">
        <div className="dash-section-header">
          <h2>Your Resumes</h2>
          {canCreate && (
            <Link to="/builder" className="btn btn-primary btn-sm">+ New Resume</Link>
          )}
        </div>

        {loading ? (
          <div className="spinner" />
        ) : resumes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No resumes yet</h3>
            <p>Create your first resume and let AI help you get hired</p>
            <Link to="/builder" className="btn btn-primary" style={{marginTop:'1rem'}}>Create Your First Resume</Link>
          </div>
        ) : (
          <div className="resumes-grid">
            {resumes.map(r => (
              <div className="resume-card" key={r.id}>
                <div className="rc-preview">
                  <div className="rc-mock">
                    <div className="rcm-header">
                      <div className="rcm-name">{r.personalInfo?.name || 'Untitled'}</div>
                      <div className="rcm-title">{r.personalInfo?.title || ''}</div>
                    </div>
                    {['Experience','Skills','Education'].map(s=>(
                      <div key={s}>
                        <div className="rcm-section">{s}</div>
                        <div className="rcm-line full"/><div className="rcm-line half"/>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rc-info">
                  <div className="rc-name">{r.personalInfo?.name || 'Untitled Resume'}</div>
                  <div className="rc-date">{r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Draft'}</div>
                  <span className="tag tag-purple">{r.template || 'Classic'}</span>
                </div>
                <div className="rc-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => navigate(`/builder/${r.id}`)}>Edit</button>
                  <button className="btn btn-sm" style={{background:'rgba(248,113,113,0.1)',color:'var(--red)',border:'1px solid rgba(248,113,113,0.2)'}} onClick={() => deleteResume(r.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {userPlan === 'free' && (
        <div className="upgrade-banner">
          <div className="ub-text">
            <strong>⚡ Unlock the full ResumeForge experience</strong>
            <span>Get unlimited resumes, all templates, and real AI writing for just $1 — forever.</span>
          </div>
          <Link to="/pricing" className="btn btn-gold">Upgrade Now</Link>
        </div>
      )}
    </div>
  );
}
