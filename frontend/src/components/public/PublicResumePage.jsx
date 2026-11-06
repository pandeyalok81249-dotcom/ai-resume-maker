import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Mail,
  Copy,
  Check,
  Globe,
  Loader2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Printer
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { resumeApi } from '../../api/resumeApi';
import TemplateRenderer from '../templates/TemplateRenderer';

export default function PublicResumePage({ resumeId, onGoHome }) {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const printRef = useRef(null);

  useEffect(() => {
    if (resumeId) {
      loadPublicResume(resumeId);
    }
  }, [resumeId]);

  const loadPublicResume = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await resumeApi.getPublicResume(id);
      setResume(data);
    } catch (err) {
      setError(err.message || 'This resume is private or no longer available.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current || !resume) return;
    try {
      setDownloading(true);
      const element = printRef.current;
      const opt = {
        margin: [5, 5, 5, 5],
        filename: `${(resume.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      alert('Failed to generate PDF. You can also press Ctrl+P to print.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm text-slate-500 font-medium">Loading candidate portfolio...</p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Resume Not Accessible
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
          {error || 'This resume is currently set to private or does not exist.'}
        </p>
        <button
          type="button"
          onClick={onGoHome}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to ResumeAI Home
        </button>
      </div>
    );
  }

  const p = resume.personalInfo || {};

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 print:bg-white text-slate-900 dark:text-slate-100">
      {/* Recruiter Action Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 shadow-xs print:hidden">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Candidate Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoHome}
              title="Home"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {p.fullName || 'Candidate Portfolio'}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Verified Candidate
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {p.jobTitle || resume.targetRole || 'Professional'} {p.location ? `• ${p.location}` : ''}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {p.email && (
              <a
                href={`mailto:${p.email}?subject=Exciting Career Opportunity`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition"
              >
                <Mail className="w-3.5 h-3.5" />
                Contact Candidate
              </a>
            )}

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition disabled:opacity-50"
            >
              {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              Download PDF
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 font-semibold text-xs text-slate-700 dark:text-slate-300 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy public link"
              className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-8 px-4 flex justify-center print:p-0">
        <div
          ref={printRef}
          className="w-full max-w-[850px] bg-white text-slate-900 shadow-xl rounded-xl print:shadow-none print:rounded-none overflow-hidden"
          style={{ minHeight: '297mm' }}
        >
          <TemplateRenderer
            templateKey={resume.templateKey || 'modern-professional'}
            resume={resume}
            themeColor={resume.themeColor || '#4F46E5'}
            fontFamily={resume.fontFamily || 'Inter'}
            fontSize={resume.fontSize || 'medium'}
            lineSpacing={resume.lineSpacing || 'normal'}
          />
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 print:hidden">
        <div className="flex items-center justify-center gap-1.5">
          <span>Powered by</span>
          <button
            onClick={onGoHome}
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            ResumeAI
          </button>
          <span>— Build Your Free ATS Resume in Minutes</span>
        </div>
      </footer>
    </div>
  );
}

