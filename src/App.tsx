import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CatalogueExplorer } from './components/catalogue/CatalogueExplorer';
import { AcademicResearchSuite } from './components/academic/AcademicResearchSuite';
import { FAQSection } from './components/faq/FAQSection';
import { FloatingChatbot } from './components/chat/FloatingChatbot';
import { KohaAdminGuideModal } from './components/koha/KohaAdminGuideModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { Language } from './types';
import { geminiService } from './services/ai/geminiService';

export const App: React.FC = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Language State: 'en' | 'hi' | 'gu'
  const [language, setLanguage] = useState<Language>('en');

  // Navigation Tab: 'catalogue' | 'academic' | 'faqs'
  const [activeTab, setActiveTab] = useState<'catalogue' | 'academic' | 'faqs'>('catalogue');

  // Modal States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isKohaGuideOpen, setIsKohaGuideOpen] = useState(false);
  const [chatInitialTopic, setChatInitialTopic] = useState<string | undefined>();

  // Synchronize dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load saved API key on startup if available
  useEffect(() => {
    const savedKey = localStorage.getItem('NFSU_DEMO_GEMINI_KEY');
    const savedModel = localStorage.getItem('NFSU_DEMO_GEMINI_MODEL') || 'gemini-1.5-flash';
    if (savedKey) {
      geminiService.setApiKey(savedKey, savedModel);
    }
  }, []);

  const handleOpenAssistantWithTopic = (topic: string) => {
    setChatInitialTopic(topic);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070d18] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header */}
      <Header
        currentLanguage={language}
        onLanguageChange={setLanguage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenKohaGuide={() => setIsKohaGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'catalogue' && (
          <CatalogueExplorer
            language={language}
            onOpenAssistantWithTopic={handleOpenAssistantWithTopic}
          />
        )}

        {activeTab === 'academic' && (
          <AcademicResearchSuite
            language={language}
            onAskChatbotWithQuery={handleOpenAssistantWithTopic}
          />
        )}

        {activeTab === 'faqs' && (
          <FAQSection
            language={language}
          />
        )}
      </main>

      {/* Floating AI Chatbot */}
      <FloatingChatbot
        language={language}
        onLanguageChange={setLanguage}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        initialTopic={chatInitialTopic}
      />

      {/* Administrator KOHA Integration Guide Modal */}
      <KohaAdminGuideModal
        isOpen={isKohaGuideOpen}
        onClose={() => setIsKohaGuideOpen(false)}
      />

      {/* Demo Configuration & Gemini API Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Footer */}
      <Footer language={language} />
    </div>
  );
};

export default App;
