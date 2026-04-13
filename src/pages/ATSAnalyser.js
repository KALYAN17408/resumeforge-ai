import React, { useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import './ATSAnalyser.css';

const METRICS = [
  { key: 'ats', label: 'ATS Compatibility', max: 25 },
  { key: 'content', label: 'Content Quality', max: 35 },
  { key: 'writing', label: 'Writing Quality', max: 10 },
  { key: 'jobMatch', label: 'Job Match', max: 20 },
  { key: 'readiness', label: 'Application Ready', max: 10 },
];

function ScoreRing({ score }) {
  const pct = Math.min(100, Math.max(0, score));
  const color = pct >= 80 ? '#22d3a0' : pct >= 60 ? '#f4c842' : '#f87171';
  return (
    <div className="score-ring" style={{ '--pct': pct, '--color': color }}>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${2.51 * pct} 251`} strokeDashoffset="62.75" strokeLinecap="round" />
      </svg>
      <div className="score-ring-inner">
        <div className="sr-num" style={{ color }}>{score}</div>
        <div className="sr-label">/ 100</div>
      </div>
    </div>
  );
}

export default function ATSAnalyser() {
  const { user } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 
  const analyse = async () => {
    if (!resumeText.trim()) { setError('Please paste your resume text first.'); return; }
    setError(''); setLoading(true); setResult(null);
    try {
      const prompt = `You are an expert ATS (Applicant Tracking System) and resume reviewer. Analyse the following resume and return a JSON object ONLY with no extra text.

Resume:
${resumeText}

${jobDesc ? `Job Description:\n${jobDesc}` : ''}

Return this exact JSON structure:
{
  "totalScore": <number 0-100>,
  "scores": {
    "ats": <number 0-25>,
    "content": <number 0-35>,
    "writing": <number 0-10>,
    "jobMatch": <number 0-20>,
    "readiness": <number 0-10>
  },
  "grade": "<Excellent|Good|Fair|Needs Work>",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "missingKeywords": ["missing1", "missing2", "missing3"],
  "topSuggestion": "<one specific actionable tip>",
  "sampleBullet": {
    "weak": "<example weak bullet from resume or generic>",
    "strong": "<rewritten strong version with metrics>"
  }
}`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const json = await res.json();
      const text = json.content?.[0]?.text || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);

      // Save to Firestore
      await addDoc(collection(db, 'ats_reports'), {
        uid: user.uid,
        score: parsed.totalScore,
        createdAt: new Date().toISOString(),
        resumeSnippet: resumeText.substring(0, 200),
      });
    } catch (e) {
      setError('Analysis failed. Please check your resume text and try again.');
      console.error(e);
    }
    setLoading(false);
  };

  const gradeColor = (g) => ({ Excellent: '#22d3a0', Good: '#7c6aff', Fair: '#f4c842', 'Needs Work': '#f87171' }[g] || '#7c6aff');

  return (
    <div className="ats-page">
      <div className="ats-hero">
        <div className="section-label">ATS Analyser</div>
        <h1>Find out how your resume <span style={{ color: 'var(--accent2)' }}>really performs</span></h1>
        <p>Paste your resume below and get an instant AI-powered breakdown across 5 key hiring dimensions.</p>
      </div>

     

      {canUse && (
        <div className="ats-body">
          <div className="ats-inputs">
            <div className="ats-input-block">
              <label>Paste Your Resume Text *</label>
              <textarea
                placeholder="Copy and paste your entire resume text here — include all sections: contact info, summary, experience, education, skills, projects..."
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                style={{ minHeight: '220px' }}
              />
              <div className="char-count">{resumeText.length} characters</div>
            </div>
            <div className="ats-input-block">
              <label>Job Description <span className="optional">(optional — improves keyword match)</span></label>
              <textarea
                placeholder="Paste the job description here to get a personalised keyword match score..."
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                style={{ minHeight: '120px' }}
              />
            </div>
            {error && <div className="ats-error">{error}</div>}
            <button className="btn btn-primary" onClick={analyse} disabled={loading} style={{ alignSelf: 'flex-start' }}>
              {loading ? '⏳ Analysing with AI...' : '🎯 Analyse My Resume'}
            </button>
          </div>

          {loading && (
            <div className="ats-loading">
              <div className="spinner" />
              <p>Claude AI is analysing your resume across 20+ criteria...</p>
            </div>
          )}

          {result && (
            <div className="ats-result">
              {/* Score overview */}
              <div className="ats-overview">
                <div className="ats-score-block">
                  <ScoreRing score={result.totalScore} />
                  <div className="ats-grade" style={{ color: gradeColor(result.grade) }}>{result.grade}</div>
                  <div className="ats-grade-sub">Overall Resume Score</div>
                </div>
                <div className="ats-metrics">
                  {METRICS.map(m => {
                    const val = result.scores?.[m.key] || 0;
                    const pct = (val / m.max) * 100;
                    const color = pct >= 80 ? '#22d3a0' : pct >= 60 ? '#f4c842' : '#f87171';
                    return (
                      <div className="ats-metric-row" key={m.key}>
                        <div className="amr-label">
                          <span>{m.label}</span>
                          <span className="amr-score" style={{ color }}>{val}/{m.max}</span>
                        </div>
                        <div className="amr-track">
                          <div className="amr-fill" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="ats-cards">
                <div className="ats-card green">
                  <div className="atsc-title">✅ Strengths</div>
                  <ul>{result.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
                <div className="ats-card red">
                  <div className="atsc-title">⚠️ Areas to Improve</div>
                  <ul>{result.improvements?.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
              </div>

              {/* Keywords */}
              <div className="ats-keywords-section">
                <div className="atsk-block">
                  <div className="atsk-title">✓ Keywords Found</div>
                  <div className="atsk-pills">
                    {result.keywords?.map((k, i) => <span key={i} className="kw-pill found">{k}</span>)}
                  </div>
                </div>
                <div className="atsk-block">
                  <div className="atsk-title">✗ Missing Keywords</div>
                  <div className="atsk-pills">
                    {result.missingKeywords?.map((k, i) => <span key={i} className="kw-pill missing">{k}</span>)}
                  </div>
                </div>
              </div>

              {/* Bullet improvement */}
              {result.sampleBullet && (
                <div className="ats-bullet-section">
                  <div className="atsc-title" style={{ marginBottom: '1rem' }}>💡 Bullet Point Improvement</div>
                  <div className="bullet-compare">
                    <div className="bullet-box weak">
                      <div className="bb-label">❌ Weak</div>
                      <p>{result.sampleBullet.weak}</p>
                    </div>
                    <div className="bullet-arrow">→</div>
                    <div className="bullet-box strong">
                      <div className="bb-label">✅ Strong</div>
                      <p>{result.sampleBullet.strong}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Top suggestion */}
              {result.topSuggestion && (
                <div className="ats-top-suggestion">
                  <span className="ts-icon">🚀</span>
                  <div>
                    <strong>Top Priority Action</strong>
                    <p>{result.topSuggestion}</p>
                  </div>
                </div>
              )}

              <button className="btn btn-outline" onClick={() => { setResult(null); setResumeText(''); setJobDesc(''); }} style={{ marginTop: '1rem' }}>
                Analyse Another Resume
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
