import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Sparkles } from 'lucide-react';

export default function CreativeResume({ resume, themeColor, fontFamily, fontSize, lineSpacing, sectionVisibility }) {
  const p = resume.personalInfo || {};
  const experiences = resume.experiences || [];
  const educations = resume.educations || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

  const accent = themeColor || '#7C3AED';

  return (
    <div className={`bg-white text-slate-800 leading-${lineSpacing || 'normal'}`} style={{ fontFamily: fontFamily || 'Poppins, sans-serif' }}>
      {/* Vibrant Gradient Header Banner */}
      {sectionVisibility?.personal !== false && (
        <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-500 text-white p-7">
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 text-cyan-200 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Creative Portfolio Resume
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                {p.fullName || resume.title}
              </h1>
              <p className="text-base text-purple-100 font-medium mt-1">
                {p.jobTitle || resume.targetRole || 'Creative Director & Designer'}
              </p>
            </div>

            <div className="text-right text-xs text-purple-100 space-y-0.5">
              {p.email && <div>{p.email}</div>}
              {p.phone && <div>{p.phone}</div>}
              {p.location && <div>{p.location}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Two Column Body */}
      <div className="p-7 grid grid-cols-12 gap-6">
        {/* Left Column (Main content) */}
        <div className="col-span-8 space-y-5">
          {/* Summary */}
          {sectionVisibility?.summary !== false && resume.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">
                About & Creative Vision
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {resume.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {sectionVisibility?.experience !== false && experiences.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-3">
                Experience & Productions
              </h2>
              <div className="space-y-4 border-l-2 border-purple-200 pl-3 ml-1">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-purple-600 border-2 border-white" />
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-xs text-slate-900">{exp.position}</span>
                      <span className="text-[10px] text-purple-600 font-semibold">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">{exp.company}</div>
                    {exp.description && <p className="text-xs text-slate-600 mt-1">{exp.description}</p>}
                    {exp.bulletPoints && (
                      <ul className="mt-1 space-y-0.5 text-xs text-slate-700 list-disc ml-3">
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">
                Featured Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj, idx) => (
                  <div key={idx} className="p-2.5 bg-purple-50/40 rounded-lg border border-purple-100">
                    <div className="font-bold text-xs text-purple-950">{proj.title}</div>
                    {proj.technologies && <div className="text-[10px] text-purple-600 font-medium">Tools: {proj.technologies}</div>}
                    {proj.description && <p className="text-xs text-slate-700 mt-0.5">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="col-span-4 space-y-5 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
          {/* Skills with stylized bars / chips */}
          {sectionVisibility?.skills !== false && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5">
                Creative Arsenal
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white text-purple-800 rounded-md text-[11px] font-medium shadow-sm border border-purple-100">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {sectionVisibility?.education !== false && educations.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Education
              </h2>
              <div className="space-y-2 text-xs">
                {educations.map((edu, idx) => (
                  <div key={idx}>
                    <div className="font-semibold text-slate-900">{edu.degree}</div>
                    <div className="text-slate-500 text-[11px]">{edu.institution}</div>
                    <div className="text-[10px] text-purple-600 font-medium">
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Accreditations
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {certifications.map((c, idx) => (
                  <div key={idx} className="text-[11px]">
                    <span className="font-medium text-slate-900">• {c.name}</span>
                    {c.issuer && <span className="text-slate-500 block pl-2 text-[10px]">{c.issuer}</span>}
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

