import React, { useState } from 'react';
import { Sparkles, Loader2, Check, X, Plus } from 'lucide-react';
import { aiApi } from '../../api/aiApi';

export default function AiBulletModal({ isOpen, onClose, onApply, role, company }) {
  const [rawInput, setRawInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [bullets, setBullets] = useState([]);
  const [selectedBullets, setSelectedBullets] = useState([]);
  const [source, setSource] = useState('');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await aiApi.generateBullets({
        role,
        company,
        rawInput,
      });
      setBullets(res.bulletPoints || []);
      setSelectedBullets(res.bulletPoints || []);
      setSource(res.source || '');
    } catch (err) {
      setError(err.message || 'Failed to generate bullet points');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (bullet) => {
    setSelectedBullets(prev =>
      prev.includes(bullet) ? prev.filter(b => b !== bullet) : [...prev, bullet]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                AI Bullet Point Generator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transform duties into measurable achievements with strong action verbs.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg">
            Role: <span className="font-semibold text-slate-800 dark:text-slate-200">{role || 'Position'}</span> at <span className="font-semibold text-slate-800 dark:text-slate-200">{company || 'Company'}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Describe your task, project, or responsibility:
            </label>
            <textarea
              rows={3}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="e.g. helped build a new customer checkout flow and reduced loading times"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Bullet Points
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-lg">
              {error}
            </div>
          )}

          {bullets.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Bullet Points to Add:
                </span>
                <span className="text-[10px] text-slate-400">{source}</span>
              </div>

              <div className="space-y-2">
                {bullets.map((b, idx) => {
                  const isChecked = selectedBullets.includes(b);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleSelect(b)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition flex items-start gap-3 ${
                        isChecked
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="leading-relaxed">• {b}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  disabled={selectedBullets.length === 0}
                  onClick={() => {
                    onApply(selectedBullets);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Insert Selected ({selectedBullets.length})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

