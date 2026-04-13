import React from 'react';
import './ResumePreview.css';

export default function ResumePreview({ data }) {
  const { template = 'classic' } = data;
  switch (template) {
    case 'modern': return <ModernTemplate data={data} />;
    case 'minimal': return <MinimalTemplate data={data} />;
    case 'executive': return <ExecutiveTemplate data={data} />;
    case 'creative': return <CreativeTemplate data={data} />;
    case 'sidebar': return <SidebarTemplate data={data} />;
    default: return <ClassicTemplate data={data} />;
  }
}

/* ── SHARED HELPERS ── */
function BulletLines({ text }) {
  if (!text) return null;
  return (
    <ul className="rp-bullets">
      {text.split('\n').filter(l => l.trim()).map((line, i) => (
        <li key={i}>{line.replace(/^[•\-\*]\s*/, '')}</li>
      ))}
    </ul>
  );
}

/* ══════════════════════════════════════════
   1. CLASSIC TEMPLATE
══════════════════════════════════════════ */
function ClassicTemplate({ data }) {
  const {
    personalInfo: p = {},
    summary,
    experience = [],
    education  = [],
    skills     = [],
    projects   = [],
  } = data;

  const safeSkills     = Array.isArray(skills)     ? skills     : [];
  const safeExperience = Array.isArray(experience) ? experience : [];
  const safeEducation  = Array.isArray(education)  ? education  : [];
  const safeProjects   = Array.isArray(projects)   ? projects   : [];
  return (
    <div className="rp rp-classic">
      <div className="rpc-header">
        <h1>{p.name || 'Your Name'}</h1>
        <div className="rpc-title">{p.title}</div>
        <div className="rpc-contact">
          {p.email    && <span>{p.email}</span>}
          {p.phone    && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.website  && <span>{p.website}</span>}
        </div>
      </div>

      {summary && (
        <div className="rp-section">
          <div className="rp-section-title">Professional Summary</div>
          <p className="rp-text">{summary}</p>
        </div>
      )}

      {safeExperience.length > 0 && (
        <div className="rp-section">
          <div className="rp-section-title">Experience</div>
          {safeExperience.map((e, i) => (
            <div className="rp-item" key={`exp-${i}`}>
              <div className="rp-item-header">
                <div><strong>{e.role}</strong>{e.company ? ` — ${e.company}` : ''}</div>
                <div className="rp-date">{e.duration}</div>
              </div>
              <BulletLines text={e.description} />
            </div>
          ))}
        </div>
      )}

      {safeEducation.length > 0 && (
        <div className="rp-section">
          <div className="rp-section-title">Education</div>
          {safeEducation.map((e, i) => (
            <div className="rp-item" key={`edu-${i}`}>
              <div className="rp-item-header">
                <div><strong>{e.degree}</strong>{e.school ? ` — ${e.school}` : ''}</div>
                <div className="rp-date">{e.year}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {safeSkills.length > 0 ? (
        <div className="rp-section">
          <div className="rp-section-title">Skills</div>
          <div className="rp-skills-wrap">
            {safeSkills.map((s, i) => (
              <span className="rp-skill" key={`skill-${i}-${s}`}>{s}</span>
            ))}
          </div>
        </div>
      ) : null}

      {safeProjects.length > 0 && (
        <div className="rp-section">
          <div className="rp-section-title">Projects</div>
          {safeProjects.map((proj, i) => (
            <div className="rp-item" key={`proj-${i}`}>
              <div className="rp-item-header">
                <div><strong>{proj.name}</strong>{proj.tech ? ` · ${proj.tech}` : ''}</div>
                {proj.link && <div className="rp-date">{proj.link}</div>}
              </div>
              <BulletLines text={proj.description} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   2. MODERN TEMPLATE
══════════════════════════════════════════ */
function ModernTemplate({ data }) {
  const { personalInfo: p = {}, summary, experience = [], education = [], skills = [], projects = [] } = data;
  const safeSkills     = Array.isArray(skills)     ? skills     : [];
  const safeExperience = Array.isArray(experience) ? experience : [];
  const safeEducation  = Array.isArray(education)  ? education  : [];
  const safeProjects   = Array.isArray(projects)   ? projects   : [];
  return (
    <div className="rp rp-modern">
      <div className="rpm-header">
        <div className="rpm-accent-bar" />
        <div className="rpm-name-block">
          <h1>{p.name || 'Your Name'}</h1>
          <div className="rpm-title">{p.title}</div>
        </div>
        <div className="rpm-contact">
          {p.email    && <div>✉ {p.email}</div>}
          {p.phone    && <div>✆ {p.phone}</div>}
          {p.location && <div>⌖ {p.location}</div>}
          {p.linkedin && <div>in {p.linkedin}</div>}
        </div>
      </div>

      {summary && (
        <div className="rp-section rpm-section">
          <div className="rpm-section-title">About</div>
          <p className="rp-text">{summary}</p>
        </div>
      )}

      {safeExperience.length > 0 && (
        <div className="rp-section rpm-section">
          <div className="rpm-section-title">Experience</div>
          {safeExperience.map((e, i) => (
            <div className="rpm-item" key={`exp-${i}`}>
              <div className="rpm-dot" />
              <div className="rpm-item-body">
                <div className="rpm-item-header">
                  <strong>{e.role}</strong>
                  <span className="rpm-company">{e.company}</span>
                  <span className="rp-date">{e.duration}</span>
                </div>
                <BulletLines text={e.description} />
              </div>
            </div>
          ))}
        </div>
      )}

      {safeEducation.length > 0 && (
        <div className="rp-section rpm-section">
          <div className="rpm-section-title">Education</div>
          {safeEducation.map((e, i) => (
            <div className="rpm-item" key={`edu-${i}`}>
              <div className="rpm-dot" />
              <div className="rpm-item-body">
                <div className="rpm-item-header">
                  <strong>{e.degree}</strong>
                  <span className="rpm-company">{e.school}</span>
                  <span className="rp-date">{e.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {safeSkills.length > 0 && (
        <div className="rp-section rpm-section">
          <div className="rpm-section-title">Skills</div>
          <div className="rp-skills-wrap">
            {safeSkills.map((s, i) => (
              <span className="rpm-skill" key={`skill-${i}-${s}`}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {safeProjects.length > 0 && (
        <div className="rp-section rpm-section">
          <div className="rpm-section-title">Projects</div>
          {safeProjects.map((pr, i) => (
            <div className="rpm-item" key={`proj-${i}`}>
              <div className="rpm-dot" />
              <div className="rpm-item-body">
                <div className="rpm-item-header">
                  <strong>{pr.name}</strong>
                  {pr.tech && <span className="rpm-company">{pr.tech}</span>}
                </div>
                <BulletLines text={pr.description} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   3. MINIMAL TEMPLATE
══════════════════════════════════════════ */
function MinimalTemplate({ data }) {
  const { personalInfo: p = {}, summary, experience = [], education = [], skills = [], projects = [] } = data;
  const safeSkills     = Array.isArray(skills)     ? skills     : [];
  const safeExperience = Array.isArray(experience) ? experience : [];
  const safeEducation  = Array.isArray(education)  ? education  : [];
  const safeProjects   = Array.isArray(projects)   ? projects   : [];
  return (
    <div className="rp rp-minimal">
      <div className="rpmn-header">
        <h1>{p.name || 'Your Name'}</h1>
        {p.title && <div className="rpmn-title">{p.title}</div>}
        <div className="rpmn-contact">
          {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(' · ')}
        </div>
      </div>

      {summary && (
        <>
          <div className="rpmn-divider" />
          <p className="rp-text rpmn-summary">{summary}</p>
        </>
      )}

      {safeExperience.length > 0 && (
        <>
          <div className="rpmn-divider" />
          <div className="rpmn-section-title">EXPERIENCE</div>
          {safeExperience.map((e, i) => (
            <div className="rpmn-item" key={`exp-${i}`}>
              <div className="rpmn-item-top">
                <span className="rpmn-role">{e.role}</span>
                <span className="rpmn-date">{e.duration}</span>
              </div>
              <div className="rpmn-company">{e.company}</div>
              <BulletLines text={e.description} />
            </div>
          ))}
        </>
      )}

      {safeEducation.length > 0 && (
        <>
          <div className="rpmn-divider" />
          <div className="rpmn-section-title">EDUCATION</div>
          {safeEducation.map((e, i) => (
            <div className="rpmn-item" key={`edu-${i}`}>
              <div className="rpmn-item-top">
                <span className="rpmn-role">{e.degree}</span>
                <span className="rpmn-date">{e.year}</span>
              </div>
              <div className="rpmn-company">{e.school}{e.gpa ? ` · ${e.gpa}` : ''}</div>
            </div>
          ))}
        </>
      )}

      {safeSkills.length > 0 && (
        <>
          <div className="rpmn-divider" />
          <div className="rpmn-section-title">SKILLS</div>
          <p className="rp-text">{safeSkills.join(' · ')}</p>
        </>
      )}

      {safeProjects.length > 0 && (
        <>
          <div className="rpmn-divider" />
          <div className="rpmn-section-title">PROJECTS</div>
          {safeProjects.map((pr, i) => (
            <div className="rpmn-item" key={`proj-${i}`}>
              <div className="rpmn-item-top">
                <span className="rpmn-role">{pr.name}</span>
                {pr.link && <span className="rpmn-date">{pr.link}</span>}
              </div>
              {pr.tech && <div className="rpmn-company">{pr.tech}</div>}
              <BulletLines text={pr.description} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   4. EXECUTIVE TEMPLATE
══════════════════════════════════════════ */
function ExecutiveTemplate({ data }) {
  const { personalInfo: p = {}, summary, experience = [], education = [], skills = [], projects = [] } = data;
  const safeSkills     = Array.isArray(skills)     ? skills     : [];
  const safeExperience = Array.isArray(experience) ? experience : [];
  const safeEducation  = Array.isArray(education)  ? education  : [];
  const safeProjects   = Array.isArray(projects)   ? projects   : [];
  return (
    <div className="rp rp-executive">
      <div className="rpe-header">
        <h1>{p.name || 'Your Name'}</h1>
        <div className="rpe-title">{p.title}</div>
        <div className="rpe-divider" />
        <div className="rpe-contact">
          {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </div>
      </div>

      {summary && (
        <div className="rpe-section">
          <div className="rpe-section-title">Executive Summary</div>
          <p className="rp-text">{summary}</p>
        </div>
      )}

      {safeExperience.length > 0 && (
        <div className="rpe-section">
          <div className="rpe-section-title">Professional Experience</div>
          {safeExperience.map((e, i) => (
            <div className="rpe-item" key={`exp-${i}`}>
              <div className="rpe-item-header">
                <div className="rpe-role">{e.role}</div>
                <div className="rpe-company-date">{e.company} · {e.duration}</div>
              </div>
              <BulletLines text={e.description} />
            </div>
          ))}
        </div>
      )}

      {safeEducation.length > 0 && (
        <div className="rpe-section">
          <div className="rpe-section-title">Education</div>
          {safeEducation.map((e, i) => (
            <div className="rpe-item" key={`edu-${i}`}>
              <div className="rpe-item-header">
                <div className="rpe-role">{e.degree}</div>
                <div className="rpe-company-date">{e.school} · {e.year}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {safeSkills.length > 0 && (
        <div className="rpe-section">
          <div className="rpe-section-title">Core Competencies</div>
          <div className="rpe-skills">
            {safeSkills.map((s, i) => <span key={`skill-${i}-${s}`}>{s}</span>)}
          </div>
        </div>
      )}

      {safeProjects.length > 0 && (
        <div className="rpe-section">
          <div className="rpe-section-title">Notable Projects</div>
          {safeProjects.map((pr, i) => (
            <div className="rpe-item" key={`proj-${i}`}>
              <div className="rpe-item-header">
                <div className="rpe-role">{pr.name}</div>
                {pr.tech && <div className="rpe-company-date">{pr.tech}</div>}
              </div>
              <BulletLines text={pr.description} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   5. CREATIVE TEMPLATE
══════════════════════════════════════════ */
function CreativeTemplate({ data }) {
  const { personalInfo: p = {}, summary, experience = [], education = [], skills = [], projects = [] } = data;
  const safeSkills     = Array.isArray(skills)     ? skills     : [];
  const safeExperience = Array.isArray(experience) ? experience : [];
  const safeEducation  = Array.isArray(education)  ? education  : [];
  const safeProjects   = Array.isArray(projects)   ? projects   : [];
  return (
    <div className="rp rp-creative">
      <div className="rpct-header">
        <div className="rpct-name-block">
          <h1>{p.name || 'Your Name'}</h1>
          <div className="rpct-title">{p.title}</div>
        </div>
        <div className="rpct-contact">
          {p.email    && <div>{p.email}</div>}
          {p.phone    && <div>{p.phone}</div>}
          {p.location && <div>{p.location}</div>}
          {p.linkedin && <div>{p.linkedin}</div>}
        </div>
      </div>

      {summary && (
        <div className="rpct-section">
          <div className="rpct-section-label">About Me</div>
          <p className="rp-text">{summary}</p>
        </div>
      )}

      {safeExperience.length > 0 && (
        <div className="rpct-section">
          <div className="rpct-section-label">Experience</div>
          {safeExperience.map((e, i) => (
            <div className="rpct-item" key={`exp-${i}`}>
              <div className="rpct-item-accent" />
              <div className="rpct-item-body">
                <div className="rpct-role">{e.role}</div>
                <div className="rpct-sub">{e.company} · {e.duration}</div>
                <BulletLines text={e.description} />
              </div>
            </div>
          ))}
        </div>
      )}

      {safeEducation.length > 0 && (
        <div className="rpct-section">
          <div className="rpct-section-label">Education</div>
          {safeEducation.map((e, i) => (
            <div className="rpct-item" key={`edu-${i}`}>
              <div className="rpct-item-accent" />
              <div className="rpct-item-body">
                <div className="rpct-role">{e.degree}</div>
                <div className="rpct-sub">{e.school} · {e.year}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {safeSkills.length > 0 && (
        <div className="rpct-section">
          <div className="rpct-section-label">Skills</div>
          <div className="rpct-skills">
            {safeSkills.map((s, i) => <span key={`skill-${i}-${s}`}>{s}</span>)}
          </div>
        </div>
      )}

      {safeProjects.length > 0 && (
        <div className="rpct-section">
          <div className="rpct-section-label">Projects</div>
          {safeProjects.map((pr, i) => (
            <div className="rpct-item" key={`proj-${i}`}>
              <div className="rpct-item-accent" />
              <div className="rpct-item-body">
                <div className="rpct-role">{pr.name}</div>
                {pr.tech && <div className="rpct-sub">{pr.tech}</div>}
                <BulletLines text={pr.description} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   6. SIDEBAR TEMPLATE
══════════════════════════════════════════ */
function SidebarTemplate({ data }) {
  const { personalInfo: p = {}, summary, experience = [], education = [], skills = [], projects = [] } = data;
  const safeSkills     = Array.isArray(skills)     ? skills     : [];
  const safeExperience = Array.isArray(experience) ? experience : [];
  const safeEducation  = Array.isArray(education)  ? education  : [];
  const safeProjects   = Array.isArray(projects)   ? projects   : [];
  return (
    <div className="rp rp-sidebar">
      <div className="rps-left">
        <div className="rps-avatar">{(p.name || 'Y').charAt(0)}</div>
        <div className="rps-name">{p.name || 'Your Name'}</div>
        <div className="rps-title">{p.title}</div>

        <div className="rps-section-title">Contact</div>
        {p.email    && <div className="rps-contact-item">{p.email}</div>}
        {p.phone    && <div className="rps-contact-item">{p.phone}</div>}
        {p.location && <div className="rps-contact-item">{p.location}</div>}
        {p.linkedin && <div className="rps-contact-item">{p.linkedin}</div>}

        {safeSkills.length > 0 && (
          <>
            <div className="rps-section-title" style={{marginTop:'1rem'}}>Skills</div>
            {safeSkills.map((s, i) => (
              <div className="rps-skill-row" key={`skill-${i}-${s}`}>
                <span>{s}</span>
                <div className="rps-skill-bar">
                  <div className="rps-skill-fill" style={{width:`${70 + (i % 4) * 8}%`}} />
                </div>
              </div>
            ))}
          </>
        )}

        {safeEducation.length > 0 && (
          <>
            <div className="rps-section-title" style={{marginTop:'1rem'}}>Education</div>
            {safeEducation.map((e, i) => (
              <div className="rps-edu-item" key={`edu-${i}`}>
                <div className="rps-edu-degree">{e.degree}</div>
                <div className="rps-edu-school">{e.school}</div>
                <div className="rps-edu-year">{e.year}</div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="rps-right">
        {summary && (
          <div className="rps-r-section">
            <div className="rps-r-title">About</div>
            <p className="rp-text">{summary}</p>
          </div>
        )}

        {safeExperience.length > 0 && (
          <div className="rps-r-section">
            <div className="rps-r-title">Experience</div>
            {safeExperience.map((e, i) => (
              <div className="rps-r-item" key={`exp-${i}`}>
                <div className="rps-r-item-head">
                  <strong>{e.role}</strong>
                  <span className="rp-date">{e.duration}</span>
                </div>
                <div className="rps-r-company">{e.company}</div>
                <BulletLines text={e.description} />
              </div>
            ))}
          </div>
        )}

        {safeProjects.length > 0 && (
          <div className="rps-r-section">
            <div className="rps-r-title">Projects</div>
            {safeProjects.map((pr, i) => (
              <div className="rps-r-item" key={`proj-${i}`}>
                <div className="rps-r-item-head">
                  <strong>{pr.name}</strong>
                  {pr.tech && <span className="rp-date">{pr.tech}</span>}
                </div>
                <BulletLines text={pr.description} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
