// Offline & GitHub Pages fallback handler
// Ensures the app works 100% seamlessly when deployed statically to GitHub Pages

const DEFAULT_TEMPLATES = [
  { id: 1, templateKey: 'modern-professional', name: 'Modern Professional', description: 'Clean, balanced layout with a subtle colored header band, optimal typography hierarchy, and high ATS readability.', category: 'Professional', atsFriendly: true, defaultColor: '#4F46E5', defaultFont: 'Inter', layoutType: 'single-column' },
  { id: 2, templateKey: 'classic-corporate', name: 'Classic Corporate', description: 'Time-tested traditional single-column format with elegant serif typography, clean section dividing rules, and corporate pedigree.', category: 'Corporate', atsFriendly: true, defaultColor: '#1E293B', defaultFont: 'Merriweather', layoutType: 'single-column' },
  { id: 3, templateKey: 'minimalist', name: 'Minimalist', description: 'Understated, modern Swiss-style grid with ample white space, razor-sharp focus on content, and zero distraction.', category: 'Modern', atsFriendly: true, defaultColor: '#334155', defaultFont: 'Inter', layoutType: 'single-column' },
  { id: 4, templateKey: 'software-developer', name: 'Software Developer', description: 'Engineered for tech professionals with prominent tech stack chips, GitHub and repository highlights, and system architecture bullet points.', category: 'Technical', atsFriendly: true, defaultColor: '#06B6D4', defaultFont: 'Fira Code', layoutType: 'two-column' },
  { id: 5, templateKey: 'fresher', name: 'Fresher Resume', description: 'Tailored for students and new graduates, emphasizing university education, academic projects, coursework, and campus leadership.', category: 'Entry-Level', atsFriendly: true, defaultColor: '#10B981', defaultFont: 'Poppins', layoutType: 'single-column' },
  { id: 6, templateKey: 'creative', name: 'Creative Resume', description: 'Eye-catching layout with modern indigo and purple gradients, dynamic project showcases, and stylized section indicators.', category: 'Creative', atsFriendly: false, defaultColor: '#7C3AED', defaultFont: 'Poppins', layoutType: 'two-column' },
  { id: 7, templateKey: 'executive', name: 'Executive Resume', description: 'Sophisticated executive layout highlighting leadership milestones, core competencies matrix, board memberships, and business impact metrics.', category: 'Executive', atsFriendly: true, defaultColor: '#0F172A', defaultFont: 'Roboto', layoutType: 'single-column' },
  { id: 8, templateKey: 'academic', name: 'Academic Resume', description: 'Comprehensive Curriculum Vitae (CV) style focusing on peer-reviewed publications, research grants, teaching appointments, and academic honors.', category: 'Academic', atsFriendly: true, defaultColor: '#475569', defaultFont: 'Merriweather', layoutType: 'single-column' }
];

