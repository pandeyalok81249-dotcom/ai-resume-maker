import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import DashboardPage from './components/dashboard/DashboardPage';
import BuilderPage from './components/builder/BuilderPage';
import SettingsModal from './components/common/SettingsModal';
import PublicResumePage from './components/public/PublicResumePage';
import { useAuth } from './context/AuthContext';
import { resumeApi } from './api/resumeApi';

export default function App() {
  const { isAuthenticated, user } = useAuth();
  const [publicShareId, setPublicShareId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('share');
  });
  const [currentPage, setCurrentPage] = useState(() => {
    // If user has token, default to dashboard
    return localStorage.getItem('resumeai_token') ? 'dashboard' : 'landing';
  });
  const [activeResume, setActiveResume] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditResume = (resume) => {
    setActiveResume(resume);
    setCurrentPage('builder');
  };

  const handleSelectTemplateAndCreate = async (templateKey) => {
    try {
      const created = await resumeApi.createResume({
        title: `${templateKey.replace('-', ' ')} Resume`,
        targetRole: user?.targetRole || 'Professional',
        templateKey: templateKey,
      });
      handleEditResume(created);
    } catch (err) {
      console.error("Failed to create resume from template:", err);
      handleNavigate('dashboard');
    }
  };

  if (publicShareId) {
    return (
      <PublicResumePage
        resumeId={publicShareId}
        onGoHome={() => {
          window.history.pushState({}, '', window.location.pathname);
          setPublicShareId(null);
          handleNavigate(isAuthenticated ? 'dashboard' : 'landing');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Show header on all pages except full-screen builder */}
      {currentPage !== 'builder' && (
        <Navbar
          onNavigate={handleNavigate}
          currentPage={currentPage}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {/* Main Pages */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onSelectTemplateAndCreate={handleSelectTemplateAndCreate}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'register' && (
          <RegisterPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            onNavigate={handleNavigate}
            onEditResume={handleEditResume}
          />
        )}

        {currentPage === 'builder' && (
          <BuilderPage
            initialResume={activeResume}
            onBackToDashboard={() => handleNavigate('dashboard')}
          />
        )}
      </main>

      {/* Footer on landing page */}
      {currentPage === 'landing' && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

