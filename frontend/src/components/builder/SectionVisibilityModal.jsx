import React from 'react';
import { X, Eye, EyeOff, Check } from 'lucide-react';

export default function SectionVisibilityModal({ isOpen, onClose, visibility, onToggle }) {
  if (!isOpen) return null;

  const sections = [
    { key: 'personal', label: 'Personal Information & Contact Bar' },
    { key: 'summary', label: 'Professional Summary / Executive Profile' },
    { key: 'experience', label: 'Work Experience & Employment' },
    { key: 'education', label: 'Education & Academics' },
    { key: 'skills', label: 'Core Skills & Competencies' },
    { key: 'projects', label: 'Projects & Key Technical Systems' },
    { key: 'certifications', label: 'Certifications & Awards' },
    { key: 'additional', label: 'Additional Sections (Languages, Volunteer, Interests)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              Manage Resume Sections
            </h3>
            <p className="text-[11px] text-slate-400">
              Toggle visibility of sections on your exported resume
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-2">
          {sections.map(({ key, label }) => {
            const isVisible = visibility[key] !== false;
            return (
              <div
                key={key}
                onClick={() => onToggle(key)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition text-xs ${
                  isVisible
                    ? 'border-indigo-200 bg-indigo-50/40 dark:bg-indigo-950/20 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-400'
                }`}
              >
                <span className="font-medium">{label}</span>
                <div className={`p-1.5 rounded-lg ${isVisible ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                  {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl shadow-sm transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

