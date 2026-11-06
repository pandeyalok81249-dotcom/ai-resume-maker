import React, { useState } from 'react';
import { Sparkles, Loader2, Check, RefreshCw, X, Lightbulb } from 'lucide-react';
import { aiApi } from '../../api/aiApi';

export default function AiSummaryModal({ isOpen, onClose, onApply, currentRole, initialSkills = [] }) {
  const [jobTitle, setJobTitle] = useState(currentRole || '');
  const [years, setYears] = useState(3);
  const [tone, setTone] = useState('Professional');
  const [skills, setSkills] = useState(initialSkills.join(', '));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await aiApi.generateSummary({
        jobTitle,
        yearsOfExperience: parseInt(years, 10),
        tone,
        keySkills: skillsArray,
      });
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                AI Summary Generator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate high-impact, ATS-optimized professional summaries in seconds.
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Job Title / Role
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Key Skills (comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Spring Boot, AWS, Docker"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tone & Voice
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Professional">Professional & Balanced</option>
                <option value="Executive">Executive & Strategic</option>
                <option value="Confident">Confident & Action-Oriented</option>
                <option value="Technical">Technical & Architecture-Focused</option>
                <option value="Entry-Level">Fresh Graduate / Entry-Level</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium text-xs rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Summary
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-lg">
              {error}
            </div>
          )}

          {/* AI Result */}
          {result && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  Source: {result.source}
                </span>
                <button
                  onClick={handleGenerate}
                  className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                >
                  <RefreshCw className="w-3 h-3" /> Regenerate
                </button>
              </div>

              {/* Main option */}
              <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 relative group">
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  {result.summary}
                </p>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => {
                      onApply(result.summary);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shadow-sm transition"
                  >
                    <Check className="w-3.5 h-3.5" /> Use This Summary
                  </button>
                </div>
              </div>

              {/* Alternative Options */}
              {result.alternativeOptions && result.alternativeOptions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Alternative Variations
                  </div>
                  {result.alternativeOptions.map((alt, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-3"
                    >
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {alt}
                      </p>
                      <button
                        onClick={() => {
                          onApply(alt);
                          onClose();
                        }}
                        className="flex-shrink-0 text-xs px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-md font-medium transition"
                      >
                        Apply
                      </button>
                    </div>
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

