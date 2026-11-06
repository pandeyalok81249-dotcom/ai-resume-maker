import React, { useState, useEffect } from 'react';
import {
  X,
  DollarSign,
  TrendingUp,
  Award,
  Compass,
  CheckCircle2,
  Sparkles,
  Loader2,
  Briefcase,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { aiApi } from '../../api/aiApi';

export default function SalaryInsightsModal({ isOpen, onClose, resume }) {
  const [targetRole, setTargetRole] = useState(resume?.targetRole || 'Software Engineer');
  const [years, setYears] = useState(3);
  const [location, setLocation] = useState(resume?.personalInfo?.location || 'United States (Remote / Metro)');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    if (isOpen && !insights) {
      handleFetchInsights();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFetchInsights = async () => {
    try {
      setLoading(true);
      const skills = (resume?.skills || []).map((s) => s.name);
      const res = await aiApi.generateSalaryInsights({
        targetRole,
        yearsOfExperience: parseInt(years, 10),
        location,
        skills,
      });
      setInsights(res);
    } catch (err) {
      alert(err.message || 'Failed to fetch salary insights');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    if (!val) return '$0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-linear-to-r from-amber-50/50 via-yellow-50/30 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                AI Salary & Career Market Insights
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400">
                  Market Benchmarks
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time compensation analytics, high-value skill premiums, and career roadmap.
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Experience
              </label>
              <select
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value={1}>0 - 2 yrs (Junior)</option>
                <option value={4}>3 - 5 yrs (Mid-Level)</option>
                <option value={7}>6 - 8 yrs (Senior)</option>
                <option value={10}>9+ yrs (Lead/Staff)</option>
              </select>
            </div>
            <div className="sm:col-span-4 flex items-end">
              <button
                type="button"
                onClick={handleFetchInsights}
                disabled={loading}
                className="w-full text-xs font-semibold py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-1.5 transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Calculate Benchmarks
              </button>
            </div>
          </div>

          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
              <span>Analyzing market data & compensation bands...</span>
            </div>
          )}

          {insights && !loading && (
            <div className="space-y-6 animate-in fade-in">
              {/* Salary Bracket Overview Card */}
              <div className="p-5 rounded-2xl bg-linear-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      {insights.experienceLevel}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {insights.targetRole}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {insights.marketDemand}
                  </span>
                </div>

                {/* Salary Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">25th Percentile</span>
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {formatCurrency(insights.minSalary)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60 ring-2 ring-amber-500/20">
                    <span className="text-[10px] text-amber-800 dark:text-amber-300 uppercase font-bold">Median / Average</span>
                    <div className="text-base font-extrabold text-amber-700 dark:text-amber-400">
                      {formatCurrency(insights.medianSalary)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">75th Percentile</span>
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {formatCurrency(insights.maxSalary)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Top 10% (Staff/Lead)</span>
                    <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(insights.top10Salary)}
                    </div>
                  </div>
                </div>
              </div>

              {/* High-Impact Skill Multipliers */}
              {insights.skillPremiums && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    High-Value Skill Premiums (What Drives Offers Higher)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.entries(insights.skillPremiums).map(([skill, boost], i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between"
                      >
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {skill}
                        </span>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                          {boost}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Progression Roadmap */}
              {insights.careerMilestones && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    Career Progression Milestones
                  </h4>
                  <div className="space-y-2">
                    {insights.careerMilestones.map((m, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Negotiation Strategy Tips */}
              {insights.negotiationTips && (
                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Salary Negotiation Strategies
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-800 dark:text-emerald-300/80">
                    {insights.negotiationTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <span className="text-[11px] text-slate-500">
            {insights?.sourceTag || 'Market compensation aggregated across tech hubs'}
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

