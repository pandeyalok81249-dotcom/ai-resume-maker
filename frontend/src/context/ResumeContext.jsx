import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { resumeApi } from '../api/resumeApi';

const ResumeContext = createContext();

export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [sectionVisibility, setSectionVisibility] = useState({
    personal: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    additional: true,
  });

  const saveTimeoutRef = useRef(null);

  const toggleSection = (sectionKey) => {
    setSectionVisibility(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const updateResumeData = useCallback((updater) => {
    setResume(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  }, []);

  const saveResume = async (overrideData) => {
    const dataToSave = overrideData || resume;
    if (!dataToSave || !dataToSave.id) return;

    try {
      setSaving(true);
      const updated = await resumeApi.updateResume(dataToSave.id, dataToSave);
      setResume(updated);
      setLastSaved(new Date());
      return updated;
    } catch (err) {
      console.error("Failed to save resume:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Auto-save debouncer
  const triggerAutoSave = (updatedResume) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveResume(updatedResume);
    }, 1500);
  };

  return (
    <ResumeContext.Provider value={{
      resume,
      setResume,
      loading,
      setLoading,
      saving,
      lastSaved,
      sectionVisibility,
      toggleSection,
      updateResumeData,
      saveResume,
      triggerAutoSave,
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) throw new Error('useResume must be used within ResumeProvider');
  return context;
}

