import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Building, Briefcase, Calendar, MapPin } from 'lucide-react';
import AiBulletModal from '../ai/AiBulletModal';

export default function StepExperience({ experiences = [], onChange }) {
  const [activeBulletIndex, setActiveBulletIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(0);

  const addExperience = () => {
    const newExp = {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      bulletPoints: '',
      sortOrder: experiences.length,
    };
    onChange([...experiences, newExp]);
    setExpandedIndex(experiences.length);
  };

  const removeExperience = (index) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    const updated = experiences.map((exp, i) => {
      if (i === index) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onChange(updated);
  };

  const handleApplyBullets = (index, newBullets) => {
    const exp = experiences[index];
    const existing = exp.bulletPoints ? exp.bulletPoints.trim() + '\n' : '';
    const combined = existing + newBullets.map(b => `• ${b}`).join('\n');
    updateExperience(index, 'bulletPoints', combined);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Work Experience
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Detail your professional roles, key responsibilities, and quantified achievements.
          </p>
        </div>

        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Position
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <Briefcase className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            No work experience added yet.
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Students or freshers can include internships, part-time roles, or campus leadership.
          </p>
          <button
            type="button"
            onClick={addExperience}
            className="mt-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 transition"
          >
            + Add First Experience
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
              >
                {/* Header bar */}
                <div
                  className="flex items-center justify-between p-3.5 bg-slate-50/70 dark:bg-slate-800/40 cursor-pointer select-none"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-xs text-slate-900 dark:text-white">
                        {exp.position || 'Untitled Position'}
                      </span>
                      {exp.company && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">
                          at {exp.company}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExperience(idx);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Form fields */}
                {isExpanded && (
                  <div className="p-4 space-y-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Job Title / Position *
                        </label>
                        <input
                          type="text"
                          value={exp.position || ''}
                          onChange={(e) => updateExperience(idx, 'position', e.target.value)}
                          placeholder="e.g. Lead Frontend Developer"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Company / Organization *
                        </label>
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                          placeholder="e.g. Stripe, Netflix, Startup Inc."
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                          placeholder="San Francisco / Remote"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={exp.startDate || ''}
                          onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                          placeholder="e.g. Jun 2021"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          End Date
                        </label>
                        <input
                          type="text"
                          disabled={exp.current}
                          value={exp.current ? 'Present' : exp.endDate || ''}
                          onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                          placeholder="e.g. Aug 2023"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        />
                        <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exp.current || false}
                            onChange={(e) => updateExperience(idx, 'current', e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          />
                          <span className="text-[11px] text-slate-600 dark:text-slate-400">Currently working here</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                          Bullet Points & Achievements (One per line)
                        </label>
                        <button
                          type="button"
                          onClick={() => setActiveBulletIndex(idx)}
                          className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                        >
                          <Sparkles className="w-3 h-3" />
                          AI Generate Bullets
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        value={exp.bulletPoints || ''}
                        onChange={(e) => updateExperience(idx, 'bulletPoints', e.target.value)}
                        placeholder="• Spearheaded frontend migration to React 18, cutting bundle size by 32%&#10;• Mentored 4 junior engineers on clean architecture best practices&#10;• Built automated testing pipeline reaching 92% coverage"
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* AI Bullet Modal */}
      {activeBulletIndex !== null && (
        <AiBulletModal
          isOpen={true}
          onClose={() => setActiveBulletIndex(null)}
          onApply={(newBullets) => handleApplyBullets(activeBulletIndex, newBullets)}
          role={experiences[activeBulletIndex]?.position}
          company={experiences[activeBulletIndex]?.company}
        />
      )}
    </div>
  );
}

