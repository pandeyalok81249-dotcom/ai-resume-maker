import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react';

export default function ModernProfessional({ resume, themeColor, fontFamily, fontSize, lineSpacing, sectionVisibility }) {
  const p = resume.personalInfo || {};
  const experiences = resume.experiences || [];
  const educations = resume.educations || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];
  const additionalSections = resume.additionalSections || [];

  return (
    <div className={`p-8 bg-white text-slate-800 leading-${lineSpacing || 'normal'}`} style={{ fontFamily }}>
      {/* Header */}
      {sectionVisibility?.personal !== false && (
        <div className="border-b-2 pb-5 mb-5" style={{ borderColor: themeColor }}>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: themeColor }}>
            {p.fullName || resume.title}
          </h1>
          <p className="text-lg font-medium text-slate-600 mt-1">
            {p.jobTitle || resume.targetRole || 'Professional'}
          </p>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-3 text-xs text-slate-500">
            {p.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" style={{ color: themeColor }} />
                {p.email}
              </span>
            )}
            {p.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" style={{ color: themeColor }} />
                {p.phone}
              </span>
            )}
            {p.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" style={{ color: themeColor }} />
                {p.location}
              </span>
            )}
            {p.linkedinUrl && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5" style={{ color: themeColor }} />
                {p.linkedinUrl}
              </span>
            )}
            {p.githubUrl && (
              <span className="flex items-center gap-1">
                <Github className="w-3.5 h-3.5" style={{ color: themeColor }} />
                {p.githubUrl}
              </span>
            )}
            {p.portfolioUrl && (
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" style={{ color: themeColor }} />
                {p.portfolioUrl}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      {sectionVisibility?.summary !== false && resume.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: themeColor }}>
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            {resume.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {sectionVisibility?.experience !== false && experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-200" style={{ color: themeColor }}>
            Work Experience
          </h2>
          <div className="space-y-3.5">
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-xs text-slate-900">
                    {exp.position} <span className="font-normal text-slate-600">at {exp.company}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.location && <div className="text-[10px] text-slate-400">{exp.location}</div>}
                {exp.description && <p className="text-xs text-slate-700 mt-1">{exp.description}</p>}
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

      {/* Skills */}
      {sectionVisibility?.skills !== false && skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b border-slate-200" style={{ color: themeColor }}>
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span
                key={skill.id || idx}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {sectionVisibility?.education !== false && educations.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-200" style={{ color: themeColor }}>
            Education
          </h2>
          <div className="space-y-2.5">
            {educations.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-xs text-slate-900">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </span>
                  <div className="text-[11px] text-slate-600">{edu.institution}</div>
                  {edu.gradeOrGpa && <div className="text-[10px] text-slate-500">GPA / Grade: {edu.gradeOrGpa}</div>}
                </div>
                <span className="text-[11px] text-slate-500">
                  {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {sectionVisibility?.projects !== false && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b border-slate-200" style={{ color: themeColor }}>
            Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-xs text-slate-900">{proj.title}</span>
                  {proj.projectUrl && (
                    <span className="text-[10px] text-indigo-600 flex items-center gap-0.5">
                      Live <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                {proj.technologies && (
                  <div className="text-[10px] font-medium" style={{ color: themeColor }}>
                    Tech: {proj.technologies}
                  </div>
                )}
                {proj.description && <p className="text-xs text-slate-700 mt-0.5">{proj.description}</p>}
                {proj.bulletPoints && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-slate-700">
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

      {/* Certifications */}
      {sectionVisibility?.certifications !== false && certifications.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b border-slate-200" style={{ color: themeColor }}>
            Certifications & Awards
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {certifications.map((cert, idx) => (
              <div key={cert.id || idx} className="text-slate-800">
                <span className="font-medium">• {cert.name}</span>
                {cert.issuer && <span className="text-slate-500"> ({cert.issuer})</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

