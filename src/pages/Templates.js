import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import './Templates.css';

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic Pro',
    tag: 'ATS #1 Rated',
    tagColor: 'green',
    desc: 'Clean, professional, universally accepted. The safe choice that still looks great.',
    plans: ['free', 'pro', 'max'],
    accent: '#7c6aff',
    preview: 'classic',
  },
  {
    id: 'modern',
    name: 'Modern Edge',
    tag: 'Most Popular',
    tagColor: 'purple',
    desc: 'Bold accent bar, timeline layout. Stands out while staying fully ATS-compatible.',
    plans: ['free', 'pro', 'max'],
    accent: '#7c6aff',
    preview: 'modern',
  },
  {
    id: 'minimal',
    name: 'Minimal Type',
    tag: 'Clean & Sharp',
    tagColor: 'purple',
    desc: 'Let your content speak. Pure typography, perfect spacing, zero noise.',
    plans: ['free', 'pro', 'max'],
    accent: '#333',
    preview: 'minimal',
  },
  {
    id: 'executive',
    name: 'Executive',
    tag: 'Senior Roles',
    tagColor: 'gold',
    desc: 'Commanding, authoritative design built for leadership and senior positions.',
    plans: ['pro', 'max'],
    accent: '#7c6aff',
    preview: 'executive',
  },
  {
    id: 'creative',
    name: 'Creative Gradient',
    tag: 'Stand Out',
    tagColor: 'gold',
    desc: 'Gradient header, bold colours. Perfect for design, marketing, and creative roles.',
    plans: ['max'],
    accent: '#a78bfa',
    preview: 'creative',
  },
  {
    id: 'sidebar',
    name: 'Sidebar Elite',
    tag: 'Max Exclusive',
    tagColor: 'gold',
    desc: 'Two-column layout with dark sidebar. Sophisticated, modern, and highly readable.',
    plans: ['max'],
    accent: '#2d2354',
    preview: 'sidebar',
  },
];

