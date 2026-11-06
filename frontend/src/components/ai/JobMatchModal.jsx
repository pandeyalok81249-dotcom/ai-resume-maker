import React, { useState } from 'react';
import { Target, Loader2, CheckCircle, AlertCircle, X, Sparkles, Copy, Check } from 'lucide-react';
import { aiApi } from '../../api/aiApi';

export default function JobMatchModal({ isOpen, onClose, resume }) {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleMatch = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await aiApi.matchJob({
        resumeId: resume.id,
        jobTitle,
        company,
        jobDescription,
        resumeData: resume,
      });
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to match job description');
    } finally {
      setLoading(false);
    }
  };

  const copySummary = () => {
    if (result?.tailoredSummaryRecommendation) {
      navigator.clipboard.writeText(result.tailoredSummaryRecommendation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                Job Description Matcher & Keyword Gap Analysis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste any job posting to see how well your resume matches and what keywords to add.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company Name (Optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google, Stripe"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role Title (Optional)
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Paste Job Description:
            </label>
            <textarea
              rows={5}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste full job posting requirements and responsibilities here..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleMatch}
              disabled={loading || !jobDescription.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium text-xs rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Match...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Compare Resume Against Job
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 text-xs rounded-lg">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
              {/* Score header */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Job Match Compatibility
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {result.matchScore}%
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                      {result.matchVerdict}
                    </span>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  {result.source}
                </div>
              </div>

              {/* Matched vs Missing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Matched Skills ({result.matchedSkills?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {result.matchedSkills?.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 rounded text-[11px] font-medium border border-emerald-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Missing Keywords ({result.missingSkills?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {result.missingSkills?.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 rounded text-[11px] font-medium border border-amber-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tailored Summary */}
              {result.tailoredSummaryRecommendation && (
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                      Recommended Summary For This Position
                    </span>
                    <button
                      onClick={copySummary}
                      className="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {result.tailoredSummaryRecommendation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

