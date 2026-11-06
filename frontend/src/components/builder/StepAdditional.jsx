import React from 'react';
import { Plus, Trash2, Globe, HeartHandshake, BookOpen, Smile } from 'lucide-react';

export default function StepAdditional({ additionalSections = [], onChange }) {
  const addSection = (key, defaultTitle) => {
    const newSec = {
      sectionKey: key,
      title: defaultTitle,
      content: '',
      isEnabled: true,
      sortOrder: additionalSections.length,
    };
    onChange([...additionalSections, newSec]);
  };

  const removeSection = (index) => {
    onChange(additionalSections.filter((_, i) => i !== index));
  };

  const updateSection = (index, field, value) => {
    const updated = additionalSections.map((sec, i) => {
      if (i === index) {
        return { ...sec, [field]: value };
      }
      return sec;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Additional Sections
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enrich your resume with languages, volunteer work, publications, or hobbies.
        </p>
      </div>

      {/* Quick Add Presets */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => addSection('languages', 'Languages')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 transition"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-500" /> + Add Languages
        </button>
        <button
          type="button"
          onClick={() => addSection('volunteer', 'Volunteer Experience')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 transition"
        >
          <HeartHandshake className="w-3.5 h-3.5 text-rose-500" /> + Add Volunteer Work
        </button>
        <button
          type="button"
          onClick={() => addSection('publications', 'Publications & Papers')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 transition"
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-500" /> + Add Publications
        </button>
        <button
          type="button"
          onClick={() => addSection('interests', 'Interests & Passions')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 transition"
        >
          <Smile className="w-3.5 h-3.5 text-amber-500" /> + Add Interests
        </button>
      </div>

      {/* Sections list */}
      <div className="space-y-3 pt-2">
        {additionalSections.map((sec, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={sec.title}
                onChange={(e) => updateSection(idx, 'title', e.target.value)}
                className="font-semibold text-xs text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none px-1 py-0.5"
              />
              <button
                type="button"
                onClick={() => removeSection(idx)}
                className="p-1 text-slate-400 hover:text-red-500 rounded transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <textarea
              rows={3}
              value={sec.content || ''}
              onChange={(e) => updateSection(idx, 'content', e.target.value)}
              placeholder="e.g. English (Native), Spanish (Fluent), German (Conversational)..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