function TemplateMock({ id, accent }) {
  const mocks = {
    classic: (
      <div className="tmock tmock-classic">
        <div className="tm-header" style={{ borderColor: accent }}>
          <div className="tm-name">Kalyan Chandana</div>
          <div className="tm-title" style={{ color: accent }}>Software Engineer</div>
          <div className="tm-contact-row"><span /><span /><span /></div>
        </div>
        {['Experience', 'Education', 'Skills'].map(s => (
          <div key={s}>
            <div className="tm-sec-title" style={{ color: accent, borderColor: `${accent}33` }}>{s}</div>
            <div className="tm-line full" /><div className="tm-line half" /><div className="tm-line two-thirds" />
          </div>
        ))}
      </div>
    ),
    modern: (
      <div className="tmock tmock-modern">
        <div className="tm-modern-header">
          <div className="tm-modern-bar" style={{ background: accent }} />
          <div className="tm-modern-name-block" style={{ background: `${accent}11` }}>
            <div className="tm-name">Kalyan Chandana</div>
            <div className="tm-title" style={{ color: accent }}>Software Engineer</div>
          </div>
          <div className="tm-modern-contact" style={{ background: accent }}>
            <div className="tm-line light sm" /><div className="tm-line light sm" /><div className="tm-line light sm" />
          </div>
        </div>
        {['Experience', 'Projects', 'Skills'].map(s => (
          <div key={s} className="tm-modern-section">
            <div className="tm-sec-title" style={{ color: accent }}>{s}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <div className="tm-dot" style={{ background: accent }} />
              <div style={{ flex: 1 }}>
                <div className="tm-line full" /><div className="tm-line half" />
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    minimal: (
      <div className="tmock tmock-minimal">
        <div className="tm-name" style={{ fontSize: '1.1rem', fontWeight: 800 }}>Kalyan Chandana</div>
        <div className="tm-title" style={{ color: '#888' }}>Software Engineer</div>
        <div className="tm-minimal-divider" />
        {['EXPERIENCE', 'EDUCATION', 'SKILLS'].map(s => (
          <div key={s}>
            <div className="tm-minimal-sec">{s}</div>
            <div className="tm-line full" /><div className="tm-line half" />
          </div>
        ))}
      </div>
    ),
    executive: (
      <div className="tmock tmock-executive">
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div className="tm-name" style={{ letterSpacing: 2, fontSize: '0.85rem' }}>KALYAN CHANDANA</div>
          <div className="tm-title" style={{ color: accent }}>Software Engineer</div>
          <div style={{ width: 30, height: 2, background: accent, margin: '5px auto' }} />
          <div className="tm-contact-row" style={{ justifyContent: 'center' }}><span /><span /><span /></div>
        </div>
        {['PROFESSIONAL EXPERIENCE', 'CORE COMPETENCIES'].map(s => (
          <div key={s}>
            <div className="tm-exec-sec">{s}</div>
            <div className="tm-line full" /><div className="tm-line two-thirds" />
          </div>
        ))}
      </div>
    ),
    creative: (
      <div className="tmock tmock-creative">
        <div className="tm-creative-header" style={{ background: `linear-gradient(135deg, ${accent}, #7c6aff)` }}>
          <div className="tm-name" style={{ color: '#fff', fontSize: '0.85rem' }}>Kalyan Chandana</div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.55rem' }}>Software Engineer</div>
        </div>
        <div className="tm-creative-body">
          {['About', 'Experience', 'Skills'].map(s => (
            <div key={s}>
              <div className="tm-sec-title" style={{ color: accent }}>{s}</div>
              <div className="tm-line full" /><div className="tm-line half" />
            </div>
          ))}
        </div>
      </div>
    ),
    sidebar: (
      <div className="tmock tmock-sidebar">
        <div className="tm-sidebar-left" style={{ background: '#2d2354' }}>
          <div className="tm-sb-avatar" style={{ background: accent }}>K</div>
          <div style={{ color: '#fff', fontSize: '0.5rem', fontWeight: 700, textAlign: 'center', marginBottom: 2 }}>Kalyan Chandana</div>
          <div style={{ color: '#a78bfa', fontSize: '0.42rem', textAlign: 'center', marginBottom: 6 }}>Software Engineer</div>
          <div className="tm-line light sm" /><div className="tm-line light sm half" /><div className="tm-line light sm" />
        </div>
        <div className="tm-sidebar-right">
          {['Experience', 'Projects', 'Education'].map(s => (
            <div key={s}>
              <div className="tm-sec-title" style={{ color: '#2d2354', borderColor: '#7c6aff', fontSize: '0.42rem' }}>{s}</div>
              <div className="tm-line full" /><div className="tm-line half" />
            </div>
          ))}
        </div>
      </div>
    ),
  };
  return mocks[id] || null;
}

export default function Templates() {
  const { userPlan } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const canAccess = (plans) => plans.includes(userPlan);

  const useTemplate = (tpl) => {
    if (!canAccess(tpl.plans)) return;
    navigate(`/builder?template=${tpl.id}`);
  };

  return (
    <div className="templates-page">
      <div className="tpl-hero">
        <div className="section-label">Template Gallery</div>
        <h1>Pick your <span style={{ color: 'var(--accent2)' }}>perfect look</span></h1>
        <p>Every template is fully ATS-compatible and renders cleanly to PDF. Your plan unlocks more options.</p>
      </div>

      <div className="plan-access-bar">
        <div className={`pab-item ${userPlan === 'free' ? 'active' : ''}`}>🆓 Free — 3 templates</div>
        <div className={`pab-item ${userPlan === 'pro' ? 'active' : ''}`}>⭐ Pro — 4 templates</div>
        <div className={`pab-item ${userPlan === 'max' ? 'active' : ''}`}>👑 Max — All 6 templates</div>
      </div>

      <div className="templates-grid">
        {TEMPLATES.map(tpl => {
          const locked = !canAccess(tpl.plans);
          const isSelected = selected === tpl.id;
          return (
            <div
              key={tpl.id}
              className={`tpl-card ${isSelected ? 'selected' : ''} ${locked ? 'locked' : ''}`}
              onClick={() => !locked && setSelected(tpl.id)}
            >
              {locked && <div className="tpl-lock-overlay"><span>🔒</span><span>{tpl.plans.includes('max') ? 'Max Plan' : 'Pro Plan'}</span></div>}
              <div className="tpl-preview">
                <TemplateMock id={tpl.id} accent={tpl.accent} />
              </div>
              <div className="tpl-info">
                <div className="tpl-info-top">
                  <div className="tpl-name">{tpl.name}</div>
                  <span className={`tag tag-${tpl.tagColor}`}>{tpl.tag}</span>
                </div>
                <p className="tpl-desc">{tpl.desc}</p>
                <button
                  className={`btn btn-sm ${locked ? 'btn-outline' : 'btn-primary'}`}
                  onClick={() => locked ? navigate('/pricing') : useTemplate(tpl)}
                >
                  {locked ? 'Unlock →' : 'Use Template →'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {userPlan === 'free' && (
        <div className="tpl-upgrade-cta">
          <h3>Unlock all 6 professional templates</h3>
          <p>Upgrade to Max for just $3 — one-time payment, lifetime access.</p>
          <button className="btn btn-gold" onClick={() => navigate('/pricing')}>Upgrade to Max — $3 Lifetime</button>
        </div>
      )}
    </div>
  );
}
