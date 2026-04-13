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
You are an expert ATS resume reviewer.

Return ONLY valid JSON in this format:

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

Resume:
${resumeText}

Job Description:
${jobDesc}
`;

      // 🔥 CALL YOUR NETLIFY FUNCTION (HUGGING FACE BACKEND)
      const res = await fetch('/.netlify/functions/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      const json = await res.json();
      const text = json.text || '';

      // 🧠 SAFE JSON EXTRACTION
      let parsed;
      try {
        const match = text.match(/\{[\s\S]*\}/);
        parsed = match ? JSON.parse(match[0]) : null;
      } catch (err) {
        setError('AI returned invalid format. Try again.');
        setLoading(false);
        return;
      }

      if (!parsed) {
        setError('No valid response from AI.');
        setLoading(false);
        return;
      }

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
        <h1>ATS Resume Analyzer</h1>
        <p>Free AI-powered resume scoring system</p>
      </div>

      <div className="ats-body">

        <textarea
          placeholder="Paste resume..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          style={{ minHeight: '200px', width: '100%' }}
        />

        <textarea
          placeholder="Paste job description (optional)"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          style={{ minHeight: '120px', width: '100%', marginTop: '10px' }}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button onClick={analyse} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>

        {loading && <p>AI is analyzing...</p>}

        {result && (
          <div className="ats-result">

            <ScoreRing score={result.totalScore} />

            <h2 style={{ color: gradeColor(result.grade) }}>
              {result.grade}
            </h2>

            <h3>Strengths</h3>
            <ul>
              {result.strengths?.map((s, i) => <li key={i}>{s}</li>)}
            </ul>

            <h3>Improvements</h3>
            <ul>
              {result.improvements?.map((s, i) => <li key={i}>{s}</li>)}
            </ul>

            <h3>Top Suggestion</h3>
            <p>{result.topSuggestion}</p>

            <button onClick={() => {
              setResult(null);
              setResumeText('');
              setJobDesc('');
            }}>
              Try Another
            </button>

          </div>
        )}

      </div>
    </div>
  );
}