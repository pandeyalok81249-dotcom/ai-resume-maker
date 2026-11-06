import React, { useState } from 'react';
import { Sparkles, Loader2, Check, X, ArrowRight, Wand2 } from 'lucide-react';
import { aiApi } from '../../api/aiApi';

export default function AiImproverModal({ isOpen, onClose, onApply, initialContent = '', context = 'Content' }) {
  const [content, setContent] = useState(initialContent);
  const [targetGoal, setTargetGoal] = useState('Action Verbs & Impact');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleImprove = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await aiApi.improveContent({
        content,
        targetGoal,
        context,
      });
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to improve content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                AI Content Improver & Polisher
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enhance grammar, tone, action verbs, and clarity without fabricating facts.
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
              Improvement Goal:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Action Verbs & Impact', 'Grammar & Polish', 'Executive Tone', 'Concise & Direct'].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setTargetGoal(goal)}
                  className={`text-xs px-3 py-2 rounded-lg border font-medium transition text-left ${
                    targetGoal === goal
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Text to Enhance:
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or type content here..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleImprove}
              disabled={loading || !content.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium text-xs rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Polishing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Improve Content
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-lg">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Enhanced Version:
                </span>
                <span className="text-[10px] text-slate-400">{result.source}</span>
              </div>

              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl">
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {result.improvedContent}
                </p>

                {result.improvementsMade && result.improvementsMade.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-emerald-200/50 dark:border-emerald-800/30 text-[11px] text-emerald-700 dark:text-emerald-300 space-y-0.5">
                    {result.improvementsMade.map((m, idx) => (
                      <div key={idx}>✓ {m}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onApply(result.improvedContent);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-sm transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  Replace with Improved
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

