import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  ShieldAlert,
  Zap,
  BarChart3,
  FileCheck2,
  X,
  FileUp,
  Flame,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { resumeAuditApi } from '../../api/resumeAuditApi';
import { useAuth } from '../../context/AuthContext';

export default function ResumeUploadAuditModal({ isOpen, onClose, onApplyToCurrentResume, onImportResume, onNavigate }) {
  const { user } = useAuth();

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('issues'); // 'issues', 'improvements', 'buzzwords', 'breakdown', 'extracted'
  const [severityFilter, setSeverityFilter] = useState('ALL'); // 'ALL', 'CRITICAL', 'WARNING'
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [importing, setImporting] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    const validTypes = ['.pdf', '.txt', '.docx', '.rtf', '.md'];
    const name = selectedFile.name.toLowerCase();
    const isValid = validTypes.some((ext) => name.endsWith(ext));

    if (!isValid) {
      setError('Please upload a PDF (.pdf) or text document (.txt, .md, .rtf).');
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      setError('File size must be under 15 MB.');
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  const handleUploadAndAnalyze = async (fileToAnalyze = file) => {
    if (!fileToAnalyze) {
      setError('Please select a resume file first.');
      return;
    }

    setAnalyzing(true);
    setError('');
    setAnalysis(null);

    const steps = [
      'Extracting document text and layout hierarchy...',
      'Segmenting contact details, experience, education, and skills...',
      'Evaluating ATS parseability and format vulnerability...',
      'Scanning for weak verbs, passive phrasing, and clichés...',
      'Auditing quantifiable metrics and impact density...',
      'Formulating tailored before-and-after improvements...'
    ];

    let currentStep = 0;
    setAnalysisStep(steps[0]);
    const stepInterval = setInterval(() => {
      currentStep = (currentStep + 1) % steps.length;
      setAnalysisStep(steps[currentStep]);
    }, 700);

    try {
      const data = await resumeAuditApi.uploadAndAnalyze(fileToAnalyze);
      clearInterval(stepInterval);
      setAnalysis(data);
    } catch (err) {
      clearInterval(stepInterval);
      console.error('Audit failed:', err);
      setError(err.message || 'Failed to analyze resume. Please ensure the file contains readable text.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUseSampleResume = async () => {
    const sampleText = `Alex Turner
Senior Full Stack Engineer
alex.turner@example.com | (415) 890-1234 | San Francisco, CA | linkedin.com/in/alexturner | github.com/alexturner

PROFESSIONAL SUMMARY
Highly motivated team player and hard worker with experience in web applications. Seeking to utilize synergy and passion to build dynamic software solutions. Fast learner who thinks outside the box.

WORK EXPERIENCE
Full Stack Engineer | CloudScale Systems
2022 - Present
- Responsible for managing API development and frontend modules
- Worked on improving database performance and fixing bugs
- Helped with testing features and attended daily scrum standups

Junior Software Developer | NextGen Software
2020 - 2022
- Duties included writing JavaScript and HTML code
- Responsible for handling customer support tickets and bug fixes

EDUCATION
University of Washington
Bachelor of Science in Computer Science
2016 - 2020 | GPA: 3.75

SKILLS
JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, Docker, Git, REST APIs, Tailwind CSS`;

    const blob = new Blob([sampleText], { type: 'text/plain' });
    const sampleFile = new File([blob], 'Alex_Turner_Resume_Sample.txt', { type: 'text/plain' });
    setFile(sampleFile);
    await handleUploadAndAnalyze(sampleFile);
  };

  const handleImportToBuilder = async () => {
    if (!analysis?.parsedResume) return;

    // If caller provided onApplyToCurrentResume, use it directly (e.g. from BuilderPage)
    if (onApplyToCurrentResume) {
      onApplyToCurrentResume(analysis.parsedResume);
      onClose();
      return;
    }

    if (!user) {
      sessionStorage.setItem('pending_imported_resume', JSON.stringify(analysis.parsedResume));
      if (onNavigate) {
        onNavigate('register');
      }
      onClose();
      return;
    }

    setImporting(true);
    try {
      const created = await resumeAuditApi.importParsedResume(analysis.parsedResume);
      onClose();
      if (onImportResume) {
        onImportResume(created);
      } else if (onNavigate) {
        onNavigate('dashboard');
      }
    } catch (err) {
      console.error('Failed to import resume:', err);
      setError('Could not import into builder: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-primary-600 bg-indigo-50 border-indigo-200';
    if (score >= 55) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 85) return 'bg-emerald-500 text-white';
    if (score >= 70) return 'bg-primary-600 text-white';
    if (score >= 55) return 'bg-amber-500 text-white';
    return 'bg-rose-500 text-white';
  };

  const filteredIssues = (analysis?.detectedIssues || []).filter((issue) => {
    if (severityFilter === 'ALL') return true;
    return issue.severity === severityFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-indigo-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                AI Resume Auditor & Problem Diagnostic
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                  New Feature
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Upload your existing resume to detect ATS risks, weak phrasing, clichés, and import it into our editor.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!analysis && !analyzing && (
            <div className="space-y-6">
              {/* Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-primary-500 bg-primary-50/50 scale-[0.99]'
                    : file
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50/60'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.docx,.rtf,.md"
                  className="hidden"
                />

                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shadow-inner">
                  {file ? (
                    <FileCheck2 className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <FileUp className="w-8 h-8" />
                  )}
                </div>

                {file ? (
                  <div>
                    <p className="text-base font-semibold text-slate-800">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {(file.size / 1024).toFixed(1)} KB • Click to choose a different file
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-base font-semibold text-slate-800">
                      Drag & Drop your resume here, or <span className="text-primary-600 underline">browse</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports PDF (.pdf), Plain Text (.txt), Word (.docx), or Markdown (.md) up to 15 MB
                    </p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
                <button
                  type="button"
                  onClick={handleUseSampleResume}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  Try With a Preloaded Sample Resume
                </button>

                <button
                  type="button"
                  disabled={!file}
                  onClick={() => handleUploadAndAnalyze(file)}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition ${
                    file
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-primary-500/25 hover:from-primary-700 hover:to-accent-700 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Audit & Diagnose Resume
                </button>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">ATS Red Flag Detection</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Checks contact info, header hierarchy, and format readability.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Weak Verb & Cliché Reducer</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Flags passive phrases and overused clichés with action verb replacements.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">1-Click Builder Import</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Instantly turn your scanned document into an editable, modern resume.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analyzing Progress State */}
          {analyzing && (
            <div className="py-16 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-primary-100 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-primary-600">
                  <Cpu className="w-8 h-8" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800">Analyzing Your Resume</h3>
                <p className="text-xs text-primary-600 font-medium mt-1 animate-pulse">
                  {analysisStep}
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  Our AI is auditing 25+ ATS rules, language strength, and quantified impact metrics.
                </p>
              </div>
            </div>
          )}

          {/* Analysis Results View */}
          {analysis && !analyzing && (
            <div className="space-y-6">
              {/* Scorecard Hero */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                    {/* Score Meter */}
                    <div className="relative w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center flex-shrink-0 shadow-inner">
                      <span className="text-3xl font-extrabold tracking-tight">
                        {analysis.auditScore}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-300">/ 100</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getScoreBadgeColor(analysis.auditScore)}`}>
                          {analysis.auditGrade}
                        </span>
                        <span className="text-xs text-slate-300">
                          {analysis.fileName} ({analysis.fileType})
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 mt-2 max-w-xl leading-relaxed">
                        {analysis.summaryAssessment}
                      </p>
                    </div>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <button
                      type="button"
                      disabled={importing}
                      onClick={handleImportToBuilder}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition"
                    >
                      {importing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4 fill-white" />
                      )}
                      {onApplyToCurrentResume ? 'Apply to Current Resume' : 'Import into AI Builder & Fix'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAnalysis(null);
                        setFile(null);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Scan Another
                    </button>
                  </div>
                </div>

                {/* Quick stats ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-4 border-t border-white/10 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Estimated Length</span>
                    <span className="font-semibold text-white">
                      {analysis.estimatedPageCount} Page{analysis.estimatedPageCount > 1 ? 's' : ''} ({analysis.wordCount} words)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Issues Detected</span>
                    <span className="font-semibold text-rose-300">
                      {analysis.detectedIssues?.length || 0} items to resolve
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Clichés / Buzzwords</span>
                    <span className="font-semibold text-amber-300">
                      {analysis.buzzwordsFound?.length || 0} flagged
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Action Verbs</span>
                    <span className="font-semibold text-emerald-300">
                      {analysis.actionVerbsFound?.length || 0} power verbs
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-xs font-semibold text-slate-600">
                <button
                  type="button"
                  onClick={() => setActiveTab('issues')}
                  className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'issues'
                      ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Problems & Risks ({analysis.detectedIssues?.length || 0})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('improvements')}
                  className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'improvements'
                      ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                  Before vs. After Suggestions ({analysis.suggestedImprovements?.length || 0})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('buzzwords')}
                  className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'buzzwords'
                      ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Clichés & Action Verbs
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('breakdown')}
                  className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'breakdown'
                      ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Section Scores
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('extracted')}
                  className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'extracted'
                      ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Parsed Resume Data
                </button>
              </div>

              {/* Tab 1: Problems & Risks */}
              {activeTab === 'issues' && (
                <div className="space-y-4">
                  {/* Filter Pills */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-500">Filter:</span>
                    {['ALL', 'CRITICAL', 'WARNING'].map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverityFilter(sev)}
                        className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition ${
                          severityFilter === sev
                            ? 'bg-slate-800 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>

                  {filteredIssues.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 text-slate-500 text-xs">
                      No issues found in this category!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredIssues.map((issue, idx) => (
                        <div
                          key={issue.id || idx}
                          className={`p-4 rounded-xl border transition-all ${
                            issue.severity === 'CRITICAL'
                              ? 'bg-rose-50/40 border-rose-200'
                              : issue.severity === 'WARNING'
                              ? 'bg-amber-50/40 border-amber-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              {issue.severity === 'CRITICAL' ? (
                                <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                              ) : issue.severity === 'WARNING' ? (
                                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              )}
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-xs font-bold text-slate-900">{issue.title}</h4>
                                  <span
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                      issue.severity === 'CRITICAL'
                                        ? 'bg-rose-100 text-rose-700'
                                        : issue.severity === 'WARNING'
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-blue-100 text-blue-700'
                                    }`}
                                  >
                                    {issue.severity}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {issue.category}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                  {issue.description}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Quote Snippet if present */}
                          {issue.quoteSnippet && (
                            <div className="mt-2.5 p-2 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-700">
                              <span className="text-[10px] font-sans font-semibold text-slate-400 block mb-0.5">
                                Found in your resume:
                              </span>
                              "{issue.quoteSnippet}"
                            </div>
                          )}

                          {/* Recommended Fix */}
                          {issue.recommendedFix && (
                            <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-start justify-between gap-2 text-xs">
                              <div className="flex items-start gap-1.5 text-slate-700">
                                <Sparkles className="w-3.5 h-3.5 text-primary-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-semibold text-primary-700">Recommended Fix: </span>
                                  <span>{issue.recommendedFix}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(issue.recommendedFix, `fix-${idx}`)}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded"
                                title="Copy recommendation"
                              >
                                {copiedIndex === `fix-${idx}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Before vs After Improvements */}
              {activeTab === 'improvements' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">
                    Our AI has rewritten weak or passive sections into high-impact, ATS-optimized accomplishment statements:
                  </p>

                  <div className="space-y-4">
                    {analysis.suggestedImprovements?.map((imp, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm"
                      >
                        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">{imp.section}</span>
                          <span className="text-[11px] text-slate-500">{imp.reason}</span>
                        </div>

                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Original */}
                          <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100">
                            <div className="flex items-center gap-1.5 text-rose-700 text-[11px] font-bold mb-1.5">
                              <XCircle className="w-3.5 h-3.5" />
                              Original Text (Weak / Passive)
                            </div>
                            <p className="text-xs text-slate-700 italic leading-relaxed">
                              "{imp.originalText}"
                            </p>
                          </div>

                          {/* Improved */}
                          <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 relative group">
                            <div className="flex items-center justify-between gap-1.5 text-emerald-700 text-[11px] font-bold mb-1.5">
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                AI Optimized (Action-Driven & Quantified)
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(imp.improvedText, `imp-${idx}`)}
                                className="p-1 text-slate-400 hover:text-emerald-700 rounded transition"
                                title="Copy improved text"
                              >
                                {copiedIndex === `imp-${idx}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <p className="text-xs text-slate-800 font-medium leading-relaxed">
                              {imp.improvedText}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Buzzwords & Action Verbs */}
              {activeTab === 'buzzwords' && (
                <div className="space-y-5">
                  {/* Buzzwords flagged */}
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-2">
                      <Flame className="w-4 h-4 text-amber-600" />
                      Clichés & Overused Buzzwords Found in Your Resume ({analysis.buzzwordsFound?.length || 0})
                    </h4>
                    <p className="text-xs text-slate-600 mb-3">
                      Recruiters instantly ignore these generic filler words. Replace them with concrete accomplishments:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.buzzwordsFound?.length > 0 ? (
                        analysis.buzzwordsFound.map((bw, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1"
                          >
                            <X className="w-3 h-3 text-rose-500" />
                            {bw}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Zero generic buzzwords detected. Great job!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Strong Verbs found */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      Strong Action Verbs Found in Your Resume ({analysis.actionVerbsFound?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.actionVerbsFound?.length > 0 ? (
                        analysis.actionVerbsFound.map((verb, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200"
                          >
                            ✓ {verb}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-amber-700">
                          No high-impact action verbs detected. We recommend starting your bullets with: Spearheaded, Architected, Automated, Engineered, Accelerated.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recommended Power Verbs Cheat Sheet */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <h4 className="text-xs font-bold text-slate-800 mb-2">
                      Recommended Power Verbs to Use:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700 font-medium">
                      <div className="p-2 bg-white rounded-lg border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-bold">LEADERSHIP</span>
                        Spearheaded, Directed, Orchestrated, Pioneered
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-bold">ENGINEERING</span>
                        Architected, Engineered, Formulated, Automated
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-bold">EFFICIENCY</span>
                        Accelerated, Optimized, Streamlined, Reduced
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-bold">IMPACT</span>
                        Delivered, Scaled, Transformed, Championed
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Section Breakdown */}
              {activeTab === 'breakdown' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">
                    ATS scanners evaluate each standard section independently. Here is how your uploaded document scores:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(analysis.sectionScores || {}).map(([sec, sc]) => (
                      <div key={sec} className="p-4 rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-slate-800">{sec}</span>
                          <span className={`font-extrabold ${sc >= 80 ? 'text-emerald-600' : sc >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                            {sc} / 100
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              sc >= 80 ? 'bg-emerald-500' : sc >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${sc}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Parsed Data */}
              {activeTab === 'extracted' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Parsed Candidate Profile</span>
                      <button
                        type="button"
                        onClick={handleImportToBuilder}
                        className="px-3 py-1 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Import into Editor
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Candidate Name</span>
                        <span className="font-semibold text-slate-800">
                          {analysis.parsedResume?.personalInfo?.fullName || 'Not detected'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Target Role / Title</span>
                        <span className="font-semibold text-slate-800">
                          {analysis.parsedResume?.personalInfo?.jobTitle || 'Not detected'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Email</span>
                        <span className="font-semibold text-slate-800">
                          {analysis.parsedResume?.personalInfo?.email || 'Not detected'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Phone</span>
                        <span className="font-semibold text-slate-800">
                          {analysis.parsedResume?.personalInfo?.phone || 'Not detected'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-slate-400 block text-[10px] mb-1">Extracted Skills ({analysis.parsedResume?.skills?.length || 0})</span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.parsedResume?.skills?.map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[11px]">
                            {sk.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Raw Text Collapsible */}
                  <details className="rounded-xl border border-slate-200 p-3 bg-white text-xs">
                    <summary className="font-semibold text-slate-700 cursor-pointer">
                      View Raw Extracted Text ({analysis.characterCount} chars)
                    </summary>
                    <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-[11px] font-mono whitespace-pre-wrap max-h-60">
                      {analysis.extractedText}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>
            {analysis ? 'Resume parsed and audited successfully.' : 'Upload any existing resume to check its ATS score.'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/70 font-semibold transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
