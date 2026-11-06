import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Globe,
  ExternalLink,
  Shield,
  Linkedin,
  Mail,
  Twitter,
  Loader2
} from 'lucide-react';
import { resumeApi } from '../../api/resumeApi';

export default function ShareModal({ isOpen, onClose, resume, onTogglePublic }) {
  const [isPublic, setIsPublic] = useState(Boolean(resume?.isPublic));
  const [copied, setCopied] = useState(false);
  const [toggling, setToggling] = useState(false);

  if (!isOpen || !resume) return null;

  const shareUrl = `${window.location.origin}/?share=${resume.id}`;

  const handleToggle = async () => {
    try {
      setToggling(true);
      const updated = await resumeApi.togglePublic(resume.id);
      setIsPublic(Boolean(updated.isPublic));
      if (onTogglePublic) {
        onTogglePublic(updated);
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle public status');
    } finally {
      setToggling(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPortfolio = () => {
    window.open(shareUrl, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    const title = encodeURIComponent(`${resume.personalInfo?.fullName || 'Candidate'}'s Professional Resume`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Check out my resume for ${resume.targetRole || 'Professional Roles'}: `);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Resume - ${resume.personalInfo?.fullName || 'Candidate'}`);
    const body = encodeURIComponent(`Hello,\n\nPlease find my online resume here: ${shareUrl}\n\nBest regards,\n${resume.personalInfo?.fullName || ''}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Share Live Web Portfolio
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Publish a recruiter-friendly interactive link to your resume.
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

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Public Toggle Switch */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-600" />
                Public Link Access
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isPublic
                  ? 'Anyone with this unique link can view your interactive resume.'
                  : 'Resume is currently private. Only you can view it.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              disabled={toggling}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isPublic ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isPublic ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Share Link Field */}
          {isPublic ? (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Public Portfolio URL:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="shrink-0 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenPortfolio}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Preview Public Web Resume
                </button>
              </div>

              {/* Social Channels */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="block text-[11px] font-semibold text-slate-500 mb-2">
                  Share directly to:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleShareLinkedIn}
                    className="py-1.5 px-2.5 rounded-lg bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    LinkedIn
                  </button>
                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="py-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    Twitter / X
                  </button>
                  <button
                    type="button"
                    onClick={handleShareEmail}
                    className="py-1.5 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-300 text-center space-y-1">
              <Shield className="w-6 h-6 mx-auto text-amber-600 mb-1" />
              <div className="font-bold">Public Sharing is Currently Disabled</div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300/80">
                Toggle the switch above to generate an instant, recruiter-friendly web link that can be placed in email signatures, GitHub, or LinkedIn bios.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-4 py-1.5 rounded-lg font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

