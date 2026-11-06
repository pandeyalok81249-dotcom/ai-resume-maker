import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  FileText,
  Copy,
  Trash2,
  Download,
  Edit3,
  ShieldCheck,
  Target,
  Sparkles,
  Mail,
  Share2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
  Zap,
  HelpCircle,
  DollarSign,
  FileCode,
  Globe,
  ExternalLink,
  Award,
  BarChart3,
  ChevronRight,
  Search,
  Filter,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { resumeApi } from '../../api/resumeApi';
import { userApi } from '../../api/userApi';
import JobMatchModal from '../ai/JobMatchModal';
import CoverLetterModal from '../ai/CoverLetterModal';
import LinkedInModal from '../ai/LinkedInModal';
import ResumeUploadAuditModal from '../ai/ResumeUploadAuditModal';
import InterviewPrepModal from '../ai/InterviewPrepModal';
import ResumeTailorModal from '../ai/ResumeTailorModal';
import SalaryInsightsModal from '../ai/SalaryInsightsModal';
import ExportImportModal from '../common/ExportImportModal';
import ShareModal from '../common/ShareModal';

export default function DashboardPage({ onNavigate, onEditResume }) {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Resume Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('My Professional Resume');
  const [newTargetRole, setNewTargetRole] = useState(user?.targetRole || 'Software Engineer');
  const [newTemplate, setNewTemplate] = useState('modern-professional');
  const [creating, setCreating] = useState(false);

  // Quick Action AI Modals
  const [activeResumeForAi, setActiveResumeForAi] = useState(null);
  const [showJobMatch, setShowJobMatch] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [showLinkedIn, setShowLinkedIn] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showInterviewPrep, setShowInterviewPrep] = useState(false);
  const [showTailor, setShowTailor] = useState(false);
  const [showSalaryInsights, setShowSalaryInsights] = useState(false);
  const [showExportImport, setShowExportImport] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const handleApplyImportedResume = async (imported) => {
    try {
      const created = await resumeApi.createResume({
        title: imported.title || 'Imported Resume',
        targetRole: imported.targetRole || 'Professional',
        templateKey: imported.templateKey || 'modern-professional',
      });
      const updated = await resumeApi.updateResume(created.id, {
        ...created,
        ...imported,
      });
      setResumes([updated, ...resumes]);
      onEditResume(updated);
    } catch (err) {
      alert(err.message || 'Failed to import resume');
    }
  };

  const handleApplyTailoredResume = async (tailored) => {
    try {
      if (!tailored?.id) return;
      const updated = await resumeApi.updateResume(tailored.id, tailored);
      setResumes(resumes.map((r) => (r.id === updated.id ? updated : r)));
    } catch (err) {
      alert(err.message || 'Failed to save tailored resume');
    }
  };

  const handleTogglePublicSuccess = (updated) => {
    setResumes(resumes.map((r) => (r.id === updated.id ? { ...r, isPublic: updated.isPublic } : r)));
    if (activeResumeForAi?.id === updated.id) {
      setActiveResumeForAi(updated);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [resumesData, statsData] = await Promise.all([
        resumeApi.getResumes(),
        userApi.getStats().catch(() => null),
      ]);
      setResumes(resumesData || []);
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const created = await resumeApi.createResume({
        title: newTitle,
        targetRole: newTargetRole,
        templateKey: newTemplate,
      });
      setShowCreateModal(false);
      onEditResume(created);
    } catch (err) {
      alert(err.message || 'Failed to create resume');
    } finally {
      setCreating(false);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const duplicated = await resumeApi.duplicateResume(id);
      setResumes([duplicated, ...resumes]);
    } catch (err) {
      alert(err.message || 'Failed to duplicate resume');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await resumeApi.deleteResume(id);
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete resume');
    }
  };

  const handleDownload = async (resume) => {
    try {
      const blob = await resumeApi.downloadPdf(resume.id);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resume.title.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to download PDF: ' + err.message);
    }
  };

  const templatesList = [
    { key: 'modern-professional', name: 'Modern Professional' },
    { key: 'software-developer', name: 'Software Developer' },
    { key: 'executive', name: 'Executive Resume' },
    { key: 'fresher', name: 'Fresher Resume' },
    { key: 'classic-corporate', name: 'Classic Corporate' },
    { key: 'minimalist', name: 'Minimalist' },
    { key: 'creative', name: 'Creative Resume' },
    { key: 'academic', name: 'Academic Curriculum Vitae' },
  ];

  // Calculate average ATS and filters
  const avgAts = resumes.length > 0
    ? Math.round(resumes.reduce((acc, r) => acc + (r.atsScore || 65), 0) / resumes.length)
    : 85;

  const highAtsCount = resumes.filter(r => (r.atsScore || 70) >= 80).length;
  const publicCount = resumes.filter(r => !!r.isPublic).length;
  const techCount = resumes.filter(r => (r.templateKey || '').includes('tech') || (r.templateKey || '').includes('software')).length;

  const filteredResumes = resumes.filter((r) => {
    const matchesSearch =
      (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.targetRole || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'highAts') return (r.atsScore || 70) >= 80;
    if (activeFilter === 'public') return !!r.isPublic;
    if (activeFilter === 'tech') return (r.templateKey || '').includes('tech') || (r.templateKey || '').includes('software');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Animated Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        {/* Ambient glow decoration */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-cyan-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              AI Career Intelligence Dashboard
            </span>
            <span className="text-indigo-200 text-xs font-medium">
              Target: <strong className="text-white">{user?.targetRole || 'Professional'}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.firstName || 'Candidate'}!
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
            You have <span className="font-extrabold text-white underline decoration-cyan-400 decoration-2">{resumes.length} active resume{resumes.length !== 1 ? 's' : ''}</span>. Use our 1-click tailorer, practice with the mock interview coach, and track your ATS score.
          </p>

          {/* Quick AI tool shortcuts banner */}
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => {
                if (resumes.length > 0) setActiveResumeForAi(resumes[0]);
                setShowTailor(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold backdrop-blur-sm border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>1-Click Tailor</span>
            </button>

            <button
              onClick={() => {
                if (resumes.length > 0) setActiveResumeForAi(resumes[0]);
                setShowInterviewPrep(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold backdrop-blur-sm border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-300" />
              <span>Interview Prep</span>
            </button>

            <button
              onClick={() => setShowSalaryInsights(true)}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold backdrop-blur-sm border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-300" />
              <span>Salary Insights</span>
            </button>

            <button
              onClick={() => {
                if (resumes.length > 0) setActiveResumeForAi(resumes[0]);
                setShowExportImport(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold backdrop-blur-sm border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-300" />
              <span>Import JSON</span>
            </button>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white border border-white/25 font-bold text-xs rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer"
          >
            <Upload className="w-4 h-4 text-cyan-300" />
            <span>Upload & Audit Resume</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-white text-indigo-700 hover:bg-slate-100 font-extrabold text-xs rounded-2xl shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer shine-overlay"
          >
            <Plus className="w-4 h-4 text-indigo-700" />
            <span>Create New Resume</span>
          </button>
        </div>
      </motion.div>

      {/* Animated Stats Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Total Resumes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm card-interactive flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Total Resumes</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {resumes.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Ready for active applications</span>
          </div>
        </div>

        {/* Card 2: Average ATS Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm card-interactive flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Average ATS Score</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {avgAts}%
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
              Grade A+
            </span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Top 10% candidate ATS compatibility</span>
          </div>
        </div>

        {/* Card 3: Ready for Submission */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm card-interactive flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">High-Impact Drafts</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {resumes.filter((r) => (r.completionPercentage || 0) >= 60).length} / {Math.max(resumes.length, 1)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            Over 60% completion density
          </div>
        </div>

        {/* Card 4: Target Role & Market Demand */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm card-interactive flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Target Specialization</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
            {user?.targetRole || 'Software Professional'}
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>High Market Demand</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid: Resumes List on Left & AI Power Tools on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Resumes List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Your Resumes ({resumes.length})
              </h2>
              <p className="text-xs text-slate-500">
                Manage, tailor, test with AI mock questions, or share with recruiters.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Resume
            </button>
          </div>

          {/* Search & Filter Controls */}
          {resumes.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by resume title or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  All ({resumes.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilter('highAts')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                    activeFilter === 'highAts'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  ATS 80%+ ({highAtsCount})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilter('public')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                    activeFilter === 'public'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Globe className="w-3 h-3 text-cyan-500" />
                  Public ({publicCount})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilter('tech')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeFilter === 'tech'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Tech ({techCount})
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-2" />
              Loading your resumes...
            </div>
          ) : resumes.length === 0 ? (
            <div className="p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3 card-interactive">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mx-auto flex items-center justify-center shadow-md shadow-indigo-500/10">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                No resumes created yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first AI-assisted resume to start landing interviews with confidence.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Build My First Resume
              </button>
            </div>
          ) : filteredResumes.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-500">No resumes match your current filter or search.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Reset search & filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredResumes.map((resume) => {
                const completion = resume.completionPercentage || 45;
                const ats = resume.atsScore || 70;
                const resumeTheme = resume.themeColor || '#4F46E5';

                return (
                  <motion.div
                    key={resume.id}
                    whileHover={{ y: -5, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition flex flex-col justify-between group relative overflow-hidden card-interactive"
                    style={{
                      borderTop: `4px solid ${resumeTheme}`,
                    }}
                  >
                    {/* Mini visual mockup bar at top of card */}
                    <div className="px-5 pt-3.5 pb-2 bg-slate-50/70 dark:bg-slate-850/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: resumeTheme }}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {resume.templateKey?.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {resume.isPublic && (
                          <a
                            href={`/?share=${resume.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 flex items-center gap-1 hover:underline"
                            title="Open live public portfolio link"
                          >
                            <Globe className="w-3 h-3" />
                            <span>Public</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" />
                          ATS {ats}%
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title & Role */}
                        <h3
                          onClick={() => onEditResume(resume)}
                          className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 cursor-pointer transition line-clamp-1"
                        >
                          {resume.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {resume.targetRole || 'Professional'}
                        </p>

                        {/* Completion Progress Bar */}
                        <div className="mt-4 space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Profile Completeness</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{completion}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${completion}%`,
                                backgroundColor: resumeTheme,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Actions Toolbar */}
                      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <button
                          onClick={() => onEditResume(resume)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setActiveResumeForAi(resume);
                              setShowTailor(true);
                            }}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition cursor-pointer"
                            title="1-Click AI Resume Tailorer"
                          >
                            <Zap className="w-4 h-4 fill-emerald-600" />
                          </button>

                          <button
                            onClick={() => {
                              setActiveResumeForAi(resume);
                              setShowInterviewPrep(true);
                            }}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-lg transition cursor-pointer"
                            title="AI Interview Prep Coach"
                          >
                            <HelpCircle className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setActiveResumeForAi(resume);
                              setShowShare(true);
                            }}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition cursor-pointer"
                            title="Share Web Portfolio Link"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setActiveResumeForAi(resume);
                              setShowExportImport(true);
                            }}
                            className="p-1.5 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 rounded-lg transition cursor-pointer"
                            title="Export / Import (JSON, TXT, MD)"
                          >
                            <FileCode className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDuplicate(resume.id)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Duplicate Resume"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDownload(resume)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(resume.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Delete Resume"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Quick Actions & Insights Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                AI Career Power Tools
              </span>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                Live Suite
              </span>
            </h3>

            <div className="space-y-2.5">
              {/* 1-Click Resume Tailorer */}
              <button
                type="button"
                onClick={() => {
                  if (resumes.length === 0) {
                    alert('Please create a resume first!');
                    return;
                  }
                  setActiveResumeForAi(resumes[0]);
                  setShowTailor(true);
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700/80 text-left transition flex items-center justify-between group cursor-pointer card-interactive"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5 fill-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 flex items-center gap-1.5">
                      1-Click Resume Tailorer
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-extrabold">NEW</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Optimize bullets for any job posting</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* AI Interview Prep Coach */}
              <button
                type="button"
                onClick={() => {
                  if (resumes.length === 0) {
                    alert('Please create a resume first!');
                    return;
                  }
                  setActiveResumeForAi(resumes[0]);
                  setShowInterviewPrep(true);
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700/80 text-left transition flex items-center justify-between group cursor-pointer card-interactive"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 flex items-center gap-1.5">
                      AI Interview Prep & Mock Coach
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 font-extrabold">NEW</span>
                    </div>
                    <div className="text-[11px] text-slate-400">STAR questions & live answer scoring</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Salary & Career Insights */}
              <button
                type="button"
                onClick={() => {
                  if (resumes.length === 0) {
                    alert('Please create a resume first!');
                    return;
                  }
                  setActiveResumeForAi(resumes[0]);
                  setShowSalaryInsights(true);
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700/80 text-left transition flex items-center justify-between group cursor-pointer card-interactive"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 flex items-center gap-1.5">
                      Salary Benchmarks & Growth
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-extrabold">NEW</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Compensation bands & skill premiums</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Multi-Format Export / Import */}
              <button
                type="button"
                onClick={() => {
                  if (resumes.length === 0) {
                    alert('Please create a resume first!');
                    return;
                  }
                  setActiveResumeForAi(resumes[0]);
                  setShowExportImport(true);
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-700/80 text-left transition flex items-center justify-between group cursor-pointer card-interactive"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-900/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600">
                      Export / Import Hub
                    </div>
                    <div className="text-[11px] text-slate-400">JSON Resume, Plain Text ATS, Markdown</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Job Match */}
              <button
                type="button"
                onClick={() => {
                  if (resumes.length === 0) {
                    alert('Please create a resume first!');
                    return;
                  }
                  setActiveResumeForAi(resumes[0]);
                  setShowJobMatch(true);
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700/80 text-left transition flex items-center justify-between group cursor-pointer card-interactive"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">
                      Match Job Description
                    </div>
                    <div className="text-[11px] text-slate-400">Scan for missing keywords</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Cover Letter */}
              <button
                type="button"
                onClick={() => {
                  if (resumes.length === 0) {
                    alert('Please create a resume first!');
                    return;
                  }
                  setActiveResumeForAi(resumes[0]);
                  setShowCoverLetter(true);
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700/80 text-left transition flex items-center justify-between group cursor-pointer card-interactive"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600">
                      Generate Cover Letter
                    </div>
                    <div className="text-[11px] text-slate-400">Custom tailored to any role</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                onClick={() => {
                  if (resumes.length === 0) {
                    alert('Please create a resume first!');
                    return;
                  }
                  setActiveResumeForAi(resumes[0]);
                  setShowLinkedIn(true);
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200 dark:border-slate-700/80 text-left transition flex items-center justify-between group cursor-pointer card-interactive"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-[#0077B5] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0077B5]">
                      LinkedIn Profile Optimizer
                    </div>
                    <div className="text-[11px] text-slate-400">Headline & About copy</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0077B5] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Quick ATS Tips Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/70 to-purple-50/70 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2.5 text-xs card-interactive">
            <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Executive Resume Advice
            </div>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              <li>• Always quantify accomplishments (e.g. <em>"reduced query latency by 35%"</em>).</li>
              <li>• Align skills directly with the keywords from your target job description.</li>
              <li>• Export to ATS Plain Text when applying through Taleo or Workday text boxes.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Create New Resume Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Create New Resume
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select starting template and career focus.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateResume} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Resume Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Full-Stack Engineer Resume"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Role / Job Title
                </label>
                <input
                  type="text"
                  value={newTargetRole}
                  onChange={(e) => setNewTargetRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Template
                </label>
                <select
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {templatesList.map((t) => (
                    <option key={t.key} value={t.key}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Create Resume</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Modals */}
      {showTailor && activeResumeForAi && (
        <ResumeTailorModal
          isOpen={true}
          onClose={() => setShowTailor(false)}
          resume={activeResumeForAi}
          onApplyTailoring={handleApplyTailoredResume}
        />
      )}

      {showInterviewPrep && activeResumeForAi && (
        <InterviewPrepModal
          isOpen={true}
          onClose={() => setShowInterviewPrep(false)}
          resume={activeResumeForAi}
        />
      )}

      {showSalaryInsights && (
        <SalaryInsightsModal
          isOpen={true}
          onClose={() => setShowSalaryInsights(false)}
          resume={activeResumeForAi || resumes[0]}
        />
      )}

      {showExportImport && activeResumeForAi && (
        <ExportImportModal
          isOpen={true}
          onClose={() => setShowExportImport(false)}
          resume={activeResumeForAi}
          onImportResume={handleApplyImportedResume}
        />
      )}

      {showShare && activeResumeForAi && (
        <ShareModal
          isOpen={true}
          onClose={() => setShowShare(false)}
          resume={activeResumeForAi}
          onTogglePublic={handleTogglePublicSuccess}
        />
      )}

      {showJobMatch && activeResumeForAi && (
        <JobMatchModal
          isOpen={true}
          onClose={() => setShowJobMatch(false)}
          resume={activeResumeForAi}
        />
      )}

      {showCoverLetter && activeResumeForAi && (
        <CoverLetterModal
          isOpen={true}
          onClose={() => setShowCoverLetter(false)}
          resume={activeResumeForAi}
        />
      )}

      {showLinkedIn && activeResumeForAi && (
        <LinkedInModal
          isOpen={true}
          onClose={() => setShowLinkedIn(false)}
          resume={activeResumeForAi}
        />
      )}

      {showUploadModal && (
        <ResumeUploadAuditModal
          isOpen={true}
          onClose={() => {
            setShowUploadModal(false);
            loadData();
          }}
          onImportResume={(imported) => {
            setShowUploadModal(false);
            onEditResume(imported);
          }}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
