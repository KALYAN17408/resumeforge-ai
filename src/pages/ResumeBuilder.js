import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import ResumePreview from '../components/ResumePreview';
import './ResumeBuilder.css';

const EMPTY = {
  personalInfo: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  template: 'classic',
};

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast ${type}`}>{msg}</div>;
}

export default function ResumeBuilder() {
  const { id } = useParams();
  const { user, userPlan } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(EMPTY);
  const [tab, setTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [resumeId, setResumeId] = useState(id || null);
  const [skillInput, setSkillInput] = useState('');  // FIX: controlled input for skills
  const previewRef = useRef(null);

  useEffect(() => {
    if (id) {
      getDoc(doc(db, 'resumes', id)).then(snap => {
        if (snap.exists() && snap.data().uid === user.uid) {
          const loaded = snap.data();
          setData({
            ...EMPTY,
            ...loaded,
            skills:     Array.isArray(loaded.skills)     ? loaded.skills     : [],
            experience: Array.isArray(loaded.experience) ? loaded.experience : [],
            education:  Array.isArray(loaded.education)  ? loaded.education  : [],
            projects:   Array.isArray(loaded.projects)   ? loaded.projects   : [],
          });
        }
      });
    }
  }, [id]);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...data, uid: user.uid, updatedAt: new Date().toISOString() };
      if (resumeId) {
        await setDoc(doc(db, 'resumes', resumeId), payload);
      } else {
        const ref = await addDoc(collection(db, 'resumes'), payload);
        setResumeId(ref.id);
        navigate(`/builder/${ref.id}`, { replace: true });
      }
      showToast('Resume saved successfully!');
    } catch { showToast('Save failed. Try again.', 'error'); }
    setSaving(false);
  };

  const exportPDF = async () => {
    setExporting(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const el = previewRef.current;
      const opt = {
        margin: 0,
        filename: `${data.personalInfo.name || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(el).save();
      showToast('PDF downloaded!');
    } catch { showToast('Export failed. Try again.', 'error'); }
    setExporting(false);
  };

  const generateAISummary = async () => {
    if (userPlan === 'free') { showToast('Upgrade to Pro to use AI features', 'error'); return; }
    setAiLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Write a compelling 3-sentence professional summary for a resume. Name: ${data.personalInfo.name}, Title: ${data.personalInfo.title}, Experience: ${data.experience.map(e => e.role + ' at ' + e.company).join(', ')}. Make it ATS-friendly, specific, and impactful. Return ONLY the summary text, no labels.`
          }]
        })
      });
      const json = await res.json();
      const summary = json.content?.[0]?.text || '';
      setData(d => ({ ...d, summary }));
      showToast('AI summary generated!');
    } catch { showToast('AI generation failed.', 'error'); }
    setAiLoading(false);
  };

  const generateAIBullets = async (expIndex) => {
    if (userPlan === 'free') { showToast('Upgrade to Pro to use AI features', 'error'); return; }
    const exp = data.experience[expIndex];
    setAiLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Write 3 strong, quantified bullet points for a resume for this role: ${exp.role} at ${exp.company}. Description: ${exp.description}. Each bullet should start with a strong action verb and include measurable impact. Return ONLY the 3 bullets separated by newlines, no labels or numbers.`
          }]
        })
      });
      const json = await res.json();
      const bullets = json.content?.[0]?.text || '';
      const newExp = [...data.experience];
      newExp[expIndex] = { ...newExp[expIndex], description: bullets };
      setData(d => ({ ...d, experience: newExp }));
      showToast('AI bullets generated!');
    } catch { showToast('AI generation failed.', 'error'); }
    setAiLoading(false);
  };

  const addExp = () => setData(d => ({ ...d, experience: [...d.experience, { role: '', company: '', duration: '', description: '' }] }));
  const addEdu = () => setData(d => ({ ...d, education: [...d.education, { degree: '', school: '', year: '', gpa: '' }] }));
  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      const newSkill = skillInput.trim();
      setData(d => ({
        ...d,
        skills: Array.isArray(d.skills) ? [...d.skills, newSkill] : [newSkill],
      }));
      setSkillInput('');   // FIX: clear via controlled state, not DOM mutation
    }
  };

  const handleSkillInputChange = (e) => setSkillInput(e.target.value);
  const addProject = () => setData(d => ({ ...d, projects: [...d.projects, { name: '', description: '', link: '', tech: '' }] }));

  const removeExp = (i) => setData(d => ({ ...d, experience: d.experience.filter((_,j) => j!==i) }));
  const removeEdu = (i) => setData(d => ({ ...d, education: d.education.filter((_,j) => j!==i) }));
  const removeSkill = (i) => setData(d => ({
    ...d,
    skills: Array.isArray(d.skills) ? d.skills.filter((_, j) => j !== i) : [],
  }));
  const removeProject = (i) => setData(d => ({ ...d, projects: d.projects.filter((_,j) => j!==i) }));

  const updateExp = (i, field, val) => {
    const newExp = [...data.experience];
    newExp[i] = { ...newExp[i], [field]: val };
    setData(d => ({ ...d, experience: newExp }));
  };
  const updateEdu = (i, field, val) => {
    const newEdu = [...data.education];
    newEdu[i] = { ...newEdu[i], [field]: val };
    setData(d => ({ ...d, education: newEdu }));
  };
  const updateProject = (i, field, val) => {
    const newP = [...data.projects];
    newP[i] = { ...newP[i], [field]: val };
    setData(d => ({ ...d, projects: newP }));
  };

  const TABS = ['personal','summary','experience','education','skills','projects'];

  return (
    <div className="builder">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Left: Form */}
      <div className="builder-form">
        <div className="bf-header">
          <h2>Resume Builder</h2>
          <div className="bf-actions">
            <select value={data.template} onChange={e => setData(d => ({ ...d, template: e.target.value }))}
              style={{width:'auto',padding:'0.45rem 0.75rem',fontSize:'0.82rem'}}>
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              {(userPlan === 'pro' || userPlan === 'max') && <option value="executive">Executive</option>}
              {userPlan === 'max' && <option value="creative">Creative</option>}
              {userPlan === 'max' && <option value="sidebar">Sidebar</option>}
            </select>
            <button className="btn btn-outline btn-sm" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
            <button className="btn btn-primary btn-sm" onClick={exportPDF} disabled={exporting}>{exporting ? 'Exporting...' : '📥 Export PDF'}</button>
          </div>
        </div>

        <div className="bf-tabs">
          {TABS.map(t => (
            <button key={t} className={`bf-tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        <div className="bf-content">
          {tab === 'personal' && (
            <div className="form-section">
              <h3>Personal Information</h3>
              {[['name','Full Name','Kalyan Chandana'],['title','Job Title','Software Engineer'],['email','Email','you@example.com'],['phone','Phone','+91 98765 43210'],['location','Location','Hyderabad, India'],['linkedin','LinkedIn URL','linkedin.com/in/yourname'],['website','Portfolio / Website','yoursite.com']].map(([k,l,p]) => (
                <div className="form-group" key={k}>
                  <label>{l}</label>
                  <input type="text" placeholder={p} value={data.personalInfo[k]||''}
                    onChange={e => setData(d => ({ ...d, personalInfo: { ...d.personalInfo, [k]: e.target.value } }))} />
                </div>
              ))}
            </div>
          )}

          {tab === 'summary' && (
            <div className="form-section">
              <div className="fs-header">
                <h3>Professional Summary</h3>
                <button className="btn btn-outline btn-sm" onClick={generateAISummary} disabled={aiLoading}>
                  {aiLoading ? '⏳ Generating...' : '🤖 AI Generate'}
                </button>
              </div>
              {userPlan === 'free' && <div className="ai-lock-msg">🔒 AI generation requires Pro ($1 lifetime)</div>}
              <textarea placeholder="Write a compelling 2-3 sentence summary of your professional background, key skills, and career goals..."
                value={data.summary} onChange={e => setData(d => ({ ...d, summary: e.target.value }))}
                style={{minHeight:'120px'}} />
            </div>
          )}

          {tab === 'experience' && (
            <div className="form-section">
              <div className="fs-header">
                <h3>Work Experience</h3>
                <button className="btn btn-primary btn-sm" onClick={addExp}>+ Add</button>
              </div>
              {data.experience.map((exp, i) => (
                <div className="form-block" key={i}>
                  <div className="form-block-header">
                    <span>Position {i+1}</span>
                    <div style={{display:'flex',gap:'6px'}}>
                      <button className="btn btn-outline btn-sm" onClick={() => generateAIBullets(i)} disabled={aiLoading}>
                        {aiLoading ? '⏳' : '🤖 AI Bullets'}
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => removeExp(i)}>✕</button>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Role</label><input placeholder="Software Engineer" value={exp.role} onChange={e => updateExp(i,'role',e.target.value)} /></div>
                    <div className="form-group"><label>Company</label><input placeholder="Google" value={exp.company} onChange={e => updateExp(i,'company',e.target.value)} /></div>
                  </div>
                  <div className="form-group"><label>Duration</label><input placeholder="Jan 2022 – Present" value={exp.duration} onChange={e => updateExp(i,'duration',e.target.value)} /></div>
                  <div className="form-group"><label>Description / Achievements</label>
                    <textarea placeholder="• Led development of...&#10;• Improved performance by...&#10;• Managed team of..." value={exp.description} onChange={e => updateExp(i,'description',e.target.value)} />
                  </div>
                </div>
              ))}
              {data.experience.length === 0 && <div className="empty-block">No experience added yet. Click "+ Add" to start.</div>}
            </div>
          )}

          {tab === 'education' && (
            <div className="form-section">
              <div className="fs-header">
                <h3>Education</h3>
                <button className="btn btn-primary btn-sm" onClick={addEdu}>+ Add</button>
              </div>
              {data.education.map((edu, i) => (
                <div className="form-block" key={i}>
                  <div className="form-block-header">
                    <span>Degree {i+1}</span>
                    <button className="btn btn-sm btn-danger" onClick={() => removeEdu(i)}>✕</button>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Degree</label><input placeholder="B.Tech Computer Science" value={edu.degree} onChange={e => updateEdu(i,'degree',e.target.value)} /></div>
                    <div className="form-group"><label>School</label><input placeholder="IIT Hyderabad" value={edu.school} onChange={e => updateEdu(i,'school',e.target.value)} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Year</label><input placeholder="2018 – 2022" value={edu.year} onChange={e => updateEdu(i,'year',e.target.value)} /></div>
                    <div className="form-group"><label>GPA / Score</label><input placeholder="8.5 / 10" value={edu.gpa} onChange={e => updateEdu(i,'gpa',e.target.value)} /></div>
                  </div>
                </div>
              ))}
              {data.education.length === 0 && <div className="empty-block">No education added yet.</div>}
            </div>
          )}

          {tab === 'skills' && (
            <div className="form-section">
              <h3>Skills</h3>
              <div className="form-group">
                <label>Type a skill and press Enter to add</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    placeholder="e.g. React, Python, AWS..."
                    value={skillInput}
                    onChange={handleSkillInputChange}
                    onKeyDown={addSkill}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => {
                      if (skillInput.trim()) {
                        const newSkill = skillInput.trim();
                        setData(d => ({
                          ...d,
                          skills: Array.isArray(d.skills) ? [...d.skills, newSkill] : [newSkill],
                        }));
                        setSkillInput('');
                      }
                    }}
                  >
                    + Add
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '4px' }}>
                  Press Enter or click Add
                </p>
              </div>

              {Array.isArray(data.skills) && data.skills.length > 0 ? (
                <div className="skills-list">
                  {data.skills.map((s, i) => (
                    <span className="skill-chip" key={`skill-${i}-${s}`}>
                      {s}
                      <button onClick={() => removeSkill(i)} aria-label={`Remove ${s}`}>×</button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="empty-block">
                  No skills added yet. Type a skill above and press Enter.
                </div>
              )}
            </div>
          )}

          {tab === 'projects' && (
            <div className="form-section">
              <div className="fs-header">
                <h3>Projects</h3>
                <button className="btn btn-primary btn-sm" onClick={addProject}>+ Add</button>
              </div>
              {data.projects.map((p, i) => (
                <div className="form-block" key={i}>
                  <div className="form-block-header">
                    <span>Project {i+1}</span>
                    <button className="btn btn-sm btn-danger" onClick={() => removeProject(i)}>✕</button>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Project Name</label><input placeholder="ResumeForge AI" value={p.name} onChange={e => updateProject(i,'name',e.target.value)} /></div>
                    <div className="form-group"><label>Tech Stack</label><input placeholder="React, Firebase, Claude AI" value={p.tech} onChange={e => updateProject(i,'tech',e.target.value)} /></div>
                  </div>
                  <div className="form-group"><label>Link</label><input placeholder="github.com/yourproject" value={p.link} onChange={e => updateProject(i,'link',e.target.value)} /></div>
                  <div className="form-group"><label>Description</label><textarea placeholder="Built a full-stack resume builder with AI-powered analysis..." value={p.description} onChange={e => updateProject(i,'description',e.target.value)} /></div>
                </div>
              ))}
              {data.projects.length === 0 && <div className="empty-block">No projects added yet.</div>}
            </div>
          )}
        </div>
      </div>

      {/* Right: Live preview */}
      <div className="builder-preview">
        <div className="bp-header">
          <span>Live Preview</span>
          <span style={{fontSize:'0.78rem',color:'var(--text3)'}}>Updates as you type</span>
        </div>
        <div className="bp-scroll">
          <div ref={previewRef}>
            <ResumePreview data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
