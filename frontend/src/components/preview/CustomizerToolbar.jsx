import React, { useState } from 'react';
import {
  Palette,
  Type,
  Layout,
  Eye,
  Sparkles,
  Download,
  Printer,
  ShieldCheck,
  Target,
  Mail,
  Share2,
  Copy,
  Zap,
  HelpCircle,
  DollarSign,
  FileCode
} from 'lucide-react';

export default function CustomizerToolbar({
  templateKey,
  onTemplateChange,
  themeColor,
  onColorChange,
  fontFamily,
  onFontChange,
  fontSize,
  onFontSizeChange,
  lineSpacing,
  onLineSpacingChange,
  onOpenTemplateGallery,
  onOpenSectionVisibility,
  onOpenAtsDrawer,
  onOpenJobMatch,
  onOpenCoverLetter,
  onOpenLinkedIn,
  onOpenInterviewPrep,
  onOpenTailor,
  onOpenSalaryInsights,
  onOpenExportImport,
  onOpenShare,
  onDownloadPdf,
  onPrint,
  isDownloading,
  atsScore = 75,
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    { name: 'Indigo', hex: '#4F46E5' },
    { name: 'Purple', hex: '#7C3AED' },
    { name: 'Cyan', hex: '#06B6D4' },
    { name: 'Emerald', hex: '#10B981' },
    { name: 'Slate', hex: '#0F172A' },
    { name: 'Rose', hex: '#E11D48' },
    { name: 'Amber', hex: '#D97706' },
    { name: 'Classic Blue', hex: '#2563EB' },
  ];

  const templates = [
    { key: 'modern-professional', name: 'Modern Professional', ats: true },
    { key: 'classic-corporate', name: 'Classic Corporate', ats: true },
    { key: 'minimalist', name: 'Minimalist', ats: true },
    { key: 'software-developer', name: 'Software Developer', ats: true },
    { key: 'fresher', name: 'Fresher Resume', ats: true },
    { key: 'creative', name: 'Creative Resume', ats: false },
    { key: 'executive', name: 'Executive Resume', ats: true },
    { key: 'academic', name: 'Academic Resume', ats: true },
  ];

  const fonts = [
    { id: 'Inter', name: 'Inter (Clean Sans)' },
    { id: 'Roboto', name: 'Roboto (Modern)' },
    { id: 'Poppins', name: 'Poppins (Friendly)' },
    { id: 'Merriweather', name: 'Merriweather (Classic Serif)' },
    { id: 'Fira Code', name: 'Fira Code (Monospace)' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      {/* Left controls: Template, Font, Color */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Template Selector & Gallery */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl px-2 py-1">
          <Layout className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={templateKey}
            onChange={(e) => onTemplateChange(e.target.value)}
            className="text-xs bg-transparent border-none text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            {templates.map(t => (
              <option key={t.key} value={t.key}>
                {t.name} {t.ats ? '⭐' : ''}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onOpenTemplateGallery}
            className="text-[10px] px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200/60 dark:border-indigo-800/60 transition cursor-pointer flex items-center gap-1"
            title="Open Visual Template Gallery"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>Cards</span>
          </button>
        </div>

        {/* Font Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl px-2 py-1">
          <Type className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={fontFamily}
            onChange={(e) => onFontChange(e.target.value)}
            className="text-xs bg-transparent border-none text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            {fonts.map(f => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Accent Color Swatch */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-medium text-slate-700 dark:text-slate-300 transition"
          >
            <span
              className="w-3.5 h-3.5 rounded-full border border-white dark:border-slate-700 shadow-xs"
              style={{ backgroundColor: themeColor }}
            />
            <span className="hidden sm:inline">Color</span>
          </button>

          {showColorPicker && (
            <div className="absolute left-0 top-full mt-2 z-30 p-2.5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 grid grid-cols-4 gap-2 w-48">
              {colors.map(c => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => {
                    onColorChange(c.hex);
                    setShowColorPicker(false);
                  }}
                  className="w-8 h-8 rounded-full border-2 transition transform hover:scale-110 flex items-center justify-center cursor-pointer"
                  style={{
                    backgroundColor: c.hex,
                    borderColor: themeColor === c.hex ? '#000' : 'transparent'
                  }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Section Visibility */}
        <button
          type="button"
          onClick={onOpenSectionVisibility}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-medium text-slate-700 dark:text-slate-300 transition cursor-pointer"
          title="Toggle Section Visibility"
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden md:inline">Sections</span>
        </button>
      </div>

      {/* Right controls: AI Tools & Export */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* ATS Score Button */}
        <button
          type="button"
          onClick={onOpenAtsDrawer}
          className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold hover:bg-emerald-100 transition shadow-xs cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>ATS: {atsScore}%</span>
        </button>

        {/* 1-Click Tailor */}
        <button
          type="button"
          onClick={onOpenTailor}
          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-semibold transition cursor-pointer"
          title="1-Click AI Tailor for Job Description"
        >
          <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
          <span>Tailor</span>
        </button>

        {/* Interview Prep */}
        <button
          type="button"
          onClick={onOpenInterviewPrep}
          className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 rounded-xl text-xs font-semibold transition cursor-pointer"
          title="AI Interview Questions & Answer Coach"
        >
          <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
          <span>Interview Prep</span>
        </button>

        {/* Salary Insights */}
        <button
          type="button"
          onClick={onOpenSalaryInsights}
          className="hidden xl:flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs font-semibold transition cursor-pointer"
          title="AI Salary & Career Market Insights"
        >
          <DollarSign className="w-3.5 h-3.5 text-amber-600" />
          <span>Salary</span>
        </button>

        {/* Export / Import */}
        <button
          type="button"
          onClick={onOpenExportImport}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 transition cursor-pointer"
          title="Multi-format Export & Import (JSON, TXT, MD)"
        >
          <FileCode className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline">Export / Import</span>
        </button>

        {/* Share Public Link */}
        <button
          type="button"
          onClick={onOpenShare}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 transition cursor-pointer"
          title="Share Public Web Portfolio"
        >
          <Share2 className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Print */}
        <button
          type="button"
          onClick={onPrint}
          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition cursor-pointer"
          title="Print Resume"
        >
          <Printer className="w-4 h-4" />
        </button>

        {/* Download PDF */}
        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={isDownloading}
          className="flex items-center gap-1.5 px-3 py-1 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-xs rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isDownloading ? 'Exporting...' : 'PDF'}</span>
        </button>
      </div>
    </div>
  );
}
