/**
 * Resume Export & Import Utilities
 * Supports:
 * - JSON Resume standard (jsonresume.org)
 * - Clean ASCII Plain Text ATS-safe copy
 * - Markdown format (.md)
 */

export function exportToJsonResume(resume) {
  const p = resume.personalInfo || {};
  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: p.fullName || "",
      label: p.jobTitle || resume.targetRole || "",
      email: p.email || "",
      phone: p.phone || "",
      url: p.portfolioUrl || "",
      summary: resume.summary || "",
      location: {
        address: p.location || "",
      },
      profiles: [
        ...(p.linkedinUrl ? [{ network: "LinkedIn", url: p.linkedinUrl }] : []),
        ...(p.githubUrl ? [{ network: "GitHub", url: p.githubUrl }] : []),
      ],
    },
    work: (resume.experiences || []).map((exp) => ({
      name: exp.company || "",
      position: exp.position || "",
      location: exp.location || "",
      startDate: exp.startDate || "",
      endDate: exp.isCurrent ? "Present" : exp.endDate || "",
      summary: exp.description || "",
      highlights: (exp.bulletPoints || "")
        .split('\n')
        .map((b) => b.replace(/^[•\s\-\*]+/, '').trim())
        .filter(Boolean),
    })),
    education: (resume.educations || []).map((edu) => ({
      institution: edu.institution || "",
      area: edu.fieldOfStudy || "",
      studyType: edu.degree || "",
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
      score: edu.gpa || "",
      courses: edu.achievements ? [edu.achievements] : [],
    })),
    skills: (resume.skills || []).map((s) => ({
      name: s.name || "",
      level: s.proficiency || "Intermediate",
      category: s.category || "General",
    })),
    projects: (resume.projects || []).map((proj) => ({
      name: proj.name || "",
      description: proj.description || "",
      highlights: proj.technologies ? proj.technologies.split(',').map((t) => t.trim()) : [],
      url: proj.link || "",
    })),
    certificates: (resume.certifications || []).map((cert) => ({
      name: cert.name || "",
      issuer: cert.issuer || "",
      date: cert.issueDate || "",
      url: cert.credentialUrl || "",
    })),
    meta: {
      canonical: "https://resumeai.com",
      version: "v1.0.0",
      lastModified: new Date().toISOString(),
    },
  };
}

