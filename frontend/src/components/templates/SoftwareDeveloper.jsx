import React from 'react';
import { Terminal, Github, Globe, Mail, Phone, MapPin, ExternalLink, Code2 } from 'lucide-react';

export default function SoftwareDeveloper({ resume, themeColor, fontFamily, fontSize, lineSpacing, sectionVisibility }) {
  const p = resume.personalInfo || {};
  const experiences = resume.experiences || [];
  const educations = resume.educations || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

  const accentColor = themeColor || '#06B6D4';

  return (
    <div className={`p-7 bg-white text-slate-850 leading-${lineSpacing || 'normal'}`} style={{ fontFamily: fontFamily || 'Inter, sans-serif' }}>
      {/* Dev Header */}
      {sectionVisibility?.personal !== false && (
        <div className="bg-slate-900 text-white p-5 rounded-lg mb-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <h1 className="text-2xl font-bold tracking-tight font-mono text-white">
                  {p.fullName || resume.title}
                </h1>
              </div>
              <p className="text-sm font-mono text-cyan-300 mt-1">
                &gt; {p.jobTitle || resume.targetRole || 'Full-Stack Software Engineer'}
              </p>
            </div>

            <div className="text-right text-[11px] font-mono text-slate-300 space-y-0.5">
              {p.email && <div>{p.email}</div>}
              {p.phone && <div>{p.phone}</div>}
              {p.location && <div>{p.location}</div>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-800 text-xs font-mono text-slate-300">
            {p.githubUrl && (
              <span className="flex items-center gap-1 text-cyan-300 hover:underline">
                <Github className="w-3.5 h-3.5" /> {p.githubUrl.replace(/^https?:\/\//, '')}
              </span>
            )}
            {p.linkedinUrl && (
              <span className="flex items-center gap-1 text-slate-300">
                <Code2 className="w-3.5 h-3.5" /> LinkedIn
              </span>
            )}
            {p.portfolioUrl && (
              <span className="flex items-center gap-1 text-emerald-400">
                <Globe className="w-3.5 h-3.5" /> Portfolio
              </span>
            )}
          </div>
        </div>
      )}

      {/* Split Layout: Left Column (Skills + Edu) | Right Column (Exp + Projects) */}
      <div className="grid grid-cols-12 gap-5">
        {/* Main Column */}
        <div className="col-span-8 space-y-5">
          {/* Summary */}
          {sectionVisibility?.summary !== false && resume.summary && (
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 pb-1 border-b-2 mb-2" style={{ borderColor: accentColor }}>
                // About & Architecture
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                {resume.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {sectionVisibility?.experience !== false && experiences.length > 0 && (
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 pb-1 border-b-2 mb-2.5" style={{ borderColor: accentColor }}>
                // Engineering Experience
              </h2>
              <div className="space-y-3.5">
                {experiences.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-xs text-slate-900">
                        {exp.position} <span className="text-slate-500 font-normal">@ {exp.company}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.description && <p className="text-xs text-slate-600 mt-0.5">{exp.description}</p>}
                    {exp.bulletPoints && (
                      <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-slate-700">
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

          {/* Projects */}
          {sectionVisibility?.projects !== false && projects.length > 0 && (
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 pb-1 border-b-2 mb-2.5" style={{ borderColor: accentColor }}>
                // Key Systems & Open Source
              </h2>
              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-xs text-slate-900">{proj.title}</span>
                      {proj.projectUrl && (
                        <span className="text-[10px] text-cyan-600 flex items-center gap-0.5 font-mono">
                          repo <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    {proj.technologies && (
                      <div className="text-[10px] font-mono text-indigo-600 mt-0.5">
                        Stack: {proj.technologies}
                      </div>
                    )}
                    {proj.description && <p className="text-xs text-slate-700 mt-1">{proj.description}</p>}
                    {proj.bulletPoints && (
                      <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-[11px] text-slate-600">
                        {proj.bulletPoints.split('\n').filter(b => b.trim()).map((b, bIdx) => (
                          <li key={bIdx}>{b.replace(/^[-*•\d.]+\s*/, '')}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="col-span-4 space-y-5">
          {/* Skills */}
          {sectionVisibility?.skills !== false && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 pb-1 border-b-2 mb-2" style={{ borderColor: accentColor }}>
                // Tech Stack
              </h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-[10px] font-medium border border-slate-200">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {sectionVisibility?.education !== false && educations.length > 0 && (
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 pb-1 border-b-2 mb-2" style={{ borderColor: accentColor }}>
                // Education
              </h2>
              <div className="space-y-2">
                {educations.map((edu, idx) => (
                  <div key={idx}>
                    <div className="font-semibold text-xs text-slate-900">{edu.institution}</div>
                    <div className="text-[11px] text-slate-600">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {sectionVisibility?.certifications !== false && certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 pb-1 border-b-2 mb-2" style={{ borderColor: accentColor }}>
                // Certs
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {certifications.map((c, idx) => (
                  <div key={idx} className="text-[11px]">
                    <div className="font-medium text-slate-900">• {c.name}</div>
                    {c.issuer && <div className="text-[10px] text-slate-500 font-mono">{c.issuer}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