export function handleOfflineFallback(endpoint, options = {}) {
  const method = options.method || 'GET';
  let body = null;
  if (options.body && typeof options.body === 'string') {
    try { body = JSON.parse(options.body); } catch (e) {}
  }

  // 1. Templates
  if (endpoint.startsWith('/templates')) {
    return DEFAULT_TEMPLATES;
  }

  // 2. Auth Endpoints
  if (endpoint === '/auth/login' || endpoint === '/auth/register') {
    const user = {
      id: 1,
      email: body?.email || 'demo@resumeai.com',
      firstName: body?.firstName || 'Alok',
      lastName: body?.lastName || 'Pandey',
      role: 'USER',
      targetRole: 'Senior Software Engineer'
    };
    return { token: 'demo-gh-pages-jwt-token-xyz', user };
  }

  if (endpoint === '/auth/me') {
    const saved = localStorage.getItem('resumeai_user');
    return saved ? JSON.parse(saved) : {
      id: 1,
      email: 'demo@resumeai.com',
      firstName: 'Alok',
      lastName: 'Pandey',
      role: 'USER',
      targetRole: 'Senior Software Engineer'
    };
  }

  // 3. User Stats & Profile
  if (endpoint === '/user/stats') {
    return { totalResumes: 2, averageAtsScore: 88, readyResumes: 2 };
  }
  if (endpoint === '/user/profile') {
    return { id: 1, email: 'demo@resumeai.com', firstName: 'Alok', lastName: 'Pandey' };
  }

  // 4. Resumes CRUD in LocalStorage
  if (endpoint === '/resumes' && method === 'GET') {
    const list = getLocalResumes();
    return list;
  }

  if (endpoint === '/resumes' && method === 'POST') {
    const list = getLocalResumes();
    const newResume = createInitialResume(body);
    list.unshift(newResume);
    saveLocalResumes(list);
    return newResume;
  }

  if (endpoint.match(/^\/resumes\/\d+$/) && method === 'GET') {
    const id = parseInt(endpoint.split('/')[2]);
    const list = getLocalResumes();
    const found = list.find(r => r.id === id);
    return found || list[0] || createInitialResume({ title: 'My Resume' });
  }

  if (endpoint.match(/^\/resumes\/\d+$/) && method === 'PUT') {
    const id = parseInt(endpoint.split('/')[2]);
    const list = getLocalResumes();
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...body, updatedAt: new Date().toISOString() };
      saveLocalResumes(list);
      return list[idx];
    }
    return body;
  }

  if (endpoint.match(/^\/resumes\/\d+$/) && method === 'DELETE') {
    const id = parseInt(endpoint.split('/')[2]);
    const list = getLocalResumes().filter(r => r.id !== id);
    saveLocalResumes(list);
    return { message: 'Deleted' };
  }

  if (endpoint.match(/^\/resumes\/\d+\/duplicate$/)) {
    const id = parseInt(endpoint.split('/')[2]);
    const list = getLocalResumes();
    const orig = list.find(r => r.id === id);
    if (orig) {
      const copy = { ...JSON.parse(JSON.stringify(orig)), id: Date.now(), title: `${orig.title} (Copy)`, updatedAt: new Date().toISOString() };
      list.unshift(copy);
      saveLocalResumes(list);
      return copy;
    }
  }

  if (endpoint === '/resumes/import-parsed') {
    const list = getLocalResumes();
    const newResume = {
      id: Date.now(),
      title: body?.title || 'Imported Resume',
      targetRole: body?.targetRole || 'Professional',
      templateKey: body?.templateKey || 'modern-professional',
      themeColor: '#4F46E5',
      fontFamily: 'Inter',
      fontSize: 'medium',
      lineSpacing: 'normal',
      summary: body?.summary || '',
      personalInfo: body?.personalInfo || {},
      experiences: body?.experiences || [],
      educations: body?.educations || [],
      skills: body?.skills || [],
      projects: body?.projects || [],
      certifications: body?.certifications || [],
      additionalSections: [],
      completionPercentage: 85,
      atsScore: 82,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.unshift(newResume);
    saveLocalResumes(list);
    return newResume;
  }

  // 5. AI Endpoints Offline Simulation
  if (endpoint === '/ai/generate-summary') {
    const role = body?.targetRole || 'Professional';
    return {
      summary: `Accomplished ${role} with extensive experience architecting high-scale systems, driving cross-functional initiatives, and delivering production-grade digital solutions. Demonstrated track record of optimizing application latency by 35% and leading distributed development teams.`,
      source: 'offline-ai-engine'
    };
  }

  if (endpoint === '/ai/generate-bullets') {
    return {
      bulletPoints: [
        `Spearheaded development of core microservices, resulting in a 40% reduction in API response times.`,
        `Architected resilient automated test suites, elevating code coverage to 92% across critical modules.`,
        `Collaborated with cross-functional product and engineering teams to deliver high-priority roadmaps 3 weeks ahead of schedule.`
      ],
      source: 'offline-ai-engine'
    };
  }

  if (endpoint === '/ai/improve-content') {
    return {
      improvedContent: `Orchestrated deployment workflows and modernized legacy infrastructure, slashing operational downtime by 30% while accelerating feature delivery velocity.`,
      feedback: 'Replaced passive descriptions with leadership-oriented action verbs and quantified impact metrics.'
    };
  }

  if (endpoint === '/ai/ats-analysis') {
    return {
      overallScore: 86,
      atsGrade: 'Outstanding / ATS-Ready',
      summaryAssessment: 'Strong document structure with excellent keyword distribution and quantified metrics.',
      detectedIssues: [],
      keywordMatches: ['Java', 'React', 'APIs', 'Docker', 'System Architecture'],
      missingKeywords: ['CI/CD', 'Microservices', 'Kubernetes'],
      formattingIssues: []
    };
  }

  if (endpoint === '/ai/job-match') {
    return {
      matchPercentage: 84,
      matchScore: 84,
      analysis: 'Strong alignment with core competencies. Adding domain-specific cloud keywords will increase matching accuracy.',
      matchedSkills: ['JavaScript', 'React', 'REST APIs', 'SQL'],
      missingSkills: ['Kubernetes', 'GraphQL', 'AWS Lambda'],
      recommendedSummary: 'Engineered for high-throughput cloud applications with deep frontend and backend expertise.'
    };
  }

  if (endpoint === '/ai/cover-letter') {
    return {
      coverLetter: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${body?.targetRole || 'Software'} position. With a solid foundation in modern system development, end-to-end execution, and continuous optimization, I have consistently driven measurable improvements across engineering roadmaps.\n\nThank you for your consideration.\n\nSincerely,\nAlok Kumar Pandey`
    };
  }

  if (endpoint === '/ai/linkedin-summary') {
    return {
      headline: `Senior Software Engineer | Scalable Systems | React & Spring Boot`,
      summary: `Passionate engineer building high-impact digital experiences. Dedicated to writing clean, maintainable software and driving performance improvements across enterprise cloud architectures.`
    };
  }

  return { status: 'ok', fallback: true };
}

function getLocalResumes() {
  const saved = localStorage.getItem('resumeai_local_resumes');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  const defaultList = [
    createInitialResume({
      id: 1,
      title: 'Senior Software Engineer',
      targetRole: 'Full Stack Engineer',
      templateKey: 'modern-professional',
      personalInfo: {
        fullName: 'Alok Kumar Pandey',
        jobTitle: 'Senior Full Stack Engineer',
        email: 'pandeyalok81249@gmail.com',
        phone: '+91 98765 43210',
        location: 'Bengaluru, India',
        linkedinUrl: 'linkedin.com/in/alok-kumar-pandey',
        githubUrl: 'github.com/pandeyalok81249-dotcom'
      },
      summary: 'Results-driven Full Stack Engineer with 4+ years of expertise designing and scaling distributed web applications. Proven track record of improving system throughput by 35% and mentoring engineering teams.',
      experiences: [
        {
          id: 1,
          company: 'Tech Solutions Inc',
          position: 'Senior Software Engineer',
          startDate: '2022',
          endDate: 'Present',
          current: true,
          bulletPoints: '• Spearheaded microservices architecture migration, reducing server latency by 32%.\n• Built real-time analytics dashboard with React and WebSockets handling 50k+ daily events.\n• Mentored 6 junior engineers and standardized CI/CD pipelines.'
        }
      ],
      educations: [
        {
          id: 1,
          institution: 'National Institute of Technology',
          degree: 'Bachelor of Technology in Computer Science',
          endDate: '2021',
          gradeOrGpa: '8.8 CGPA'
        }
      ],
      skills: [
        { id: 1, name: 'Java', category: 'Backend', proficiency: 'Expert' },
        { id: 2, name: 'Spring Boot', category: 'Backend', proficiency: 'Expert' },
        { id: 3, name: 'React', category: 'Frontend', proficiency: 'Expert' },
        { id: 4, name: 'TypeScript', category: 'Frontend', proficiency: 'Advanced' },
        { id: 5, name: 'Docker', category: 'DevOps', proficiency: 'Intermediate' },
        { id: 6, name: 'PostgreSQL', category: 'Database', proficiency: 'Advanced' }
      ]
    })
  ];
  localStorage.setItem('resumeai_local_resumes', JSON.stringify(defaultList));
  return defaultList;
}

function saveLocalResumes(list) {
  localStorage.setItem('resumeai_local_resumes', JSON.stringify(list));
}

function createInitialResume(data = {}) {
  return {
    id: data.id || Date.now(),
    title: data.title || 'My Professional Resume',
    targetRole: data.targetRole || 'Software Professional',
    templateKey: data.templateKey || 'modern-professional',
    themeColor: data.themeColor || '#4F46E5',
    fontFamily: data.fontFamily || 'Inter',
    fontSize: data.fontSize || 'medium',
    lineSpacing: data.lineSpacing || 'normal',
    summary: data.summary || 'Energetic and outcome-focused engineer dedicated to delivering high-quality, scalable solutions.',
    sectionOrder: 'summary,experience,education,skills,projects,certifications,additional',
    isPublic: true,
    personalInfo: data.personalInfo || {
      fullName: 'Candidate Name',
      jobTitle: data.targetRole || 'Software Engineer',
      email: 'candidate@example.com',
      phone: '+1 (555) 000-0000',
      location: 'San Francisco, CA'
    },
    experiences: data.experiences || [],
    educations: data.educations || [],
    skills: data.skills || [],
    projects: data.projects || [],
    certifications: data.certifications || [],
    additionalSections: [],
    completionPercentage: 85,
    atsScore: 82,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
