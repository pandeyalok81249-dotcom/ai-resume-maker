import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  FileCheck,
  Download,
  Layout,
  CheckCircle2,
  ChevronDown,
  Star,
  Users,
  Award,
  Layers,
  Check,
  Upload,
  Play,
  RotateCcw,
  TrendingUp,
  FileText,
  Briefcase,
  HelpCircle,
  DollarSign,
  Code
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import ResumeUploadAuditModal from '../ai/ResumeUploadAuditModal';

export default function LandingPage({ onNavigate, onSelectTemplateAndCreate }) {
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState(0);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showAuditModal, setShowAuditModal] = useState(false);

  // Interactive Live ATS Simulator state
  const [simScore, setSimScore] = useState(58);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simOptimized, setSimOptimized] = useState(false);

  const templatesList = [
    { key: 'modern-professional', name: 'Modern Professional', category: 'General', color: '#4F46E5', badge: 'Most Popular', ats: '98% ATS' },
    { key: 'software-developer', name: 'Software Developer', category: 'Tech', color: '#06B6D4', badge: 'Top Tech', ats: '99% ATS' },
    { key: 'executive', name: 'Executive Resume', category: 'Leadership', color: '#0F172A', badge: 'C-Level', ats: '96% ATS' },
    { key: 'fresher', name: 'Fresher Resume', category: 'Graduates', color: '#10B981', badge: 'Students', ats: '97% ATS' },
    { key: 'classic-corporate', name: 'Classic Corporate', category: 'Finance & Law', color: '#1E293B', badge: 'Traditional', ats: '99% ATS' },
    { key: 'minimalist', name: 'Minimalist', category: 'Design', color: '#334155', badge: 'Swiss Style', ats: '95% ATS' },
    { key: 'creative', name: 'Creative Resume', category: 'Media', color: '#7C3AED', badge: 'Portfolio', ats: '92% ATS' },
    { key: 'academic', name: 'Academic Curriculum Vitae', category: 'Research', color: '#475569', badge: 'CV Format', ats: '98% ATS' },
  ];

  const [activeInteractiveTemplate, setActiveInteractiveTemplate] = useState('modern-professional');
  const [activeInteractiveColor, setActiveInteractiveColor] = useState('#4F46E5');

  const tickerItems = [
    { company: 'Stripe', role: 'Staff Frontend Engineer', badge: '$215k Offer', detail: 'Tailored with 1-Click AI • ATS 99%', bg: 'bg-indigo-600', icon: 'S' },
    { company: 'Google', role: 'Senior Cloud Architect', badge: '3 Invites in 48h', detail: 'Software Developer Template • Level 6', bg: 'bg-cyan-600', icon: 'G' },
    { company: 'Goldman Sachs', role: 'VP Quant Engineering', badge: 'Offer Accepted', detail: 'Classic Corporate Template • 99% ATS', bg: 'bg-emerald-600', icon: 'GS' },
    { company: 'Amazon', role: 'Solutions Architect', badge: '+$40k Comp Boost', detail: 'Salary Insights Blueprint • Passed Taleo', bg: 'bg-amber-600', icon: 'A' },
    { company: 'Meta', role: 'Product Design Lead', badge: 'Hired Direct', detail: 'Shared via Live Recruiter Web Portfolio', bg: 'bg-purple-600', icon: 'M' },
    { company: 'Microsoft', role: 'Principal AI Engineer', badge: '98% ATS Grade A+', detail: 'Interview Prep STAR Coach passed final loop', bg: 'bg-rose-600', icon: 'MS' },
  ];

  const handleRunSimulator = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    let current = 58;
    const interval = setInterval(() => {
      current += 4;
      if (current >= 96) {
        current = 96;
        clearInterval(interval);
        setIsSimulating(false);
        setSimOptimized(true);
        try {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.65 },
          });
        } catch (e) {}
      }
      setSimScore(current);
    }, 70);
  };

  const handleResetSimulator = () => {
    setSimScore(58);
    setSimOptimized(false);
  };

  const faqs = [
    {
      q: 'What is an ATS and how does ResumeAI help me pass it?',
      a: 'Applicant Tracking Systems (ATS) are software tools used by 98% of Fortune 500 companies to screen and rank resumes before a human recruiter ever sees them. ResumeAI formats your resume into clean, parsable hierarchies, uses standard fonts and section titles, and provides live ATS scoring and keyword gap analysis so your resume reaches the hiring manager\'s desk.'
    },
    {
      q: 'Will the AI invent false qualifications or fake work experience?',
      a: 'No. ResumeAI adheres strictly to ethical resume guidelines. Our AI engine polishes phrasing, adds power verbs, improves sentence clarity, and structures your real achievements without fabricating fake employment, degrees, or false metrics.'
    },
    {
      q: 'Can I tailor my resume for a specific job posting?',
      a: 'Yes! Our 1-Click AI Resume Tailorer compares your resume with any job posting, injects missing industry keywords into your bullets, generates a targeted professional summary, and calculates your before/after match score boost.'
    },
    {
      q: 'How does the AI Interview Prep Coach work?',
      a: 'It scans your actual resume projects and experience to generate personalized STAR behavioral, technical, and architectural questions. You can practice typing your answer and receive real-time AI scoring (0–100) with concrete strengths, improvement tips, and elevated model answers.'
    },
    {
      q: 'Can I export in other formats besides PDF?',
      a: 'Yes! You can download high-precision vector PDFs, standard JSON Resume (.json), clean ASCII Plain Text (.txt) formatted for ATS application text boxes, and GitHub Markdown (.md).'
    },
    {
      q: 'Can I share my resume directly with recruiters?',
      a: 'Yes. Toggle public sharing to generate a live web portfolio link (e.g. /?share=id) that recruiters can view on any device, download your PDF, and contact you directly without needing an account.'
    }
  ];

  const handleStart = (templateKey = 'modern-professional') => {
    if (isAuthenticated) {
      if (onSelectTemplateAndCreate) {
        onSelectTemplateAndCreate(templateKey);
      } else {
        onNavigate('dashboard');
      }
    } else {
      onNavigate('register');
    }
  };

  return (
    <div className="space-y-28 pb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Animated glowing mesh background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-cyan-500/25 blur-3xl rounded-full -z-10 pointer-events-none animate-glow" />

        {/* Floating Badge 1 (Left) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden xl:flex absolute left-8 top-28 items-center gap-3 p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl animate-float-slow z-20"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
              98% ATS Pass Rate
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="text-[10px] text-slate-500">Google & Stripe Standard</div>
          </div>
        </motion.div>

        {/* Floating Badge 2 (Right) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden xl:flex absolute right-8 top-32 items-center gap-3 p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl animate-float-reverse z-20"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/30">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              +28% Salary Boost
            </div>
            <div className="text-[10px] text-slate-500">1-Click Job Tailoring</div>
          </div>
        </motion.div>

        {/* Hero Top Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 via-purple-50 to-cyan-50 dark:from-indigo-950/70 dark:via-purple-950/60 dark:to-cyan-950/70 border border-indigo-200/70 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 shadow-xs animate-glow"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Next-Generation AI Resume Maker & Career Suite 2.0</span>
          <span className="px-2 py-0.2 rounded-full bg-indigo-600 text-white text-[10px] uppercase font-extrabold tracking-wider">
            Enhanced
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]"
        >
          Build a Resume That Beats the ATS &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 animate-gradient">
            Lands High-Paying Offers.
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Automated summary writer, 1-click job tailoring, AI mock interview coach, real-time ATS compatibility scoring, and instant multi-format vector PDF exports.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
        >
          <button
            onClick={() => handleStart('modern-professional')}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold text-sm rounded-2xl shadow-xl hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer shine-overlay"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create My Resume Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowAuditModal(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-cyan-500" />
            <span>Audit Existing Resume</span>
          </button>

          <a
            href="#templates"
            className="w-full sm:w-auto px-6 py-3.5 bg-indigo-50/70 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold text-sm rounded-2xl border border-indigo-200/80 dark:border-indigo-800 shadow-xs transition"
          >
            Explore 8+ Templates
          </a>
        </motion.div>

        {/* Interactive Live ATS Diagnostic Simulator */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 max-w-4xl mx-auto p-4 sm:p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl relative overflow-hidden text-left"
        >
          {/* Top simulated browser bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              <span className="text-xs font-semibold text-slate-400 ml-2 font-mono">
                ats-live-simulator.resumeai.com
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Live Interactive Diagnostic
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Score Ring Gauge */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="8"
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-700"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="8"
                    stroke="currentColor"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * simScore) / 100}
                    strokeLinecap="round"
                    className={`transition-all duration-300 ${
                      simScore >= 90 ? 'text-emerald-500' : simScore >= 75 ? 'text-indigo-500' : 'text-amber-500'
                    }`}
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {simScore}%
                  </span>
                  <span className={`text-[10px] font-bold uppercase ${
                    simScore >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {simScore >= 90 ? 'Exceptional (A+)' : 'Needs Optimization'}
                  </span>
                </div>
              </div>

              <div className="mt-4 w-full">
                {!simOptimized ? (
                  <button
                    type="button"
                    onClick={handleRunSimulator}
                    disabled={isSimulating}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{isSimulating ? 'Optimizing Resume...' : 'Test 1-Click AI Optimization'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleResetSimulator}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Diagnostic</span>
                  </button>
                )}
              </div>
            </div>

            {/* Diagnostic Metrics */}
            <div className="md:col-span-7 space-y-3">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Live Resume Parsing Telemetry
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {simOptimized
                    ? 'All critical ATS barriers eliminated. Your resume matches Fortune 500 parsing engines.'
                    : 'Click the test button to observe our algorithm injecting keywords and quantifiable metrics.'}
                </p>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Job Keyword Match (Full-Stack)</span>
                  <span className={`font-bold ${simOptimized ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {simOptimized ? '19 / 20 Matched (95%)' : '11 / 20 Matched (55%)'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Active Executive Verbs</span>
                  <span className={`font-bold ${simOptimized ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {simOptimized ? 'Spearheaded, Architected, Engineered' : 'Helped with, Handled, Worked on'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Quantified Metrics ($, %, latency)</span>
                  <span className={`font-bold ${simOptimized ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {simOptimized ? '8 Verified Business Metrics Included' : 'No quantifiable numbers detected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Illustrative statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5 text-center max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 shadow-xs card-interactive">
            <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">3.5x</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">More Recruiter Callbacks</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 shadow-xs card-interactive">
            <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">98%+</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Average ATS Pass Rate</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 shadow-xs card-interactive">
            <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">8+</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Specialized Templates</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 shadow-xs card-interactive">
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">&lt; 5 min</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Tailored to Any Job Post</div>
          </div>
        </div>

        {/* Real-Time Live Offer & Recruiter Callbacks Ticker */}
        <div className="mt-14 w-full marquee-container">
          <div className="marquee-track">
            {tickerItems.concat(tickerItems).map((item, idx) => (
              <div
                key={idx}
                className="px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-850/90 border border-slate-200/80 dark:border-slate-800 shadow-md backdrop-blur-md flex items-center gap-3 shrink-0 hover:border-indigo-400 transition"
              >
                <div className={`w-8 h-8 rounded-xl ${item.bg} text-white flex items-center justify-center font-black text-xs shadow-xs`}>
                  {item.icon}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{item.company}</span>
                    <span className="text-slate-400 font-normal">|</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{item.role}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {item.badge}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase: Animated Cards */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Next-Gen Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Everything You Need from Blank Page to Signed Offer
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Engineered with deep learning heuristics and battle-tested ATS rules to ensure your resume stands out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 1-Click Tailorer */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 shadow-sm card-interactive shine-overlay group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 fill-emerald-600" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  1-Click AI Resume Tailorer
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Instant
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Paste any job description to automatically inject matching keywords, upgrade bullets, and project your ATS score boost before applying.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Up to +30% ATS boost</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Interview Prep Coach */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 shadow-sm card-interactive shine-overlay group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  AI Interview Prep & Mock Coach
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  Interactive
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Generates tailored STAR behavioral questions directly from your resume, provides talking points, and scores your practice answers in real-time.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
              <span>Interactive answer scoring</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Salary & Market Insights */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 shadow-sm card-interactive shine-overlay group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Salary & Career Market Insights
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  Analytics
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Benchmark compensation percentiles for your role, discover high-paying skill multipliers (+18% for Kubernetes/Cloud), and get negotiation blueprints.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>25th–Top 10% Brackets</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Multi-Format Export */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 shadow-sm card-interactive shine-overlay group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Multi-Format Export & Sharing
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                  Standard
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Export to open JSON Resume, plain text ATS ASCII for job application boxes, GitHub Markdown (.md), or publish a live recruiter portfolio link.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              <span>JSON, TXT, MD, PDF & Web Link</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: ATS Checker */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 shadow-sm card-interactive shine-overlay group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Deep ATS Algorithm Auditor
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Scans formatting consistency, font compatibility, section hierarchy, and keyword density against rules from Taleo, Greenhouse, and Workday.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>0–100 Compatibility Score</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Upload & Convert */}
          <div
            onClick={() => setShowAuditModal(true)}
            className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 dark:bg-slate-800/90 border-2 border-dashed border-indigo-400/80 dark:border-indigo-600/80 shadow-sm card-interactive cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-indigo-500/20">
                <Upload className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Upload & Convert Existing PDF
                </h3>
                <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                  FREE
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Already have an old resume? Upload it to discover hidden ATS red flags and automatically populate your ResumeAI builder in seconds.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>Instant PDF / Word diagnostic</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Resume Template Showcase */}
      <section id="templates" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Design Excellence
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            8 Battle-Tested, ATS-Optimized Templates
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Engineered for pixel-perfect printing and instant ATS parsing across corporate, tech, creative, and academic careers.
          </p>
        </div>

        {/* Interactive Template Selector & Color Customizer Bar */}
        <div className="mb-10 p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xl backdrop-blur-md max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 card-interactive">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
            {templatesList.map((tpl) => (
              <button
                key={tpl.key}
                type="button"
                onClick={() => {
                  setActiveInteractiveTemplate(tpl.key);
                  setActiveInteractiveColor(tpl.color);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeInteractiveTemplate === tpl.key
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tpl.color }} />
                <span>{tpl.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0">
            <div className="flex items-center gap-1.5">
              {['#4F46E5', '#06B6D4', '#10B981', '#7C3AED', '#0F172A'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveInteractiveColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition transform hover:scale-110 cursor-pointer ${
                    activeInteractiveColor === c ? 'border-slate-900 dark:border-white scale-110 shadow-xs' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                  title="Test palette accent"
                />
              ))}
            </div>

            <button
              onClick={() => handleStart(activeInteractiveTemplate)}
              className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-indigo-700 hover:to-purple-700 transition flex items-center gap-1 cursor-pointer"
            >
              <span>Build Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templatesList.map((tpl) => (
            <div
              key={tpl.key}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden shadow-card card-interactive group flex flex-col justify-between"
            >
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {tpl.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {tpl.ats}
                </span>
              </div>

              {/* Template thumbnail mockup */}
              <div className="p-5 flex-1 flex flex-col justify-center">
                <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-2 group-hover:scale-[1.02] transition-transform">
                  <div className="h-3 w-2/3 rounded-sm shadow-xs" style={{ backgroundColor: tpl.color }} />
                  <div className="h-1.5 w-1/3 bg-slate-300 dark:bg-slate-700 rounded-sm" />
                  <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-700 mt-2" />
                  <div className="space-y-1 pt-1">
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-sm" />
                    <div className="h-1.5 w-4/5 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                    <div className="h-1.5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                  </div>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-3 text-center">
                  {tpl.name}
                </h4>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => handleStart(tpl.key)}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Use This Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Speed & Precision
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Your 3-Step Journey to Top Interviews
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-center card-interactive">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Select Template & Enter Details
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Pick from our 8 ATS-ready designs and fill in your education, experience, and skills in our intuitive split-screen real-time editor.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-center card-interactive">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Optimize with AI Intelligence
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              1-click tailor your resume for any job description, convert duty descriptions into quantified metrics, and practice with our AI Interview Prep Coach.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-center card-interactive">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Download PDF & Share Web Link
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Download crisp, pixel-perfect A4 PDFs, export JSON Resume, copy ATS-safe plain text, or send recruiters your live web portfolio link.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Fair & Transparent
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Choose the Plan That Fits Your Goals
          </h2>

          {/* Billing cycle toggle */}
          <div className="pt-4 inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                billingCycle === 'annual' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              <span>Annual</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">25% OFF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm card-interactive flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">Free Starter</h3>
              <p className="text-xs text-slate-500 mb-4">Essential tools for students & fresh graduates</p>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">$0</div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 1 Active Resume</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Standard ATS Templates</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Basic AI Summary Generator</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited PDF Downloads</li>
              </ul>
            </div>
            <button
              onClick={() => handleStart()}
              className="mt-8 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Start Free
            </button>
          </div>

          {/* Pro Tier (Featured) */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-50/60 to-white dark:from-indigo-950/40 dark:to-slate-800 border-2 border-indigo-600 shadow-xl relative flex flex-col justify-between card-interactive">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Most Popular
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">Pro Career</h3>
              <p className="text-xs text-slate-500 mb-4">For active job seekers who want fast interviews</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {billingCycle === 'annual' ? '$9' : '$12'}
                </span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited Resumes & Duplicates</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 1-Click AI Resume Tailorer</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> AI Interview Prep & Mock Coach</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Public Web Portfolio Sharing</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> All 8 Professional Templates</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Multi-Format Export (JSON, TXT, MD)</li>
              </ul>
            </div>
            <button
              onClick={() => handleStart()}
              className="mt-8 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Get Pro Access
            </button>
          </div>

          {/* Executive Tier */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm card-interactive flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">Executive / Team</h3>
              <p className="text-xs text-slate-500 mb-4">For senior leaders, coaches & agencies</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {billingCycle === 'annual' ? '$24' : '$29'}
                </span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Everything in Pro</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> AI Salary & Career Market Insights</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> LinkedIn Profile Optimizer</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Custom LLM Key Integration</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Priority 24/7 VIP Support</li>
              </ul>
            </div>
            <button
              onClick={() => handleStart()}
              className="mt-8 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Select Executive
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 overflow-hidden transition shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-semibold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden card-interactive">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Join thousands of job seekers who created professional, ATS-optimized resumes and secured interviews at leading companies.
            </p>
            <div className="pt-4">
              <button
                onClick={() => handleStart('modern-professional')}
                className="px-8 py-3.5 bg-white text-indigo-700 hover:bg-slate-100 font-bold text-sm rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Build My Resume Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {showAuditModal && (
        <ResumeUploadAuditModal
          isOpen={true}
          onClose={() => setShowAuditModal(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
