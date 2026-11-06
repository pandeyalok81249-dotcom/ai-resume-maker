import React from 'react';

export default function Minimalist({ resume, themeColor, fontFamily, fontSize, lineSpacing, sectionVisibility }) {
  const p = resume.personalInfo || {};
  const experiences = resume.experiences || [];
  const educations = resume.educations || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

  return (
    <div className={`p-8 bg-white text-slate-850 leading-${lineSpacing || 'normal'}`} style={{ fontFamily: fontFamily || 'Inter, sans-serif' }}>
      {/* Header */}
      {sectionVisibility?.personal !== false && (
        <div className="mb-6">
          <h1 className="text-3xl font-light tracking-tight text-slate-900">
            {p.fullName || resume.title}
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mt-1">
            {p.jobTitle || resume.targetRole || 'Professional'}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[11px] text-slate-500 font-light">
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.location && <span>{p.location}</span>}
            {p.linkedinUrl && <span>{p.linkedinUrl}</span>}
            {p.githubUrl && <span>{p.githubUrl}</span>}
          </div>
        </div>
      )}

      {/* Summary */}
      {sectionVisibility?.summary !== false && resume.summary && (
        <div className="mb-6">
          <p className="text-xs text-slate-700 font-light leading-relaxed">
            {resume.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {sectionVisibility?.experience !== false && experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between items-baseline">
                  <div className="text-xs font-medium text-slate-900">
                    {exp.position} <span className="text-slate-400 font-light">/ {exp.company}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-light">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                {exp.description && <p className="text-xs text-slate-600 font-light mt-1">{exp.description}</p>}
                {exp.bulletPoints && (
                  <ul className="mt-1 space-y-1 text-xs text-slate-600 font-light">
                    {exp.bulletPoints.split('\n').filter(b => b.trim()).map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <span className="text-slate-300 select-none">—</span>
                        <span>{b.replace(/^[-*•\d.]+\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {sectionVisibility?.education !== false && educations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {educations.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between items-baseline">
                <div className="text-xs text-slate-900 font-medium">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  <div className="text-[11px] text-slate-500 font-light">{edu.institution}</div>
                </div>
                <div className="text-[10px] text-slate-400 font-light">
                  {edu.startDate} — {edu.current ? 'Present' : edu.endDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {sectionVisibility?.skills !== false && skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-700 font-light">
            {skills.map((s, idx) => (
              <span key={idx}>{s.name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {sectionVisibility?.projects !== false && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <span className="text-xs font-medium text-slate-900">{proj.title}</span>
                {proj.technologies && <span className="text-[10px] text-slate-400 font-light"> ({proj.technologies})</span>}
                {proj.description && <p className="text-xs text-slate-600 font-light mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

