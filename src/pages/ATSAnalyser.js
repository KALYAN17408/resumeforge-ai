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
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${2.51 * pct} 251`}
          strokeDashoffset="62.75"
          strokeLinecap="round"
        />
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
    if (!resumeText.trim()) {
      setError('Please paste your resume text first.');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const prompt = `
You are an expert ATS (Applicant Tracking System) and resume reviewer.

Analyse the following resume and return ONLY valid JSON.

Resume:
${resumeText}

${jobDesc ? `Job Description:\n${jobDesc}` : ''}

Return JSON:
{
  "totalScore": 0-100,
  "scores": {
    "ats": 0-25,
    "content": 0-35,
    "writing": 0-10,
    "jobMatch": 0-20,
    "readiness": 0-10
  },
  "grade": "Excellent|Good|Fair|Needs Work",
  "strengths": [],
  "improvements": [],
  "keywords": [],
  "missingKeywords": [],
  "topSuggestion": "",
  "sampleBullet": {
    "weak": "",
    "strong": ""
  }
}
`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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

      await addDoc(collection(db, 'ats_reports'), {
        uid: user?.uid || 'guest',
        score: parsed.totalScore,
        createdAt: new Date().toISOString(),
        resumeSnippet: resumeText.substring(0, 200),
      });

    } catch (e) {
      console.error(e);
      setError('Analysis failed. Please try again.');
    }

    setLoading(false);
  };

  const gradeColor = (g) =>
    ({ Excellent: '#22d3a0', Good: '#7c6aff', Fair: '#f4c842', 'Needs Work': '#f87171' }[g] || '#7c6aff');

  return (
    <div className="ats-page">

      <div className="ats-hero">
        <div className="section-label">ATS Analyser</div>
        <h1>Find out how your resume <span style={{ color: 'var(--accent2)' }}>really performs</span></h1>
        <p>Paste your resume below and get an instant AI-powered breakdown.</p>
      </div>

      {/* INPUT SECTION (always visible now) */}
      <div className="ats-body">
        <div className="ats-inputs">

          <div className="ats-input-block">
            <label>Paste Your Resume Text *</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste resume..."
              style={{ minHeight: '220px' }}
            />
          </div>

          <div className="ats-input-block">
            <label>Job Description (optional)</label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste job description..."
              style={{ minHeight: '120px' }}
            />
          </div>

          {error && <div className="ats-error">{error}</div>}

          <button className="btn btn-primary" onClick={analyse} disabled={loading}>
            {loading ? '⏳ Analysing...' : '🎯 Analyse My Resume'}
          </button>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="ats-loading">
            <div className="spinner" />
            <p>AI is analysing your resume...</p>
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div className="ats-result">

            <div className="ats-overview">
              <ScoreRing score={result.totalScore} />

              <div className="ats-grade" style={{ color: gradeColor(result.grade) }}>
                {result.grade}
              </div>
            </div>

            <div className="ats-cards">
              <div className="ats-card green">
                <h3>Strengths</h3>
                <ul>{result.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>

              <div className="ats-card red">
                <h3>Improvements</h3>
                <ul>{result.improvements?.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            </div>

            <div className="ats-top-suggestion">
              <strong>Top Suggestion:</strong>
              <p>{result.topSuggestion}</p>
            </div>

            <button
              className="btn btn-outline"
              onClick={() => {
                setResult(null);
                setResumeText('');
                setJobDesc('');
              }}
            >
              Analyse Another Resume
            </button>

          </div>
        )}

      </div>
    </div>
  );
}