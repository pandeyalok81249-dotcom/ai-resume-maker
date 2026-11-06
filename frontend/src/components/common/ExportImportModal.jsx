import React, { useState } from 'react';
import {
  X,
  FileCode,
  FileText,
  Download,
  Copy,
  Check,
  Upload,
  ArrowUpRight,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  exportToJsonResume,
  parseJsonResume,
  exportToPlainText,
  exportToMarkdown,
  downloadFile
} from '../../utils/resumeExportImport';

export default function ExportImportModal({ isOpen, onClose, resume, onImportResume }) {
  const [activeTab, setActiveTab] = useState('text'); // 'text', 'json-export', 'json-import', 'markdown'
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState(null);

  if (!isOpen || !resume) return null;

  const plainText = exportToPlainText(resume);
  const jsonResumeObj = exportToJsonResume(resume);
  const jsonResumeStr = JSON.stringify(jsonResumeObj, null, 2);
  const markdownText = exportToMarkdown(resume);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const filename = `${(resume.title || 'Resume').replace(/\s+/g, '_')}_ATS_Plain.txt`;
    downloadFile(plainText, filename, 'text/plain');
  };

  const handleDownloadJson = () => {
    const filename = `${(resume.title || 'Resume').replace(/\s+/g, '_')}_JSONResume.json`;
    downloadFile(jsonResumeStr, filename, 'application/json');
  };

  const handleDownloadMd = () => {
    const filename = `${(resume.title || 'Resume').replace(/\s+/g, '_')}.md`;
    downloadFile(markdownText, filename, 'text/markdown');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImportJsonText(event.target?.result || '');
      setImportError(null);
    };
    reader.readAsText(file);
  };

  const handleApplyImport = () => {
    try {
      setImportError(null);
      if (!importJsonText.trim()) {
        setImportError("Please paste or upload JSON content first.");
        return;
      }
      const parsed = parseJsonResume(importJsonText);
      if (onImportResume) {
        onImportResume(parsed);
      }
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch (e) {}
      onClose();
    } catch (err) {
      setImportError(err.message || "Failed to parse JSON file.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Multi-Format Resume Export & JSON Import
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Download or copy ATS Plain Text, industry-standard JSON Resume, or Markdown.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap gap-2 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`text-xs px-3.5 py-2 font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'text'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            ATS Plain Text (.txt)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('json-export')}
            className={`text-xs px-3.5 py-2 font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'json-export'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            JSON Resume Standard
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('json-import')}
            className={`text-xs px-3.5 py-2 font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'json-import'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Import JSON Resume
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('markdown')}
            className={`text-xs px-3.5 py-2 font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'markdown'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Markdown (.md)
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: ATS PLAIN TEXT */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 flex items-start justify-between gap-3 text-xs text-blue-900 dark:text-blue-300">
                <div className="space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Ideal for Workday, Taleo, Greenhouse, and Lever Job Portals
                  </div>
                  <p className="text-blue-800 dark:text-blue-300/80">
                    Job application portals often have a "Paste your resume" text box. This clean ASCII text guarantees zero corrupted characters or broken styling tables.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(plainText)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy All Text'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 hover:bg-slate-100 font-semibold transition text-slate-700 dark:text-slate-300"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .txt
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                rows={16}
                value={plainText}
                className="w-full text-xs font-mono p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 focus:outline-none select-all"
              />
            </div>
          )}

          {/* TAB 2: JSON RESUME EXPORT */}
          {activeTab === 'json-export' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 flex items-start justify-between gap-3 text-xs text-indigo-900 dark:text-indigo-300">
                <div className="space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    Industry Standard JSON Resume Schema
                  </div>
                  <p className="text-indigo-800 dark:text-indigo-300/80">
                    Export your complete resume in open-source JSON Resume format for total data ownership, developer portfolios, and automated ingestion.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(jsonResumeStr)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy JSON'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 hover:bg-slate-100 font-semibold transition text-slate-700 dark:text-slate-300"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .json
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                rows={16}
                value={jsonResumeStr}
                className="w-full text-xs font-mono p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 focus:outline-none select-all"
              />
            </div>
          )}

          {/* TAB 3: JSON RESUME IMPORT */}
          {activeTab === 'json-import' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-300">
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-amber-600" />
                  Import from JSON File or Paste Schema
                </div>
                <p className="text-amber-800 dark:text-amber-300/80 mb-3">
                  Upload a standard JSON Resume file or paste valid JSON. This will populate your resume fields immediately.
                </p>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer"
                />
              </div>

              {importError && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-rose-700 dark:text-rose-400 font-medium">
                  {importError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Or Paste JSON Resume Text Below:
                </label>
                <textarea
                  rows={10}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste JSON Resume syntax here..."
                  className="w-full text-xs font-mono p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleApplyImport}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Apply & Populate Resume
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: MARKDOWN */}
          {activeTab === 'markdown' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-start justify-between gap-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                    GitHub-Flavored Markdown
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    Perfect for README.md profiles, developer websites, or personal note archives in Obsidian / Notion.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(markdownText)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Markdown'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadMd}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 font-semibold transition text-slate-700 dark:text-slate-300"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .md
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                rows={16}
                value={markdownText}
                className="w-full text-xs font-mono p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 focus:outline-none select-all"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <span className="text-[11px] text-slate-500">
            Open-format interoperability with 0 data lock-in.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-4 py-1.5 rounded-lg font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

