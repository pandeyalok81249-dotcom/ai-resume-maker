import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';

export default function StepEducation({ educations = [], onChange }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const addEducation = () => {
    const newEdu = {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false,
      gradeOrGpa: '',
      achievements: '',
      sortOrder: educations.length,
    };
    onChange([...educations, newEdu]);
    setExpandedIndex(educations.length);
  };

  const removeEducation = (index) => {
    onChange(educations.filter((_, i) => i !== index));
  };

  const updateEducation = (index, field, value) => {
    const updated = educations.map((edu, i) => {
      if (i === index) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Education
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            List your degrees, universities, GPA/grades, and academic honors.
          </p>
        </div>

        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Education
        </button>
      </div>

      {educations.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <GraduationCap className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            No education entries added yet.
          </p>
          <button
            type="button"
            onClick={addEducation}
            className="mt-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 transition"
          >
            + Add Degree
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {educations.map((edu, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
              >
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
                        {edu.degree || 'Degree'} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                      </span>
                      {edu.institution && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">
                          — {edu.institution}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEducation(idx);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 space-y-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          College / University *
                        </label>
                        <input
                          type="text"
                          value={edu.institution || ''}
                          onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                          placeholder="e.g. Stanford University"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Degree *
                        </label>
                        <input
                          type="text"
                          value={edu.degree || ''}
                          onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                          placeholder="e.g. B.S., M.S., B.Tech"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Field of Study / Department
                        </label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy || ''}
                          onChange={(e) => updateEducation(idx, 'fieldOfStudy', e.target.value)}
                          placeholder="Computer Science"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Start Date / Year
                        </label>
                        <input
                          type="text"
                          value={edu.startDate || ''}
                          onChange={(e) => updateEducation(idx, 'startDate', e.target.value)}
                          placeholder="2018"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Graduation Year
                        </label>
                        <input
                          type="text"
                          disabled={edu.current}
                          value={edu.current ? 'Present' : edu.endDate || ''}
                          onChange={(e) => updateEducation(idx, 'endDate', e.target.value)}
                          placeholder="2022"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        />
                        <label className="flex items-center gap-1 mt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={edu.current || false}
                            onChange={(e) => updateEducation(idx, 'current', e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3"
                          />
                          <span className="text-[11px] text-slate-600 dark:text-slate-400">Currently studying</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          CGPA / Percentage / Grade
                        </label>
                        <input
                          type="text"
                          value={edu.gradeOrGpa || ''}
                          onChange={(e) => updateEducation(idx, 'gradeOrGpa', e.target.value)}
                          placeholder="3.8 / 4.0 or 88%"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Honors & Achievements
                        </label>
                        <input
                          type="text"
                          value={edu.achievements || ''}
                          onChange={(e) => updateEducation(idx, 'achievements', e.target.value)}
                          placeholder="Dean's Honor List, Magna Cum Laude"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

