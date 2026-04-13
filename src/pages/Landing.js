import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const FEATURES = [
  { icon: '⚡', title: 'Instant ATS Score', desc: 'Upload your resume and get a detailed breakdown across 20+ hiring criteria in seconds.' },
  { icon: '🤖', title: 'AI-Powered Writing', desc: 'Let Claude AI craft bullet points that highlight your impact with metrics recruiters care about.' },
  { icon: '🎨', title: 'Designer Templates', desc: 'Choose from ATS-friendly templates built to pass automated screening and impress human reviewers.' },
  { icon: '📄', title: 'One-Click PDF Export', desc: 'Download a perfectly formatted PDF resume ready to send to any employer.' },
  { icon: '🔑', title: 'Keyword Optimiser', desc: 'Automatically match your resume to job descriptions so you never miss a critical keyword.' },
  { icon: '🛡️', title: 'Lifetime Access', desc: 'Pay once, own it forever. No subscriptions, no renewals, no surprises.' },
];

const STATS = [
  { value: '93%', label: 'ATS pass rate' },
  { value: '3x', label: 'More interviews' },
  { value: '2 min', label: 'Setup time' },
  { value: '$1', label: 'Starting price' },
];

const COMPANIES = ['Google','Microsoft','Amazon','Apple','Meta','Netflix','Nvidia','Stripe','Databricks','Shopify','LinkedIn','TikTok','Snowflake','Datadog'];

export default function Landing() {
  const trackRef = useRef(null);

  useEffect(() => {
    document.title = 'ResumeForge AI – Land More Interviews';
  }, []);

  return (
    <div className="landing">

      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <span className="hero-badge">I</span>
          <h1>
            Your resume.<br />
            <span className="gradient-text">Reimagined.</span>
          </h1>
          <p className="hero-sub">
            Stop guessing why you're not getting callbacks. ResumeForge analyses your resume like a hiring system, rewrites it with AI, and helps you land more interviews — starting today.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary">Build My Resume Free</Link>
            <Link to="/pricing" className="btn btn-outline">View Plans</Link>
          </div>
          <div className="hero-note">No credit card needed · Free tier available · Lifetime plans from $1</div>
        </div>

        {/* Score card preview */}
        <div className="hero-card">
          <div className="hc-header">
            <div className="hc-avatar">BC</div>
            <div>
              <div className="hc-name">BATTACHARI</div>
              <div className="hc-role">Software Engineer</div>
            </div>
            <div className="hc-score">93</div>
          </div>
          <div className="hc-bars">
            {[['ATS Structure','100%','25/25'],['Content Quality','91%','32/35'],['Writing','90%','9/10'],['Job Match','80%','20/25'],['Readiness','100%','5/5']].map(([l,w,v])=>(
              <div className="hc-bar-row" key={l}>
                <span>{l}</span>
                <div className="hc-track"><div className="hc-fill" style={{width:w}}/></div>
                <span className="hc-val">{v}</span>
              </div>
            ))}
          </div>
          <div className="hc-footer">
            <span className="tag tag-green">✓ Excellent Resume</span>
            <span style={{fontSize:'0.78rem',color:'var(--text3)'}}>Top 8% of all uploads</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-strip">
        {STATS.map(s => (
          <div className="stat-item" key={s.label}>
            <div className="stat-val">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-label">What we offer</div>
        <h2 className="section-title">Every tool you need.<br />Nothing you don't.</h2>
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

      {/* Companies */}
      <section className="companies-section">
        <p className="companies-label">Our users have landed roles at</p>
        <div className="companies-track-wrap">
          <div className="companies-track" ref={trackRef}>
            {[...COMPANIES,...COMPANIES].map((c,i)=>(
              <div className="company-pill" key={i}>{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ATS Preview */}
      <section className="ats-preview-section">
        <div className="ats-text">
          <div className="section-label">ATS Analyser</div>
          <h2>See your resume<br/>the way machines do.</h2>
          <p>Most resumes never reach a human. Our ATS engine scores your resume across structure, keywords, formatting, and content — then tells you exactly what to fix.</p>
          <Link to="/signup" className="btn btn-primary" style={{marginTop:'1.5rem'}}>Try ATS Analyser Free</Link>
        </div>
        <div className="ats-mock">
          <div className="am-title">ATS Analysis Report</div>
          <div className="am-name">BATTACHARI · Software Engineer</div>
          {[
            {label:'Keyword Match',score:88,color:'var(--green)'},
            {label:'Format Compatibility',score:95,color:'var(--accent)'},
            {label:'Section Structure',score:100,color:'var(--green)'},
            {label:'Bullet Point Quality',score:78,color:'var(--gold)'},
            {label:'Contact Info',score:100,color:'var(--green)'},
          ].map(m=>(
            <div className="am-row" key={m.label}>
              <span>{m.label}</span>
              <div className="am-track">
                <div className="am-fill" style={{width:`${m.score}%`,background:m.color}}/>
              </div>
              <span className="am-score" style={{color:m.color}}>{m.score}%</span>
            </div>
          ))}
          <div className="am-suggestions">
            <div className="am-sug-title">💡 Top Suggestions</div>
            <div className="am-sug">Add more action verbs to bullet points in Experience section</div>
            <div className="am-sug">Include measurable outcomes — e.g., "increased performance by 40%"</div>
            <div className="am-sug">Add skills like "System Design" based on target job description</div>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="landing-cta">
        <div className="cta-glow" />
        <h2>Ready to get hired?</h2>
        <p>Join thousands of professionals who upgraded their job search with ResumeForge.</p>
        <div className="cta-plans">
          <div className="cta-plan">
            <div className="cta-plan-name">Free</div>
            <div className="cta-plan-price">$0</div>
            <div className="cta-plan-note">Always free</div>
            <Link to="/signup" className="btn btn-outline" style={{width:'100%',justifyContent:'center'}}>Get Started</Link>
          </div>
          <div className="cta-plan featured">
            <div className="cta-plan-badge">Most Popular</div>
            <div className="cta-plan-name">Pro</div>
            <div className="cta-plan-price">$1 <span>lifetime</span></div>
            <div className="cta-plan-note">Pay once, use forever</div>
            <Link to="/signup" className="btn btn-gold" style={{width:'100%',justifyContent:'center'}}>Get Pro</Link>
          </div>
          <div className="cta-plan">
            <div className="cta-plan-name">Max</div>
            <div className="cta-plan-price">$3 <span>lifetime</span></div>
            <div className="cta-plan-note">Pay once, use forever</div>
            <Link to="/signup" className="btn btn-outline" style={{width:'100%',justifyContent:'center'}}>Get Max</Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-logo">◈ ResumeForge AI</div>
        <p>Built for ambitious professionals. © 2025 ResumeForge AI</p>
        <div className="footer-links">
          <Link to="/pricing">Pricing</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </footer>
    </div>
  );
}
