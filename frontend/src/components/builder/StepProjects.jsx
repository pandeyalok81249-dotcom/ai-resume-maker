import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, FolderGit2, ExternalLink } from 'lucide-react';

export default function StepProjects({ projects = [], onChange }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const addProject = () => {
    const newProj = {
      title: '',
      description: '',
      technologies: '',
      projectUrl: '',
      githubUrl: '',
      bulletPoints: '',
      sortOrder: projects.length,
    };
    onChange([...projects, newProj]);
    setExpandedIndex(projects.length);
  };

  const removeProject = (index) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index, field, value) => {
    const updated = projects.map((p, i) => {
      if (i === index) {
        return { ...p, [field]: value };
      }
      return p;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Projects & Technical Systems
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showcase key applications, system designs, or open-source contributions.
          </p>
        </div>

        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <FolderGit2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            No projects added yet.
          </p>
          <button
            type="button"
            onClick={addProject}
            className="mt-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 transition"
          >
            + Add First Project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((proj, idx) => {
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
                        {proj.title || 'Untitled Project'}
                      </span>
                      {proj.technologies && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">
                          ({proj.technologies})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProject(idx);
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
                          Project Title *
                        </label>
                        <input
                          type="text"
                          value={proj.title || ''}
                          onChange={(e) => updateProject(idx, 'title', e.target.value)}
                          placeholder="e.g. Distributed E-Commerce Backend"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Technologies Used
                        </label>
                        <input
                          type="text"
                          value={proj.technologies || ''}
                          onChange={(e) => updateProject(idx, 'technologies', e.target.value)}
                          placeholder="React, Spring Boot, PostgreSQL, Redis"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Live Demo URL
                        </label>
                        <input
                          type="url"
                          value={proj.projectUrl || ''}
                          onChange={(e) => updateProject(idx, 'projectUrl', e.target.value)}
                          placeholder="https://myproject.app"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          GitHub / Source URL
                        </label>
                        <input
                          type="url"
                          value={proj.githubUrl || ''}
                          onChange={(e) => updateProject(idx, 'githubUrl', e.target.value)}
                          placeholder="https://github.com/alex/myproject"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Brief Description
                      </label>
                      <input
                        type="text"
                        value={proj.description || ''}
                        onChange={(e) => updateProject(idx, 'description', e.target.value)}
                        placeholder="Architected real-time transactional platform capable of 5,000 req/sec"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Key Achievements & Features (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={proj.bulletPoints || ''}
                        onChange={(e) => updateProject(idx, 'bulletPoints', e.target.value)}
                        placeholder="• Implemented JWT authentication and role-based access control&#10;• Configured automated GitHub Actions CI/CD pipeline"
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
    </div>
  );
}

