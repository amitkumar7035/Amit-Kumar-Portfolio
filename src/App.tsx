import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { EducationSection } from './components/Education';
import { CertificatesSection } from './components/Certificates';
import { ServicesSection } from './components/Services';
import { CodingProfiles } from './components/CodingProfiles';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { GeminiStudioModal } from './components/GeminiStudioModal';

function PortfolioApp() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const [geminiTab, setGeminiTab] = useState<'chat' | 'image' | 'music' | 'video'>('chat');

  const handleOpenGemini = (tab: 'chat' | 'image' | 'music' | 'video' = 'chat') => {
    setGeminiTab(tab);
    setIsGeminiOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#060b13] dark:text-slate-100 selection:bg-cyan-500 selection:text-white transition-colors duration-300 font-sans antialiased overflow-x-hidden relative">
      {/* Primary Sticky Navbar */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenGeminiStudio={handleOpenGemini}
      />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* About Section */}
        <About />

        {/* Skills & Learning Roadmap */}
        <Skills />

        {/* Featured Projects Showcase */}
        <Projects />

        {/* Education Timeline */}
        <EducationSection />

        {/* Certificates & Credentials */}
        <CertificatesSection />

        {/* What I Can Build (Services) */}
        <ServicesSection />

        {/* Coding Profiles & Socials */}
        <CodingProfiles />

        {/* Full-Stack Contact Section */}
        <Contact />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating Gemini AI Quick Access Trigger */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => handleOpenGemini('chat')}
          aria-label="Open Gemini AI Copilot"
          className="group flex items-center gap-2 px-4 py-3 rounded-full bg-slate-900/95 dark:bg-slate-900/95 text-white border-2 border-cyan-400/40 hover:border-cyan-400 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-white bg-clip-text text-transparent">
            Ask Gemini AI
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      </div>

      {/* Admin Dashboard Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Gemini AI Copilot & Creative Studio Modal */}
      <GeminiStudioModal
        isOpen={isGeminiOpen}
        onClose={() => setIsGeminiOpen(false)}
        defaultTab={geminiTab}
      />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
