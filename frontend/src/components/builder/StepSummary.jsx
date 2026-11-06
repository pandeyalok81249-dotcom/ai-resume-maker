import React, { useState } from 'react';
import { Sparkles, Wand2, Lightbulb } from 'lucide-react';
import AiSummaryModal from '../ai/AiSummaryModal';
import AiImproverModal from '../ai/AiImproverModal';

export default function StepSummary({ summary = '', onChange, currentRole, skills = [] }) {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showImproveModal, setShowImproveModal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Professional Summary
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A compelling 3-4 sentence narrative that hooks hiring managers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-medium rounded-xl shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Generate
          </button>

          {summary && summary.trim().length > 10 && (
            <button
              type="button"
              onClick={() => setShowImproveModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 text-xs font-medium rounded-xl transition"
            >
              <Wand2 className="w-3.5 h-3.5" />
              AI Improve
            </button>
          )}
        </div>
      </div>

      <div>
        <textarea
          rows={6}
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Results-driven Senior Software Engineer with 6+ years of expertise building scalable distributed systems with Java, Spring Boot, and React. Passionate about system performance, developer productivity, and delivering clean, maintainable microservices..."
          className="w-full text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
        />

        <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
          <span>{summary.length} characters</span>
          <span className={summary.length >= 80 ? 'text-emerald-500 font-medium' : 'text-amber-500'}>
            {summary.length >= 80 ? '✓ Optimal ATS summary length' : 'Tip: Aim for 80–250 characters for peak ATS score'}
          </span>
        </div>
      </div>

      <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
        <Lightbulb className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>ATS Pro-Tip:</strong> Incorporate your years of experience, core technical stack, and 1-2 major achievements in your summary to rank in the top 5% of candidate screens.
        </p>
      </div>

      {/* AI Modals */}
      <AiSummaryModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onApply={(text) => onChange(text)}
        currentRole={currentRole}
        initialSkills={skills.map(s => s.name)}
      />

      <AiImproverModal
        isOpen={showImproveModal}
        onClose={() => setShowImproveModal(false)}
        onApply={(text) => onChange(text)}
        initialContent={summary}
        context="Professional Summary"
      />
    </div>
  );
}

