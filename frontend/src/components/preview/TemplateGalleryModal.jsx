import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout,
  Check,
  X,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Briefcase,
  Code,
  GraduationCap,
  Award
} from 'lucide-react';

export default function TemplateGalleryModal({
  isOpen,
  onClose,
  currentTemplate,
  onSelectTemplate,
  themeColor = '#4F46E5',
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates = [
    {
      key: 'modern-professional',
      name: 'Modern Professional',
      category: 'general',
      categoryLabel: 'All Roles',
      ats: true,
      atsScore: '98%',
      description: 'Clean top header banner with dual-column layout. High ATS pass rate, best for all corporate & engineering roles.',
      features: ['Dual Column', 'Skills Pills', 'Summary Banner'],
    },
    {
      key: 'software-developer',
      name: 'Software Developer',
      category: 'tech',
      categoryLabel: 'Tech & Engineering',
      ats: true,
      atsScore: '99%',
      description: 'Tech stack tags, GitHub and LeetCode highlight blocks, bullet-point performance metrics for engineers.',
      features: ['Tech Stack Badges', 'GitHub/Live Links', 'Project Highlights'],
    },
    {
      key: 'classic-corporate',
      name: 'Classic Corporate',
      category: 'corporate',
      categoryLabel: 'Finance & Law',
      ats: true,
      atsScore: '99%',
      description: 'Traditional single-column serif format preferred by Wall Street, Fortune 100, consulting and legal firms.',
      features: ['Single Column', 'Serif Typography', 'Strict Chronological'],
    },
    {
      key: 'executive',
      name: 'Executive Resume',
      category: 'corporate',
      categoryLabel: 'Executive & Director',
      ats: true,
      atsScore: '97%',
      description: 'Distinguished styling with executive core competencies matrix and high-level leadership summaries.',
      features: ['Leadership Matrix', 'Board Appointments', 'Key Metrics Bar'],
    },
    {
      key: 'fresher',
      name: 'Fresher Resume',
      category: 'entry',
      categoryLabel: 'Students & Grads',
      ats: true,
      atsScore: '97%',
      description: 'Prioritizes education, GPA, capstone coursework, internships, and extracurricular achievements.',
      features: ['Education First', 'Coursework Grid', 'Extracurriculars'],
    },
    {
      key: 'minimalist',
      name: 'Minimalist',
      category: 'general',
      categoryLabel: 'Minimal',
      ats: true,
      atsScore: '96%',
      description: 'Ultra clean typography with generous whitespace and understated elegance. Zero visual clutter.',
      features: ['Monochrome Base', 'High Contrast', 'Airy Margins'],
    },
    {
      key: 'creative',
      name: 'Creative Resume',
      category: 'creative',
      categoryLabel: 'Design & Media',
      ats: false,
      atsScore: '92%',
      description: 'Vibrant modern left sidebar palette with portfolio showcases, design tools proficiency, and social badges.',
      features: ['Left Dark Sidebar', 'Portfolio Icons', 'Visual Skill Bars'],
    },
    {
      key: 'academic',
      name: 'Academic CV',
      category: 'academic',
      categoryLabel: 'Research & Faculty',
      ats: true,
      atsScore: '98%',
      description: 'Formal multi-page curriculum vitae structure with publications, conference presentations, and research grants.',
      features: ['Publications List', 'Grant Awards', 'Teaching Experience'],
    },
  ];

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'tech', label: 'Tech & Engineering' },
    { id: 'corporate', label: 'Corporate & Finance' },
    { id: 'entry', label: 'Entry Level & Students' },
    { id: 'creative', label: 'Creative & Media' },
    { id: 'academic', label: 'Academic & Research' },
  ];

  const filtered = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Layout className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  Template Gallery
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    8 ATS-Tested Layouts
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Switching templates instantly re-renders your entire resume with zero data loss.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar bg-white dark:bg-slate-900">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((tpl) => {
              const isSelected = currentTemplate === tpl.key;

              return (
                <motion.div
                  key={tpl.key}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => {
                    onSelectTemplate(tpl.key);
                    onClose();
                  }}
                  className={`rounded-2xl border-2 transition-all p-4 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-lg shadow-indigo-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-white dark:bg-slate-800/80'
                  }`}
                >
                  {/* Selected check badge */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div>
                    {/* Simulated Mini-Paper Preview */}
                    <div className="w-full h-36 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 p-3 mb-3 relative overflow-hidden group-hover:shadow-md transition">
                      {/* Top colored header or line based on template */}
                      {tpl.key === 'modern-professional' && (
                        <div className="space-y-1.5">
                          <div className="h-3 w-3/4 rounded-sm" style={{ backgroundColor: themeColor }} />
                          <div className="h-1 w-1/2 bg-slate-300 dark:bg-slate-700 rounded-sm" />
                          <div className="grid grid-cols-3 gap-1 pt-2">
                            <div className="col-span-2 space-y-1">
                              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-sm" />
                              <div className="h-1.5 w-5/6 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                              <div className="h-1.5 w-4/6 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                            </div>
                            <div className="col-span-1 space-y-1">
                              <div className="h-1.5 w-full bg-indigo-200 dark:bg-indigo-900/60 rounded-sm" />
                              <div className="h-1.5 w-full bg-indigo-200 dark:bg-indigo-900/60 rounded-sm" />
                            </div>
                          </div>
                        </div>
                      )}

                      {tpl.key === 'software-developer' && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="h-2.5 w-1/2 rounded-sm" style={{ backgroundColor: themeColor }} />
                            <div className="h-1.5 w-1/4 bg-slate-300 dark:bg-slate-700 rounded-sm" />
                          </div>
                          <div className="flex gap-1 pt-1">
                            <span className="h-2 w-8 rounded-xs bg-cyan-200 dark:bg-cyan-900" />
                            <span className="h-2 w-8 rounded-xs bg-indigo-200 dark:bg-indigo-900" />
                            <span className="h-2 w-8 rounded-xs bg-purple-200 dark:bg-purple-900" />
                          </div>
                          <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-700 my-1" />
                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-sm" />
                            <div className="h-1.5 w-4/5 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                          </div>
                        </div>
                      )}

                      {tpl.key === 'classic-corporate' && (
                        <div className="space-y-1.5 text-center flex flex-col items-center">
                          <div className="h-2.5 w-2/3 rounded-sm" style={{ backgroundColor: themeColor }} />
                          <div className="h-1 w-1/2 bg-slate-300 dark:bg-slate-700 rounded-sm" />
                          <div className="h-0.5 w-full bg-slate-300 dark:bg-slate-700 my-1" />
                          <div className="w-full space-y-1 text-left">
                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-sm" />
                            <div className="h-1.5 w-5/6 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                            <div className="h-1.5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                          </div>
                        </div>
                      )}

                      {tpl.key === 'creative' && (
                        <div className="grid grid-cols-3 gap-1.5 h-full">
                          <div className="col-span-1 rounded-sm p-1 flex flex-col justify-between" style={{ backgroundColor: themeColor }}>
                            <div className="w-5 h-5 rounded-full bg-white/40 mx-auto" />
                            <div className="space-y-1">
                              <div className="h-1 w-full bg-white/50 rounded-xs" />
                              <div className="h-1 w-3/4 bg-white/50 rounded-xs" />
                            </div>
                          </div>
                          <div className="col-span-2 space-y-1.5 pt-1">
                            <div className="h-2 w-3/4 bg-slate-400 dark:bg-slate-600 rounded-sm" />
                            <div className="h-1 w-1/2 bg-slate-300 dark:bg-slate-700 rounded-sm" />
                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-sm mt-2" />
                            <div className="h-1.5 w-5/6 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                          </div>
                        </div>
                      )}

                      {tpl.key !== 'modern-professional' && tpl.key !== 'software-developer' && tpl.key !== 'classic-corporate' && tpl.key !== 'creative' && (
                        <div className="space-y-2">
                          <div className="h-2.5 w-3/5 rounded-sm" style={{ backgroundColor: themeColor }} />
                          <div className="h-1 w-2/5 bg-slate-300 dark:bg-slate-700 rounded-sm" />
                          <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-700" />
                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-sm" />
                            <div className="h-1.5 w-4/5 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                            <div className="h-1.5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                          </div>
                        </div>
                      )}

                      {/* Floating overlay chip */}
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/90 dark:bg-slate-800/90 text-[9px] font-bold text-slate-700 dark:text-slate-300 shadow-xs backdrop-blur-xs">
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
                        <span>{tpl.atsScore}</span>
                      </div>
                    </div>

                    {/* Template Name & Category */}
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                        {tpl.name}
                      </h3>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>

                    {/* Feature tags */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {tpl.features.map((feat, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Select button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-750 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {tpl.categoryLabel}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      {isSelected ? 'Active' : 'Apply'}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              All templates follow standard ATS parsing formats and clean typography hierarchies.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

