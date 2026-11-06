import React from 'react';
import { Mail, Phone, MapPin, Linkedin, ShieldCheck, TrendingUp } from 'lucide-react';

export default function ExecutiveResume({ resume, themeColor, fontFamily, fontSize, lineSpacing, sectionVisibility }) {
  const p = resume.personalInfo || {};
  const experiences = resume.experiences || [];
  const educations = resume.educations || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

  const navy = themeColor || '#0F172A';

  return (
    <div className={`p-8 bg-white text-slate-900 leading-${lineSpacing || 'normal'}`} style={{ fontFamily: fontFamily || 'Roboto, sans-serif' }}>
      {/* Executive Header */}
      {sectionVisibility?.personal !== false && (
        <div className="border-b-4 pb-5 mb-5" style={{ borderColor: navy }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight uppercase" style={{ color: navy }}>
                {p.fullName || resume.title}
              </h1>
              <p className="text-sm font-semibold tracking-wide text-slate-600 uppercase mt-1">
                {p.jobTitle || resume.targetRole || 'Chief Technology Officer / VP of Engineering'}
              </p>
            </div>

            <div className="text-right text-xs text-slate-500 space-y-0.5">
              {p.email && <div>{p.email}</div>}
              {p.phone && <div>{p.phone}</div>}
              {p.location && <div>{p.location}</div>}
              {p.linkedinUrl && <div>{p.linkedinUrl}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Executive Value Proposition / Summary */}
      {sectionVisibility?.summary !== false && resume.summary && (
        <div className="mb-5 bg-slate-50 p-4 rounded border-l-4" style={{ borderColor: navy }}>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" /> Executive Profile & Leadership Philosophy
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed font-normal">
            {resume.summary}
          </p>
        </div>
      )}

      {/* Core Competencies Matrix */}
      {sectionVisibility?.skills !== false && skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200">
            Executive Competencies & Strategic Leadership
          </h2>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                <span className="font-medium">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {sectionVisibility?.experience !== false && experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-1 border-b border-slate-200">
            Executive Career History
          </h2>
          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-xs text-slate-900 uppercase">
                    {exp.position} <span className="font-medium text-slate-600 normal-case">| {exp.company}</span>
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.location && <div className="text-[11px] text-slate-500 italic">{exp.location}</div>}
                {exp.description && <p className="text-xs text-slate-700 mt-1">{exp.description}</p>}
                {exp.bulletPoints && (
                  <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-xs text-slate-700">
                    {exp.bulletPoints.split('\n').filter(b => b.trim()).map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">{b.replace(/^[-*•\d.]+\s*/, '')}</li>
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
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200">
            Academic Credentials & Advanced Studies
          </h2>
          <div className="space-y-2">
            {educations.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-xs text-slate-900">{edu.degree}</span>
                  {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                  <div className="text-xs text-slate-600">{edu.institution}</div>
                </div>
                <span className="text-xs text-slate-500">
                  {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Board Memberships & Certifications */}
      {sectionVisibility?.certifications !== false && certifications.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200">
            Certifications, Honors & Affiliations
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-800">
            {certifications.map((c, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                <span><span className="font-semibold">{c.name}</span> {c.issuer ? `(${c.issuer})` : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

