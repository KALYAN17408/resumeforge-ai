import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const FEATURES = [
  { icon: '🎨', title: 'Professional Templates', desc: 'Choose from beautifully designed templates built to make your resume stand out from the crowd.' },
  { icon: '⚡', title: 'Fast Resume Builder', desc: 'Fill in your details and watch your resume come to life instantly in the live preview panel.' },
  { icon: '✨', title: 'Beautiful Designs', desc: 'Clean, modern layouts crafted to impress both human reviewers and hiring systems.' },
  { icon: '📄', title: 'One-Click PDF Export', desc: 'Download a perfectly formatted PDF resume ready to send to any employer, instantly.' },
  { icon: '♾️', title: 'Unlimited Resumes', desc: 'Create and save as many resumes as you need — tailored for every job you apply to.' },
  { icon: '🆓', title: 'Always Free', desc: 'No credit card. No subscription. No hidden fees. Every feature is completely free, forever.' },
];

const STATS = [
  { value: '6+',    label: 'Resume templates' },
  { value: '∞',     label: 'Resumes allowed'  },
  { value: '2 min', label: 'Setup time'       },
  { value: '$0',    label: 'Cost forever'     },
];

const COMPANIES = [
  'Google','Microsoft','Amazon','Apple','Meta',
  'Netflix','Nvidia','Stripe','LinkedIn','Shopify',
  'Databricks','Snowflake','TikTok','Datadog',
];

const TEMPLATE_THUMBS = [
  { name: 'Modern Fresher', tag: '⭐ Recommended', color: '#7c6aff', id: 'modern-fresher' },
  { name: 'Modern Minimal', tag: 'Clean',          color: '#555',    id: 'minimal'        },
  { name: 'Two Column Pro', tag: 'Popular',         color: '#7c6aff', id: 'sidebar'        },
  { name: 'Simple Clean',   tag: 'Classic',         color: '#7c6aff', id: 'classic'        },
];

export default function Landing() {
  return (
    <div className="landing">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <span className="hero-badge">◈ 100% Free Resume Builder</span>
          <h1>
            Build your resume.<br />
            <span className="gradient-text">Get hired faster.</span>
          </h1>
          <p className="hero-sub">
            Create professional resumes quickly using beautiful templates designed
            to help you stand out and get hired.
          </p>
          <div className="hero-actions">
            <Link to="/builder?template=modern-fresher" className="btn btn-primary">
              Build My Resume Free
            </Link>
            <Link to="/templates" className="btn btn-outline">
              Browse Templates
            </Link>
          </div>
          <div className="hero-note">No credit card needed · 100% free resume builder</div>
        </div>

        {/* Hero visual */}
        <div className="hero-card">
          <div className="hc-label">Live Preview</div>
          <div className="hc-resume-mock">
            <div className="hrm-header">
              <div className="hrm-name">Your Name Here</div>
              <div className="hrm-title">Software Engineer</div>
              <div className="hrm-contact">email@example.com · LinkedIn · Portfolio</div>
            </div>
            {['Career Objective', 'Education', 'Projects', 'Technical Skills'].map(s => (
              <div key={s} className="hrm-section">
                <div className="hrm-sec-title">{s}</div>
                <div className="hrm-line full" />
                <div className="hrm-line half" />
              </div>
            ))}
          </div>
          <div className="hc-footer">
            <span className="tag tag-green">✓ PDF Ready</span>
            <span className="tag tag-purple">✓ Free Forever</span>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-strip">
        {STATS.map(s => (
          <div className="stat-item" key={s.label}>
            <div className="stat-val">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <div className="section-label">What's included</div>
        <h2 className="section-title">
          Everything you need.<br />Completely free.
        </h2>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Companies ── */}
      <section className="companies-section">
        <p className="companies-label">Our users have landed roles at</p>
        <div className="companies-track-wrap">
          <div className="companies-track">
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <div className="company-pill" key={i}>{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Template preview ── */}
      <section className="tpl-preview-section">
        <div className="section-label">Templates</div>
        <h2 className="section-title">
          Pick a design,<br />start building.
        </h2>
        <p style={{ color: 'var(--text2)', marginBottom: '2.5rem', fontSize: '1rem' }}>
          All templates are free and export to a clean, professional PDF.
        </p>
        <div className="tpl-preview-grid">
          {TEMPLATE_THUMBS.map(t => (
            <div className="tpl-thumb" key={t.id}>
              <div className="tt-mock">
                <div className="tt-header" style={{ borderColor: t.color }}>
                  <div className="tt-name">Your Name</div>
                  <div className="tt-title" style={{ color: t.color }}>Job Title</div>
                </div>
                <div className="tt-line f" />
                <div className="tt-line h" />
                <div className="tt-line f" />
                <div className="tt-line th" />
              </div>
              <div className="tt-label">
                <span>{t.name}</span>
                <span className="tt-tag">{t.tag}</span>
              </div>
            </div>
          ))}
        </div>
        <Link
          to="/builder?template=modern-fresher"
          className="btn btn-primary"
          style={{ marginTop: '2rem' }}
        >
          Use a Template Free →
        </Link>
      </section>

      {/* ── CTA ── */}
      <section className="landing-cta">
        <div className="cta-glow" />
        <h2>Start building your resume today.</h2>
        <p>Free. Fast. No sign-up friction.</p>
        <Link
          to="/builder?template=modern-fresher"
          className="btn btn-primary"
          style={{ fontSize: '1rem', padding: '0.85rem 2.5rem' }}
        >
          Create My Resume — It's Free
        </Link>
        <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--text3)' }}>
          No credit card · No subscription · Always free
        </p>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="footer-logo">◈ ResumeForge AI</div>
        <p>Built for job seekers who want to get hired faster. © 2025 ResumeForge</p>
        <div className="footer-links">
          <Link to="/templates">Templates</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </footer>
    </div>
  );
}