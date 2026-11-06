import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Target,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Loader2,
  Copy,
  Check,
  Zap,
  Plus,
  RefreshCw,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { aiApi } from '../../api/aiApi';

export default function ResumeTailorModal({ isOpen, onClose, resume, onApplyTailoring }) {
  const [jobTitle, setJobTitle] = useState(resume?.targetRole || 'Software Engineer');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [tailorResult, setTailorResult] = useState(null);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleTailor = async (e) => {
    e?.preventDefault();
    if (!jobDescription || jobDescription.trim().length < 20) {
      alert('Please paste the target job description (at least a paragraph) to tailor your resume.');
      return;
    }

    try {
      setLoading(true);
      setApplied(false);
      const res = await aiApi.tailorResume({
        jobTitle,
        company,
        jobDescription,
        resumeId: resume?.id,
        resumeData: resume,
      });
      setTailorResult(res);
    } catch (err) {
      alert(err.message || 'Failed to tailor resume');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAll = () => {
    if (!tailorResult || !resume) return;

    // Create updated resume object
    const updated = { ...resume };

    // 1. Update summary
    if (tailorResult.tailoredSummary) {
      updated.summary = tailorResult.tailoredSummary;
    }

    // 2. Update role headline if desired
    if (tailorResult.tailoredRoleHeadline) {
      updated.targetRole = jobTitle;
      if (updated.personalInfo) {
        updated.personalInfo = {
          ...updated.personalInfo,
          jobTitle: jobTitle,
        };
      }
    }

    // 3. Update experience bullets
    if (tailorResult.bulletOptimizations && tailorResult.bulletOptimizations.length > 0 && updated.experiences?.length > 0) {
      const optimizedMap = new Map();
      tailorResult.bulletOptimizations.forEach((bo) => {
        if (bo.originalBullet && bo.tailoredBullet) {
          optimizedMap.set(bo.originalBullet.toLowerCase().trim(), bo.tailoredBullet);
        }
      });

      updated.experiences = updated.experiences.map((exp, expIdx) => {
        if (expIdx === 0 && exp.bulletPoints) {
          // Replace matching or inject tailored
          const lines = exp.bulletPoints.split('\n');
          const newLines = lines.map((l) => {
            const clean = l.replace(/^[•\s\-\*]+/, '').trim().toLowerCase();
            if (optimizedMap.has(clean)) {
              return `• ${optimizedMap.get(clean)}`;
            }
            return l;
          });
          return {
            ...exp,
            bulletPoints: newLines.join('\n'),
          };
        }
        return exp;
      });
    }

    // 4. Append suggested skills
    if (tailorResult.suggestedSkills && tailorResult.suggestedSkills.length > 0) {
      const existingSkillNames = new Set((updated.skills || []).map((s) => s.name?.toLowerCase()));
      const newSkills = [...(updated.skills || [])];

      tailorResult.suggestedSkills.forEach((skillName, i) => {
        if (!existingSkillNames.has(skillName.toLowerCase())) {
          newSkills.push({
            id: `tailor-sk-${Date.now()}-${i}`,
            name: skillName,
            category: 'Technical Skills',
            proficiency: 'Advanced',
          });
          existingSkillNames.add(skillName.toLowerCase());
        }
      });
      updated.skills = newSkills;
    }

    // Call callback to update parent state and save
    if (onApplyTailoring) {
      onApplyTailoring(updated);
    }

    setApplied(true);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-linear-to-r from-emerald-50/50 via-teal-50/30 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                1-Click AI Resume Tailorer
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
                  Instant Match
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste any job posting to automatically optimize your summary, inject high-value keywords, and upgrade bullet points.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Input Form */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Company Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Stripe, Microsoft"
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Paste Job Description
              </label>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job requirements, responsibilities, and qualifications from the job posting..."
                className="w-full text-xs p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleTailor}
                disabled={loading}
                className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Tailoring Resume with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Tailor My Resume
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tailoring Results */}
          {tailorResult && (
            <div className="space-y-6 animate-in fade-in">
              {/* Match Boost Score Banner */}
              <div className="p-4 rounded-xl bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                    {tailorResult.projectedMatchScoreAfter}%
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Projected ATS Match Score
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        +{tailorResult.projectedMatchScoreAfter - tailorResult.matchScoreBefore}% Boost
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Baseline score was {tailorResult.matchScoreBefore}%. Applying these changes optimizes keyword density for applicant tracking algorithms.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyAll}
                  disabled={applied}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition cursor-pointer ${
                    applied
                      ? 'bg-emerald-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02]'
                  }`}
                >
                  {applied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Applied to Resume!
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-white" />
                      1-Click Apply Tailoring
                    </>
                  )}
                </button>
              </div>

              {/* Tailored Professional Summary */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Optimized Professional Summary
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    Keyword Aligned
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  {tailorResult.tailoredSummary}
                </p>
              </div>

              {/* Bullet Points Transformations */}
              {tailorResult.bulletOptimizations && tailorResult.bulletOptimizations.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    Experience Bullet Point Upgrades (Before vs After)
                  </h3>

                  <div className="space-y-3">
                    {tailorResult.bulletOptimizations.map((bo, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Bullet #{idx + 1}
                          </span>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                            {bo.rationale}
                          </span>
                        </div>

                        {/* Before */}
                        <div className="p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/40 text-rose-900 dark:text-rose-300 text-[11px]">
                          <span className="font-bold text-rose-600 dark:text-rose-400 block mb-0.5">
                            Original:
                          </span>
                          • {bo.originalBullet}
                        </div>

                        {/* After */}
                        <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-300 font-medium">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Tailored for Job Match:
                          </span>
                          • {bo.tailoredBullet}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills Recommended to Add */}
              {tailorResult.suggestedSkills && tailorResult.suggestedSkills.length > 0 && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    High-Priority Skills from Job Posting to Add to Resume:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tailorResult.suggestedSkills.map((sk, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50 font-medium"
                      >
                        + {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <span className="text-[11px] text-slate-500">
            {tailorResult?.sourceTag || 'Tailored with Intelligent Job Description Matching'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-4 py-1.5 rounded-lg font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white transition"
            >
              Cancel
            </button>
            {tailorResult && (
              <button
                type="button"
                onClick={handleApplyAll}
                disabled={applied}
                className="text-xs px-4 py-1.5 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
              >
                {applied ? 'Applied!' : 'Apply to Resume'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

