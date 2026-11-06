import React from 'react';
import { FileText, Sparkles, Heart } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Resume<span className="text-indigo-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering students, fresh graduates, job seekers, and executives to build interview-winning, ATS-optimized resumes backed by artificial intelligence.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-4">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for career champions worldwide.</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Features
            </h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition">AI Summary Generator</a></li>
              <li><a href="#features" className="hover:text-white transition">ATS Compatibility Score</a></li>
              <li><a href="#features" className="hover:text-white transition">Job Description Matching</a></li>
              <li><a href="#features" className="hover:text-white transition">AI Bullet Point Polisher</a></li>
              <li><a href="#features" className="hover:text-white transition">PDF Resume Export</a></li>
            </ul>
          </div>

          {/* Templates */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Templates
            </h4>
            <ul className="space-y-2">
              <li><a href="#templates" className="hover:text-white transition">Modern Professional</a></li>
              <li><a href="#templates" className="hover:text-white transition">Software Developer</a></li>
              <li><a href="#templates" className="hover:text-white transition">Executive Leadership</a></li>
              <li><a href="#templates" className="hover:text-white transition">Fresher & Graduate</a></li>
              <li><a href="#templates" className="hover:text-white transition">Classic Corporate</a></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Resources
            </h4>
            <ul className="space-y-2">
              <li><a href="#faq" className="hover:text-white transition">ATS Formatting Guide</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing Plans</a></li>
              <li><a href="#testimonials" className="hover:text-white transition">Success Stories</a></li>
              <li><button onClick={() => onNavigate('login')} className="hover:text-white transition">Account Login</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} ResumeAI Platform. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

