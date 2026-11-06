import React from 'react';

export default function ClassicCorporate({ resume, themeColor, fontFamily, fontSize, lineSpacing, sectionVisibility }) {
  const p = resume.personalInfo || {};
  const experiences = resume.experiences || [];
  const educations = resume.educations || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

  return (
    <div className={`p-8 bg-white text-slate-900 leading-${lineSpacing || 'normal'}`} style={{ fontFamily: fontFamily || 'Merriweather, serif' }}>
      {/* Centered Classic Header */}
      {sectionVisibility?.personal !== false && (
        <div className="text-center pb-4 mb-4 border-b border-slate-300">
          <h1 className="text-2xl font-serif font-bold tracking-normal uppercase text-slate-900">
            {p.fullName || resume.title}
          </h1>
          <p className="text-xs font-serif italic text-slate-600 mt-0.5">
            {p.jobTitle || resume.targetRole || 'Professional'}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5 mt-2 text-[11px] text-slate-600">
            {p.location && <span>{p.location}</span>}
            {p.phone && <span>• {p.phone}</span>}
            {p.email && <span>• {p.email}</span>}
            {p.linkedinUrl && <span>• {p.linkedinUrl}</span>}
            {p.portfolioUrl && <span>• {p.portfolioUrl}</span>}
          </div>
        </div>
      )}

      {/* Summary */}
      {sectionVisibility?.summary !== false && resume.summary && (
        <div className="mb-4">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-center border-b border-slate-300 pb-0.5 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed text-justify">
            {resume.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {sectionVisibility?.experience !== false && experiences.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-center border-b border-slate-300 pb-0.5 mb-2">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between items-baseline font-serif">
                  <span className="font-bold text-xs text-slate-900">{exp.company}</span>
                  <span className="text-[11px] text-slate-600 italic">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-[11px] italic text-slate-700">
                  <span>{exp.position}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                {exp.description && <p className="text-xs text-slate-800 mt-1">{exp.description}</p>}
                {exp.bulletPoints && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-slate-800">
                    {exp.bulletPoints.split('\n').filter(b => b.trim()).map((b, bIdx) => (
                      <li key={bIdx}>{b.replace(/^[-*•\d.]+\s*/, '')}</li>
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
        <div className="mb-4">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-center border-b border-slate-300 pb-0.5 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {educations.map((edu, idx) => (
              <div key={edu.id || idx}>
                <div className="flex justify-between items-baseline font-serif">
                  <span className="font-bold text-xs text-slate-900">{edu.institution}</span>
                  <span className="text-[11px] text-slate-600 italic">
                    {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                  </span>
                </div>
                <div className="text-[11px] text-slate-700">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  {edu.gradeOrGpa ? ` — GPA: ${edu.gradeOrGpa}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {sectionVisibility?.skills !== false && skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-center border-b border-slate-300 pb-0.5 mb-2">
            Areas of Expertise
          </h2>
          <p className="text-xs text-slate-800 text-center leading-relaxed">
            {skills.map(s => s.name).join('  •  ')}
          </p>
        </div>
      )}

      {/* Projects */}
      {sectionVisibility?.projects !== false && projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-center border-b border-slate-300 pb-0.5 mb-2">
            Key Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx}>
                <div className="font-bold text-xs font-serif text-slate-900">{proj.title}</div>
                {proj.technologies && <div className="text-[10px] italic text-slate-600">Technologies: {proj.technologies}</div>}
                {proj.description && <p className="text-xs text-slate-800 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {sectionVisibility?.certifications !== false && certifications.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-center border-b border-slate-300 pb-0.5 mb-2">
            Honors & Certifications
          </h2>
          <div className="text-xs text-slate-800 text-center space-x-3">
            {certifications.map((c, idx) => (
              <span key={idx}>• {c.name} {c.issuer ? `(${c.issuer})` : ''}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

