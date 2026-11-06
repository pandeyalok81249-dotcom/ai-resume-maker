import React from 'react';
import ModernProfessional from './ModernProfessional';
import ClassicCorporate from './ClassicCorporate';
import Minimalist from './Minimalist';
import SoftwareDeveloper from './SoftwareDeveloper';
import FresherResume from './FresherResume';
import CreativeResume from './CreativeResume';
import ExecutiveResume from './ExecutiveResume';
import AcademicResume from './AcademicResume';

export default function TemplateRenderer({
  resume,
  templateKey,
  themeColor,
  fontFamily,
  fontSize,
  lineSpacing,
  sectionVisibility,
}) {
  if (!resume) return null;

  const key = templateKey || resume.templateKey || 'modern-professional';
  const color = themeColor || resume.themeColor || '#4F46E5';
  const font = fontFamily || resume.fontFamily || 'Inter';
  const size = fontSize || resume.fontSize || 'medium';
  const spacing = lineSpacing || resume.lineSpacing || 'normal';

  const props = {
    resume,
    themeColor: color,
    fontFamily: font,
    fontSize: size,
    lineSpacing: spacing,
    sectionVisibility,
  };

  switch (key) {
    case 'classic-corporate':
      return <ClassicCorporate {...props} />;
    case 'minimalist':
      return <Minimalist {...props} />;
    case 'software-developer':
      return <SoftwareDeveloper {...props} />;
    case 'fresher':
      return <FresherResume {...props} />;
    case 'creative':
      return <CreativeResume {...props} />;
    case 'executive':
      return <ExecutiveResume {...props} />;
    case 'academic':
      return <AcademicResume {...props} />;
    case 'modern-professional':
    default:
      return <ModernProfessional {...props} />;
  }
}

