import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Zap, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { aiApi } from '../../api/aiApi';
import confetti from 'canvas-confetti';

export default function AtsCheckerDrawer({ isOpen, onClose, resume }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && resume) {
      runAnalysis();
    }
  }, [isOpen, resume]);

  const runAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await aiApi.analyzeAts({
        resumeId: resume.id,
        targetRole: resume.targetRole || 'Software Professional',
        resumeData: resume,
      });
      setAnalysis(res);
      if (res.overallScore >= 85) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to complete ATS analysis');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slideLeft">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                ATS Compatibility Checker
              </h3>
              <p className="text-[11px] text-slate-400">
                Live Applicant Tracking System analysis & scoring
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-xs">Parsing resume structure and keyword density...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 text-xs rounded-xl">
              {error}
            </div>
          ) : analysis ? (
            <>
              {/* Score Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-1">
                    Overall ATS Score
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                      {analysis.overallScore}
                    </span>
                    <span className="text-sm font-semibold text-slate-400">/ 100</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white ml-2">
                      Grade: {analysis.grade}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                    {analysis.summaryEvaluation}
                  </p>
                </div>
              </div>

              {/* Category Scores */}
              {analysis.categoryScores && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Score Breakdown
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(analysis.categoryScores).map(([cat, val]) => (
                      <div key={cat} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                        <div className="flex justify-between text-xs mb-1.5 font-medium">
                          <span className="text-slate-600 dark:text-slate-400">{cat}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{val}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            style={{ width: `${val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Keywords */}
              {analysis.matchedKeywords && analysis.matchedKeywords.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Detected ATS Keywords ({analysis.matchedKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matchedKeywords.map((kw, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded text-xs font-medium border border-emerald-200 dark:border-emerald-800">
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Keywords */}
              {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Missing High-Value Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded text-xs font-medium border border-amber-200 dark:border-amber-800">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Suggestions */}
              {analysis.improvementSuggestions && analysis.improvementSuggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-indigo-500" /> Priority Improvements
                  </h4>
                  <div className="space-y-2">
                    {analysis.improvementSuggestions.map((sug, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-400 text-center pt-2">
                Engine: {analysis.source}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

