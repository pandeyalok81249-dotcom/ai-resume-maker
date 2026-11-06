import React from 'react';
import { BookOpen, Award, FileText } from 'lucide-react';

export default function AcademicResume({ resume, themeColor, fontFamily, fontSize, lineSpacing, sectionVisibility }) {
  const p = resume.personalInfo || {};
  const experiences = resume.experiences || [];
  const educations = resume.educations || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];
  const additional = resume.additionalSections || [];

  return (
    <div className={`p-8 bg-white text-slate-900 leading-${lineSpacing || 'normal'}`} style={{ fontFamily: fontFamily || 'Merriweather, serif' }}>
      {/* CV Header */}
      {sectionVisibility?.personal !== false && (
        <div className="text-center pb-4 mb-4 border-b border-slate-400">
          <h1 className="text-2xl font-serif font-bold tracking-tight text-slate-950 uppercase">
            {p.fullName || resume.title}
          </h1>
          <p className="text-xs font-serif italic text-slate-700 mt-1">
            {p.jobTitle || resume.targetRole || 'Postdoctoral Fellow & Researcher'}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-0.5 mt-2 text-xs text-slate-600">
            {p.location && <span>{p.location}</span>}
            {p.email && <span>• {p.email}</span>}
            {p.phone && <span>• {p.phone}</span>}
            {p.portfolioUrl && <span>• {p.portfolioUrl}</span>}
          </div>
        </div>
      )}

      {/* Research Statement / Summary */}
      {sectionVisibility?.summary !== false && resume.summary && (
        <div className="mb-4">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Research Statement & Academic Focus
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed text-justify">
            {resume.summary}
          </p>
        </div>
      )}

      {/* Education First for Academics */}
      {sectionVisibility?.education !== false && educations.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Education
          </h2>
          <div className="space-y-2.5">
            {educations.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span> in {edu.fieldOfStudy || 'Field'}
                  <div className="italic text-slate-700">{edu.institution}</div>
                  {edu.achievements && <div className="text-[11px] text-slate-600">Dissertation / Honors: {edu.achievements}</div>}
                </div>
                <span className="text-slate-600 italic">
                  {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Academic Appointments / Research Experience */}
      {sectionVisibility?.experience !== false && experiences.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Academic Appointments & Teaching Experience
          </h2>
          <div className="space-y-3">
            {experiences.map((exp, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{exp.position}</span>
                  <span className="text-slate-600 italic">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="italic text-slate-700">{exp.company}</div>
                {exp.description && <p className="text-slate-800 mt-1">{exp.description}</p>}
                {exp.bulletPoints && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-800">
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

      {/* Research Projects & Grants */}
      {sectionVisibility?.projects !== false && projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Funded Research & Publications
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <span className="font-bold text-slate-900">• {proj.title}</span>
                {proj.technologies && <span className="italic text-slate-600"> — {proj.technologies}</span>}
                {proj.description && <p className="text-slate-700 mt-0.5 pl-3">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Methodologies & Skills */}
      {sectionVisibility?.skills !== false && skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Research Methodologies & Technical Skills
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed">
            {skills.map(s => s.name).join('  •  ')}
          </p>
        </div>
      )}

      {/* Honors & Fellowships */}
      {sectionVisibility?.certifications !== false && certifications.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Fellowships, Grants & Honors
          </h2>
          <div className="space-y-1 text-xs text-slate-800">
            {certifications.map((c, idx) => (
              <div key={idx}>
                • <span className="font-bold">{c.name}</span> {c.issuer ? `— ${c.issuer}` : ''} {c.issueDate ? `(${c.issueDate})` : ''}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

