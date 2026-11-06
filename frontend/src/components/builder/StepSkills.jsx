import React, { useState } from 'react';
import { Plus, X, Sparkles, Tag, Check, Filter, Layers, Award } from 'lucide-react';

export default function StepSkills({ skills = [], onChange, targetRole = 'Software Engineer' }) {
  const [inputVal, setInputVal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TECHNICAL');
  const [selectedProficiency, setSelectedProficiency] = useState('Advanced');
  const [activeRoleCategory, setActiveRoleCategory] = useState('auto');

  // Role-specific skill clusters
  const roleSkillMap = {
    'Full Stack': ['React', 'TypeScript', 'Node.js', 'Next.js', 'Spring Boot', 'PostgreSQL', 'Docker', 'REST APIs', 'GraphQL', 'Tailwind CSS', 'Git', 'CI/CD'],
    'Frontend': ['React', 'TypeScript', 'JavaScript (ES6+)', 'Next.js', 'Tailwind CSS', 'Redux Toolkit', 'HTML5/CSS3', 'Jest', 'Webpack/Vite', 'Responsive Design', 'Web Accessibility (a11y)'],
    'Backend': ['Java', 'Spring Boot', 'Python', 'FastAPI', 'Microservices', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Kubernetes', 'System Design', 'SQL Optimization'],
    'DevOps / Cloud': ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD (GitHub Actions)', 'Linux', 'Prometheus', 'Grafana', 'Ansible', 'Bash Scripting', 'Cloud Security'],
    'Data & AI': ['Python', 'SQL', 'PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-Learn', 'LangChain', 'FastAPI', 'BigQuery', 'Data Modeling', 'LLM Prompt Engineering'],
    'Mobile': ['Flutter', 'Dart', 'React Native', 'Swift', 'Kotlin', 'Firebase', 'State Management', 'REST APIs', 'App Store Deployment', 'UI/UX Mobile Patterns'],
  };

  const getSuggestedSkills = () => {
    if (activeRoleCategory !== 'auto' && roleSkillMap[activeRoleCategory]) {
      return roleSkillMap[activeRoleCategory];
    }
    const lowerRole = (targetRole || '').toLowerCase();
    if (lowerRole.includes('front')) return roleSkillMap['Frontend'];
    if (lowerRole.includes('back')) return roleSkillMap['Backend'];
    if (lowerRole.includes('devops') || lowerRole.includes('cloud')) return roleSkillMap['DevOps / Cloud'];
    if (lowerRole.includes('data') || lowerRole.includes('ai') || lowerRole.includes('machine')) return roleSkillMap['Data & AI'];
    if (lowerRole.includes('mobile') || lowerRole.includes('android') || lowerRole.includes('ios')) return roleSkillMap['Mobile'];
    return roleSkillMap['Full Stack'];
  };

  const addSkill = (name, category = selectedCategory, proficiency = selectedProficiency) => {
    if (!name.trim()) return;
    const exists = skills.some((s) => s.name?.toLowerCase() === name.trim().toLowerCase());
    if (exists) return;

    const newSkill = {
      name: name.trim(),
      category: category,
      proficiency: proficiency,
      sortOrder: skills.length,
    };
    onChange([...skills, newSkill]);
    setInputVal('');
  };

  const addAllSuggested = () => {
    const suggested = getSuggestedSkills();
    const existingNames = new Set(skills.map((s) => s.name?.toLowerCase()));
    const toAdd = suggested
      .filter((s) => !existingNames.has(s.toLowerCase()))
      .map((s, idx) => ({
        name: s,
        category: selectedCategory,
        proficiency: 'Advanced',
        sortOrder: skills.length + idx,
      }));
    if (toAdd.length > 0) {
      onChange([...skills, ...toAdd]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(inputVal);
    }
  };

  const removeSkill = (index) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const updateProficiency = (index, proficiency) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], proficiency };
    onChange(updated);
  };

  const suggestedSkills = getSuggestedSkills();
  const missingSuggestions = suggestedSkills.filter(
    (s) => !skills.some((sk) => sk.name?.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between">
          <span>Skills & Competencies</span>
          <span className="text-[11px] font-normal text-slate-500">
            Target: {targetRole || 'Software Professional'}
          </span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          ATS parsers match skills directly with job descriptions. Aim for 8–15 in-demand skills with specified proficiency.
        </p>
      </div>

      {/* Input Row */}
      <div className="flex flex-wrap gap-2">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="TECHNICAL">Technical</option>
          <option value="SOFT">Soft Skill</option>
          <option value="TOOL">Tool / Platform</option>
          <option value="LANGUAGE">Language</option>
        </select>

        <select
          value={selectedProficiency}
          onChange={(e) => setSelectedProficiency(e.target.value)}
          className="text-xs px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>

        <div className="relative flex-1 min-w-[160px]">
          <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type skill & press Enter (e.g. Next.js, Docker)"
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="button"
          onClick={() => addSkill(inputVal)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {/* Current Skills Chips */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Current Skills ({skills.length}):
          </span>
          {skills.length >= 8 ? (
            <span className="text-[11px] text-emerald-500 font-medium">✓ Optimal ATS skill density</span>
          ) : (
            <span className="text-[11px] text-amber-500 font-medium">
              Tip: Add {Math.max(8 - skills.length, 1)} more skills for maximum ATS match
            </span>
          )}
        </div>

        {skills.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No skills added yet. Use the 1-click recommendations below to populate.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="group inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 rounded-lg text-xs font-medium"
              >
                <span>{skill.name}</span>
                <span className="text-[10px] text-indigo-400 dark:text-indigo-500 font-normal">
                  ({skill.proficiency || 'Advanced'})
                </span>
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="p-0.5 text-indigo-400 hover:text-indigo-900 dark:hover:text-white transition"
                  title="Remove skill"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* AI Role Cluster Recommender */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            AI Recommended Skills for Your Role
          </div>
          {missingSuggestions.length > 0 && (
            <button
              type="button"
              onClick={addAllSuggested}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              + Add All Remaining ({missingSuggestions.length})
            </button>
          )}
        </div>

        {/* Role Cluster Selector */}
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(roleSkillMap).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveRoleCategory(cat)}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition ${
                activeRoleCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5">
          {suggestedSkills.map((suggestion) => {
            const isAdded = skills.some(
              (s) => s.name?.toLowerCase() === suggestion.toLowerCase()
            );
            if (isAdded) return null;
            return (
              <button
                key={suggestion}
                type="button"
                onClick={() => addSkill(suggestion)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 rounded-md text-[11px] font-medium transition border border-transparent hover:border-indigo-300 dark:hover:border-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                + {suggestion}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