export function parseJsonResume(rawJson) {
  try {
    const data = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;

    // Detect if already internal format
    if (data.personalInfo || data.experiences || data.templateKey) {
      return {
        title: data.title || "Imported Resume",
        targetRole: data.targetRole || data.personalInfo?.jobTitle || "Professional",
        templateKey: data.templateKey || "modern-professional",
        themeColor: data.themeColor || "#4F46E5",
        fontFamily: data.fontFamily || "Inter",
        summary: data.summary || "",
        personalInfo: {
          fullName: data.personalInfo?.fullName || "",
          jobTitle: data.personalInfo?.jobTitle || "",
          email: data.personalInfo?.email || "",
          phone: data.personalInfo?.phone || "",
          location: data.personalInfo?.location || "",
          linkedinUrl: data.personalInfo?.linkedinUrl || "",
          githubUrl: data.personalInfo?.githubUrl || "",
          portfolioUrl: data.personalInfo?.portfolioUrl || "",
        },
        experiences: data.experiences || [],
        educations: data.educations || [],
        skills: data.skills || [],
        projects: data.projects || [],
        certifications: data.certifications || [],
      };
    }

    // Convert from standard JSON Resume schema
    const basics = data.basics || {};
    const linkedin = (basics.profiles || []).find((pr) => pr.network?.toLowerCase().includes('linkedin'))?.url || "";
    const github = (basics.profiles || []).find((pr) => pr.network?.toLowerCase().includes('github'))?.url || "";

    return {
      title: `${basics.name || 'Candidate'} Resume`,
      targetRole: basics.label || "Professional",
      templateKey: "modern-professional",
      themeColor: "#4F46E5",
      fontFamily: "Inter",
      summary: basics.summary || "",
      personalInfo: {
        fullName: basics.name || "",
        jobTitle: basics.label || "",
        email: basics.email || "",
        phone: basics.phone || "",
        location: basics.location?.address || basics.location?.city || "",
        linkedinUrl: linkedin,
        githubUrl: github,
        portfolioUrl: basics.url || "",
      },
      experiences: (data.work || []).map((w, idx) => ({
        id: `imp-exp-${idx}`,
        company: w.name || "",
        position: w.position || "",
        location: w.location || "",
        startDate: w.startDate || "",
        endDate: w.endDate === "Present" ? "" : w.endDate || "",
        isCurrent: w.endDate === "Present",
        description: w.summary || "",
        bulletPoints: (w.highlights || []).join('\n• '),
      })),
      educations: (data.education || []).map((e, idx) => ({
        id: `imp-edu-${idx}`,
        institution: e.institution || "",
        degree: e.studyType || "",
        fieldOfStudy: e.area || "",
        startDate: e.startDate || "",
        endDate: e.endDate || "",
        gpa: e.score || "",
        achievements: (e.courses || []).join(', '),
      })),
      skills: (data.skills || []).map((s, idx) => ({
        id: `imp-sk-${idx}`,
        name: s.name || "",
        category: s.category || "Technical Skills",
        proficiency: s.level || "Advanced",
      })),
      projects: (data.projects || []).map((p, idx) => ({
        id: `imp-proj-${idx}`,
        name: p.name || "",
        description: p.description || "",
        technologies: (p.highlights || []).join(', '),
        link: p.url || "",
      })),
      certifications: (data.certificates || []).map((c, idx) => ({
        id: `imp-cert-${idx}`,
        name: c.name || "",
        issuer: c.issuer || "",
        issueDate: c.date || "",
        credentialUrl: c.url || "",
      })),
    };
  } catch (err) {
    throw new Error("Invalid JSON format. Please ensure valid JSON Resume syntax.");
  }
}

export function exportToPlainText(resume) {
  const p = resume.personalInfo || {};
  const lines = [];

  // Header
  lines.push((p.fullName || "CANDIDATE NAME").toUpperCase());
  if (p.jobTitle || resume.targetRole) {
    lines.push(p.jobTitle || resume.targetRole);
  }
  const contact = [p.email, p.phone, p.location].filter(Boolean).join(" | ");
  if (contact) lines.push(contact);

  const links = [p.linkedinUrl, p.githubUrl, p.portfolioUrl].filter(Boolean).join(" | ");
  if (links) lines.push(links);

  lines.push("\n" + "=".repeat(60));

  // Summary
  if (resume.summary) {
    lines.push("PROFESSIONAL SUMMARY");
    lines.push("-".repeat(60));
    lines.push(resume.summary.trim());
    lines.push("");
  }

  // Experience
  if (resume.experiences && resume.experiences.length > 0) {
    lines.push("PROFESSIONAL EXPERIENCE");
    lines.push("-".repeat(60));
    resume.experiences.forEach((exp) => {
      const dates = `${exp.startDate || ""} - ${exp.isCurrent ? "Present" : exp.endDate || ""}`;
      lines.push(`${exp.position || "Position"} | ${exp.company || "Company"}`);
      lines.push(`${dates} | ${exp.location || ""}`);
      if (exp.description) lines.push(exp.description);
      if (exp.bulletPoints) {
        exp.bulletPoints
          .split('\n')
          .map((b) => b.trim())
          .filter(Boolean)
          .forEach((b) => {
            const clean = b.replace(/^[•\s\-\*]+/, '').trim();
            lines.push(`  • ${clean}`);
          });
      }
      lines.push("");
    });
  }

  // Skills
  if (resume.skills && resume.skills.length > 0) {
    lines.push("CORE SKILLS");
    lines.push("-".repeat(60));
    const skillList = resume.skills.map((s) => s.name).filter(Boolean).join(", ");
    lines.push(skillList);
    lines.push("");
  }

  // Education
  if (resume.educations && resume.educations.length > 0) {
    lines.push("EDUCATION");
    lines.push("-".repeat(60));
    resume.educations.forEach((edu) => {
      const deg = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ");
      lines.push(`${deg || "Degree"} — ${edu.institution || "Institution"}`);
      const dates = `${edu.startDate || ""} - ${edu.endDate || ""}`;
      if (dates.trim() !== "-") lines.push(dates);
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
      if (edu.achievements) lines.push(edu.achievements);
      lines.push("");
    });
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    lines.push("KEY PROJECTS");
    lines.push("-".repeat(60));
    resume.projects.forEach((proj) => {
      lines.push(`${proj.name || "Project"} ${proj.technologies ? `(${proj.technologies})` : ""}`);
      if (proj.link) lines.push(`Link: ${proj.link}`);
      if (proj.description) lines.push(proj.description);
      lines.push("");
    });
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    lines.push("CERTIFICATIONS");
    lines.push("-".repeat(60));
    resume.certifications.forEach((c) => {
      lines.push(`${c.name || "Certification"} — ${c.issuer || "Issuer"} (${c.issueDate || ""})`);
    });
    lines.push("");
  }

  return lines.join("\n");
}

