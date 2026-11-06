import React, { useState } from 'react';
import { Plus, Trash2, Award } from 'lucide-react';

export default function StepCertifications({ certifications = [], onChange }) {
  const addCertification = () => {
    const newCert = {
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      sortOrder: certifications.length,
    };
    onChange([...certifications, newCert]);
  };

  const removeCertification = (index) => {
    onChange(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index, field, value) => {
    const updated = certifications.map((c, i) => {
      if (i === index) {
        return { ...c, [field]: value };
      }
      return c;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Certifications & Licenses
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Validated certifications (AWS, GCP, Oracle, PMP) boost recruiter credibility.
          </p>
        </div>

        <button
          type="button"
          onClick={addCertification}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <Award className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            No certifications added yet.
          </p>
          <button
            type="button"
            onClick={addCertification}
            className="mt-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 transition"
          >
            + Add Certificate
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm relative group"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Certification #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeCertification(idx)}
                  className="p-1 text-slate-400 hover:text-red-500 rounded transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    value={cert.name || ''}
                    onChange={(e) => updateCertification(idx, 'name', e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    value={cert.issuer || ''}
                    onChange={(e) => updateCertification(idx, 'issuer', e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={cert.issueDate || ''}
                    onChange={(e) => updateCertification(idx, 'issueDate', e.target.value)}
                    placeholder="e.g. Nov 2023"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Credential ID / Verification URL
                  </label>
                  <input
                    type="text"
                    value={cert.credentialUrl || ''}
                    onChange={(e) => updateCertification(idx, 'credentialUrl', e.target.value)}
                    placeholder="https://credly.com/..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

