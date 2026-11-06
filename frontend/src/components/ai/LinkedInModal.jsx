import React, { useState } from 'react';
import { Share2, Loader2, Copy, Check, X, Sparkles } from 'lucide-react';
import { aiApi } from '../../api/aiApi';

export default function LinkedInModal({ isOpen, onClose, resume }) {
  const [role, setRole] = useState(resume?.targetRole || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const skills = (resume?.skills || []).map(s => s.name);
      const res = await aiApi.generateLinkedInSummary({
        currentRole: role || resume?.personalInfo?.jobTitle || 'Software Engineer',
        topSkills: skills,
      });
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to generate LinkedIn profile copy');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0077B5] flex items-center justify-center text-white shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                LinkedIn Profile & About Generator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate an engaging headline, bio, and keywords for LinkedIn.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current / Target Role:
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0077B5] hover:bg-[#005f93] text-white font-medium text-xs rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate LinkedIn Bio
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
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    LinkedIn Headline:
                  </span>
                  <button
                    onClick={() => handleCopy(result.headline)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  {result.headline}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    About Section:
                  </span>
                  <button
                    onClick={() => handleCopy(result.aboutSection)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={result.aboutSection}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-sans leading-relaxed"
                />
              </div>

              {result.hashtags && (
                <div className="flex flex-wrap gap-1">
                  {result.hashtags.map((tag, idx) => (
                    <span key={idx} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

