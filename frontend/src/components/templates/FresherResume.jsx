import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, GraduationCap, Award } from 'lucide-react';

export default function FresherResume({ resume, themeColor, fontFamily, fontSize, lineSpacing, sectionVisibility }) {
  const p = resume.personalInfo || {};
  const experiences = resume.experiences || [];
  const educations = resume.educations || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

  const primary = themeColor || '#10B981';

  return (
    <div className={`p-8 bg-white text-slate-800 leading-${lineSpacing || 'normal'}`} style={{ fontFamily: fontFamily || 'Poppins, sans-serif' }}>
      {/* Header */}
      {sectionVisibility?.personal !== false && (
        <div className="text-center pb-5 mb-5 border-b-2" style={{ borderColor: primary }}>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {p.fullName || resume.title}
          </h1>
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-600 mt-1">
            {p.jobTitle || resume.targetRole || 'Aspiring Graduate & Professional'}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>• {p.phone}</span>}
            {p.location && <span>• {p.location}</span>}
            {p.linkedinUrl && <span>• {p.linkedinUrl}</span>}
            {p.githubUrl && <span>• {p.githubUrl}</span>}
          </div>
        </div>
      )}

      {/* Career Objective / Summary */}
      {sectionVisibility?.summary !== false && resume.summary && (
        <div className="mb-5 bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            Career Objective
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            {resume.summary}
          </p>
        </div>
      )}

      {/* Education FIRST for freshers! */}
      {sectionVisibility?.education !== false && educations.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2.5 pb-1 border-b border-slate-200">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Education & Academic Background
            </h2>
          </div>
          <div className="space-y-3">
            {educations.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-xs text-slate-900">
                    {edu.degree} in {edu.fieldOfStudy || 'Major'}
                  </div>
                  <div className="text-xs text-slate-600">{edu.institution}</div>
                  {edu.gradeOrGpa && (
                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-semibold">
                      GPA / Score: {edu.gradeOrGpa}
                    </span>
                  )}
                  {edu.achievements && (
                    <p className="text-[11px] text-slate-600 mt-1 italic">{edu.achievements}</p>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5 pb-1 border-b border-slate-200">
            Academic & Independent Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-xs text-slate-900">{proj.title}</span>
                  {proj.projectUrl && <span className="text-[10px] text-emerald-600">Link available</span>}
                </div>
                {proj.technologies && (
                  <div className="text-[10px] font-medium text-emerald-700">
                    Tools & Technologies: {proj.technologies}
                  </div>
                )}
                {proj.description && <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>}
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

      {/* Technical & Soft Skills */}
      {sectionVisibility?.skills !== false && skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-200">
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience / Internships */}
      {sectionVisibility?.experience !== false && experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5 pb-1 border-b border-slate-200">
            Internships & Experience
          </h2>
          <div className="space-y-3">
            {experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-xs text-slate-900">
                    {exp.position} — <span className="text-slate-600">{exp.company}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="text-xs text-slate-600 mt-0.5">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Achievements */}
      {sectionVisibility?.certifications !== false && certifications.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-slate-200">
            <Award className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Certificates & Extracurriculars
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {certifications.map((c, idx) => (
              <div key={idx} className="text-slate-700">
                • <span className="font-medium text-slate-900">{c.name}</span>
                {c.issuer && <span className="text-slate-500"> ({c.issuer})</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