export function exportToMarkdown(resume) {
  const p = resume.personalInfo || {};
  let md = `# ${p.fullName || "Candidate Name"}\n`;
  if (p.jobTitle || resume.targetRole) md += `### ${p.jobTitle || resume.targetRole}\n\n`;

  const contact = [
    p.email ? `**Email:** ${p.email}` : '',
    p.phone ? `**Phone:** ${p.phone}` : '',
    p.location ? `**Location:** ${p.location}` : '',
  ].filter(Boolean).join(' | ');
  if (contact) md += `${contact}\n\n`;

  const links = [
    p.linkedinUrl ? `[LinkedIn](${p.linkedinUrl})` : '',
    p.githubUrl ? `[GitHub](${p.githubUrl})` : '',
    p.portfolioUrl ? `[Portfolio](${p.portfolioUrl})` : '',
  ].filter(Boolean).join(' | ');
  if (links) md += `${links}\n\n`;

  md += `---\n\n`;

  if (resume.summary) {
    md += `## Professional Summary\n\n${resume.summary.trim()}\n\n`;
  }

  if (resume.experiences && resume.experiences.length > 0) {
    md += `## Experience\n\n`;
    resume.experiences.forEach((exp) => {
      const dates = `${exp.startDate || ''} – ${exp.isCurrent ? 'Present' : exp.endDate || ''}`;
      md += `### ${exp.position || 'Position'} | **${exp.company || 'Company'}**\n`;
      md += `*${dates} | ${exp.location || ''}*\n\n`;
      if (exp.description) md += `${exp.description}\n\n`;
      if (exp.bulletPoints) {
        exp.bulletPoints.split('\n').filter(Boolean).forEach((b) => {
          md += `- ${b.replace(/^[•\s\-\*]+/, '').trim()}\n`;
        });
        md += `\n`;
      }
    });
  }

  if (resume.skills && resume.skills.length > 0) {
    md += `## Skills\n\n`;
    md += resume.skills.map((s) => `\`${s.name}\``).join('  ') + `\n\n`;
  }

  if (resume.educations && resume.educations.length > 0) {
    md += `## Education\n\n`;
    resume.educations.forEach((edu) => {
      md += `### ${edu.degree || 'Degree'} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}\n`;
      md += `**${edu.institution || ''}** (${edu.startDate || ''} – ${edu.endDate || ''})\n\n`;
    });
  }

  if (resume.projects && resume.projects.length > 0) {
    md += `## Projects\n\n`;
    resume.projects.forEach((proj) => {
      md += `### ${proj.name || 'Project'} ${proj.link ? `([Link](${proj.link}))` : ''}\n`;
      if (proj.technologies) md += `*Technologies: ${proj.technologies}*\n\n`;
      if (proj.description) md += `${proj.description}\n\n`;
    });
  }

  return md;
}

export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

