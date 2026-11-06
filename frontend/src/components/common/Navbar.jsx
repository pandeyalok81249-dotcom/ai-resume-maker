import React from 'react';
import { Sparkles, FileText, Moon, Sun, User, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Resume<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI</span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            </div>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 block -mt-1">
              Intelligent Builder
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onNavigate('landing')}
            className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition ${
              currentPage === 'landing' ? 'text-indigo-600 dark:text-indigo-400' : ''
            }`}
          >
            Home
          </button>
          <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            Features
          </a>
          <a href="#templates" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            Templates
          </a>
          <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            Pricing
          </a>
          {isAuthenticated && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition font-bold flex items-center gap-1 ${
                currentPage === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400' : ''
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
          )}
        </nav>

        {/* Right CTA / Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  {user?.firstName?.[0] || 'U'}
                </div>
                <span>{user?.firstName || 'Dashboard'}</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  onNavigate('landing');
                }}
                className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition"
              >
                <span>Sign Up</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

