import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Check,
  Loader2,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Tag,
  FolderGit2,
  Award,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldCheck,
  Share2,
  Upload
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { resumeApi } from '../../api/resumeApi';
import html2pdf from 'html2pdf.js';

// Step forms
import StepPersonal from '../builder/StepPersonal';
import StepSummary from '../builder/StepSummary';
import StepExperience from '../builder/StepExperience';
import StepEducation from '../builder/StepEducation';
import StepSkills from '../builder/StepSkills';
import StepProjects from '../builder/StepProjects';
import StepCertifications from '../builder/StepCertifications';
import StepAdditional from '../builder/StepAdditional';
import SectionVisibilityModal from '../builder/SectionVisibilityModal';

// Preview & Modals
import CustomizerToolbar from '../preview/CustomizerToolbar';
import ResumePreview from '../preview/ResumePreview';
import TemplateGalleryModal from '../preview/TemplateGalleryModal';
import AtsCheckerDrawer from '../ai/AtsCheckerDrawer';
import JobMatchModal from '../ai/JobMatchModal';
import CoverLetterModal from '../ai/CoverLetterModal';
import LinkedInModal from '../ai/LinkedInModal';
import ResumeUploadAuditModal from '../ai/ResumeUploadAuditModal';
import InterviewPrepModal from '../ai/InterviewPrepModal';
import ResumeTailorModal from '../ai/ResumeTailorModal';
import SalaryInsightsModal from '../ai/SalaryInsightsModal';
import ExportImportModal from '../common/ExportImportModal';
import ShareModal from '../common/ShareModal';
import { Zap, HelpCircle, DollarSign, FileCode } from 'lucide-react';

export default function BuilderPage({ initialResume, onBackToDashboard }) {
  const {
    resume,
    setResume,
    updateResumeData,
    saveResume,
    saving,
    lastSaved,
    triggerAutoSave,
    sectionVisibility,
    toggleSection,
  } = useResume();

  const [activeStep, setActiveStep] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [titleEditing, setTitleEditing] = useState(false);

  // Modals
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [showAtsDrawer, setShowAtsDrawer] = useState(false);
  const [showJobMatch, setShowJobMatch] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [showLinkedIn, setShowLinkedIn] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showInterviewPrep, setShowInterviewPrep] = useState(false);
  const [showTailor, setShowTailor] = useState(false);
  const [showSalaryInsights, setShowSalaryInsights] = useState(false);
  const [showExportImport, setShowExportImport] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleApplyTailoring = (updated) => {
    if (!updated) return;
    setResume(updated);
    triggerAutoSave(updated);
  };

  const handleImportResume = (imported) => {
    if (!imported) return;
    setResume((prev) => ({
      ...prev,
      ...imported,
    }));
    triggerAutoSave({
      ...resume,
      ...imported,
    });
  };

  const handleTogglePublic = (updated) => {
    if (!updated) return;
    setResume((prev) => ({
      ...prev,
      isPublic: updated.isPublic,
    }));
  };

  const previewRef = useRef(null);

  const handleApplyParsedResume = (parsed) => {
    if (!parsed) return;
    setResume((prev) => ({
      ...prev,
      title: parsed.title || prev.title,
      summary: parsed.summary || prev.summary,
      personalInfo: {
        ...prev.personalInfo,
        ...(parsed.personalInfo || {}),
      },
      experiences: parsed.experiences?.length ? parsed.experiences : prev.experiences,
      educations: parsed.educations?.length ? parsed.educations : prev.educations,
      skills: parsed.skills?.length ? parsed.skills : prev.skills,
      projects: parsed.projects?.length ? parsed.projects : prev.projects,
      certifications: parsed.certifications?.length ? parsed.certifications : prev.certifications,
    }));
    triggerAutoSave();
  };

  useEffect(() => {
    if (initialResume) {
      setResume(initialResume);
    }
  }, [initialResume, setResume]);

  if (!resume) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-2" />
        Loading resume editor...
      </div>
    );
  }

  const steps = [
    { id: 0, key: 'personal', title: 'Personal Info', icon: User },
    { id: 1, key: 'summary', title: 'Summary', icon: FileText },
    { id: 2, key: 'experience', title: 'Experience', icon: Briefcase },
    { id: 3, key: 'education', title: 'Education', icon: GraduationCap },
    { id: 4, key: 'skills', title: 'Skills', icon: Tag },
    { id: 5, key: 'projects', title: 'Projects', icon: FolderGit2 },
    { id: 6, key: 'certifications', title: 'Certificates', icon: Award },
    { id: 7, key: 'additional', title: 'Additional', icon: Layers },
  ];

  const handleFieldChange = (field, value) => {
    updateResumeData(prev => {
      const next = { ...prev, [field]: value };
      triggerAutoSave(next);
      return next;
    });
  };

  const handleManualSave = async () => {
    await saveResume();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);

      // First attempt: Backend PDF service for vector precision
      try {
        const blob = await resumeApi.downloadPdf(resume.id);
        const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${resume.title.replace(/\s+/g, '_')}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        setIsDownloading(false);
        return;
      } catch (backendErr) {
        console.warn("Backend PDF export failed, using client-side renderer:", backendErr);
      }

      // Fallback: Client-side html2pdf
      const element = document.getElementById('resume-pdf-container');
      if (!element) {
        throw new Error('Resume element not found');
      }

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${resume.title.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      alert('Error generating PDF: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Top Builder Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Editable Title */}
          {titleEditing ? (
            <input
              type="text"
              autoFocus
              value={resume.title || ''}
              onBlur={() => setTitleEditing(false)}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="text-sm font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-indigo-500 focus:outline-none"
            />
          ) : (
            <div
              onClick={() => setTitleEditing(true)}
              className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 cursor-pointer transition flex items-center gap-1.5"
              title="Click to rename"
            >
              <span>{resume.title}</span>
              <span className="text-[10px] text-slate-400 font-normal">✎</span>
            </div>
          )}
        </div>

        {/* Save Status & Button */}
        <div className="flex items-center gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            {saving ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
                <span>Saving changes...</span>
              </>
            ) : lastSaved ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span>Saved</span>
              </>
            ) : (
              <span>All changes saved</span>
            )}
          </div>

          <button
            onClick={() => setShowTailor(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-200 dark:border-emerald-800 transition cursor-pointer"
            title="1-Click AI Resume Tailorer for target job description"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span className="hidden md:inline">Tailor Resume</span>
          </button>

          <button
            onClick={() => setShowInterviewPrep(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-xl border border-purple-200 dark:border-purple-800 transition cursor-pointer"
            title="AI Interview Prep & Mock Questions Coach"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden md:inline">Interview Prep</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-xl border border-indigo-200 dark:border-indigo-800 transition"
            title="Upload an existing resume to audit issues and auto-populate fields"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-500" />
            <span className="hidden sm:inline">Import & Audit</span>
          </button>

          <button
            onClick={handleManualSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Side: Step Navigation & Form (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Step Navigation Tabs */}
          <div className="flex items-center overflow-x-auto p-2 bg-slate-50/70 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 no-scrollbar gap-1">
            {steps.map((st) => {
              const Icon = st.icon;
              const isActive = activeStep === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setActiveStep(st.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex-shrink-0 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{st.title}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content Area with Smooth Step Transition */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                {activeStep === 0 && (
                  <StepPersonal
                    personalInfo={resume.personalInfo}
                    onChange={(val) => handleFieldChange('personalInfo', val)}
                  />
                )}
                {activeStep === 1 && (
                  <StepSummary
                    summary={resume.summary}
                    onChange={(val) => handleFieldChange('summary', val)}
                    currentRole={resume.targetRole || resume.personalInfo?.jobTitle}
                    skills={resume.skills}
                  />
                )}
                {activeStep === 2 && (
                  <StepExperience
                    experiences={resume.experiences}
                    onChange={(val) => handleFieldChange('experiences', val)}
                  />
                )}
                {activeStep === 3 && (
                  <StepEducation
                    educations={resume.educations}
                    onChange={(val) => handleFieldChange('educations', val)}
                  />
                )}
                {activeStep === 4 && (
                  <StepSkills
                    skills={resume.skills}
                    onChange={(val) => handleFieldChange('skills', val)}
                    targetRole={resume.targetRole || resume.personalInfo?.jobTitle}
                  />
                )}
                {activeStep === 5 && (
                  <StepProjects
                    projects={resume.projects}
                    onChange={(val) => handleFieldChange('projects', val)}
                  />
                )}
                {activeStep === 6 && (
                  <StepCertifications
                    certifications={resume.certifications}
                    onChange={(val) => handleFieldChange('certifications', val)}
                  />
                )}
                {activeStep === 7 && (
                  <StepAdditional
                    additionalSections={resume.additionalSections}
                    onChange={(val) => handleFieldChange('additionalSections', val)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step Prev/Next Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
            <button
              onClick={() => setActiveStep(prev => Math.max(prev - 1, 0))}
              disabled={activeStep === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <span className="text-[11px] text-slate-400 font-medium">
              Step {activeStep + 1} of {steps.length}
            </span>

            <button
              onClick={() => setActiveStep(prev => Math.min(prev + 1, steps.length - 1))}
              disabled={activeStep === steps.length - 1}
              className="flex items-center gap-1 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-40"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Live Resume Preview & Toolbar (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col h-full overflow-hidden">
          {/* Customizer Toolbar */}
          <CustomizerToolbar
            templateKey={resume.templateKey}
            onTemplateChange={(val) => handleFieldChange('templateKey', val)}
            themeColor={resume.themeColor}
            onColorChange={(val) => handleFieldChange('themeColor', val)}
            fontFamily={resume.fontFamily}
            onFontChange={(val) => handleFieldChange('fontFamily', val)}
            fontSize={resume.fontSize}
            onFontSizeChange={(val) => handleFieldChange('fontSize', val)}
            lineSpacing={resume.lineSpacing}
            onLineSpacingChange={(val) => handleFieldChange('lineSpacing', val)}
            onOpenTemplateGallery={() => setShowTemplateGallery(true)}
            onOpenSectionVisibility={() => setShowVisibilityModal(true)}
            onOpenAtsDrawer={() => setShowAtsDrawer(true)}
            onOpenJobMatch={() => setShowJobMatch(true)}
            onOpenCoverLetter={() => setShowCoverLetter(true)}
            onOpenLinkedIn={() => setShowLinkedIn(true)}
            onOpenInterviewPrep={() => setShowInterviewPrep(true)}
            onOpenTailor={() => setShowTailor(true)}
            onOpenSalaryInsights={() => setShowSalaryInsights(true)}
            onOpenExportImport={() => setShowExportImport(true)}
            onOpenShare={() => setShowShare(true)}
            onDownloadPdf={handleDownloadPdf}
            onPrint={handlePrint}
            isDownloading={isDownloading}
            atsScore={resume.atsScore || 75}
          />

          {/* Live Preview Canvas */}
          <div className="flex-1 overflow-hidden relative">
            <ResumePreview
              resume={resume}
              templateKey={resume.templateKey}
              themeColor={resume.themeColor}
              fontFamily={resume.fontFamily}
              fontSize={resume.fontSize}
              lineSpacing={resume.lineSpacing}
              sectionVisibility={sectionVisibility}
              previewRef={previewRef}
            />
          </div>
        </div>
      </div>

      {/* Modals & Drawers */}
      <SectionVisibilityModal
        isOpen={showVisibilityModal}
        onClose={() => setShowVisibilityModal(false)}
        visibility={sectionVisibility}
        onToggle={toggleSection}
      />

      <AtsCheckerDrawer
        isOpen={showAtsDrawer}
        onClose={() => setShowAtsDrawer(false)}
        resume={resume}
      />

      <ResumeTailorModal
        isOpen={showTailor}
        onClose={() => setShowTailor(false)}
        resume={resume}
        onApplyTailoring={handleApplyTailoring}
      />

      <InterviewPrepModal
        isOpen={showInterviewPrep}
        onClose={() => setShowInterviewPrep(false)}
        resume={resume}
      />

      <SalaryInsightsModal
        isOpen={showSalaryInsights}
        onClose={() => setShowSalaryInsights(false)}
        resume={resume}
      />

      <ExportImportModal
        isOpen={showExportImport}
        onClose={() => setShowExportImport(false)}
        resume={resume}
        onImportResume={handleImportResume}
      />

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        resume={resume}
        onTogglePublic={handleTogglePublic}
      />

      <JobMatchModal
        isOpen={showJobMatch}
        onClose={() => setShowJobMatch(false)}
        resume={resume}
      />

      <CoverLetterModal
        isOpen={showCoverLetter}
        onClose={() => setShowCoverLetter(false)}
        resume={resume}
      />

      <LinkedInModal
        isOpen={showLinkedIn}
        onClose={() => setShowLinkedIn(false)}
        resume={resume}
      />

      <ResumeUploadAuditModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onApplyToCurrentResume={handleApplyParsedResume}
      />

      <TemplateGalleryModal
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
        currentTemplate={resume.templateKey}
        onSelectTemplate={(key) => handleFieldChange('templateKey', key)}
        themeColor={resume.themeColor}
      />
    </div>
  );
}

