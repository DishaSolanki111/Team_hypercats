import React from 'react';
import { 
  BookOpen, 
  Globe, 
  Moon, 
  Sun, 
  Settings, 
  ShieldCheck, 
  Database, 
  ExternalLink,
  Code
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: 'catalogue' | 'academic' | 'faqs';
  onTabChange: (tab: 'catalogue' | 'academic' | 'faqs') => void;
  onOpenSettings: () => void;
  onOpenKohaGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
  activeTab,
  onTabChange,
  onOpenSettings,
  onOpenKohaGuide,
}) => {
  const t = translations[currentLanguage];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0b1424]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      {/* Top National Announcement Bar */}
      <div className="bg-[#0b1f3a] text-white text-xs px-4 py-1.5 flex flex-wrap justify-between items-center border-b border-amber-500/30">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium tracking-wide">
            {t.heroBadge} • Gandhinagar & Regional Campuses
          </span>
        </div>
        <div className="flex items-center space-x-4 text-slate-300">
          <a 
            href="https://catalog.nfsu.ac.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center space-x-1"
          >
            <span>Official KOHA OPAC</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-slate-600">|</span>
          <a 
            href="https://idp.nfsu.edu.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center space-x-1"
          >
            <span>INFED IDP SSO</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-slate-600">|</span>
          <a 
            href="https://onos.gov.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors flex items-center space-x-1"
          >
            <span>ONOS Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Branding & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & University Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('catalogue')}>
            <div className="w-12 h-12 rounded-xl academic-gradient flex items-center justify-center text-amber-400 shadow-md shadow-navy/20 border border-amber-500/30">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  NFSU Central Library
                </span>
                <span className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded font-mono border border-amber-500/20">
                  AI Assistant
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white leading-tight">
                {t.appName}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Central Tabs Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => onTabChange('catalogue')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'catalogue'
                  ? 'bg-white dark:bg-[#111e38] text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.navCatalog}</span>
            </button>

            <button
              onClick={() => onTabChange('academic')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'academic'
                  ? 'bg-white dark:bg-[#111e38] text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>{t.navResearchTools}</span>
            </button>

            <button
              onClick={() => onTabChange('faqs')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'faqs'
                  ? 'bg-white dark:bg-[#111e38] text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.navFaq}</span>
            </button>
          </nav>

          {/* Right Action Tools: Language, Theme, Settings, Koha Guide */}
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Language selection"
                className="pl-8 pr-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (HI)</option>
                <option value="gu">ગુજરાતી (GU)</option>
              </select>
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={t.themeToggle}
              aria-label={t.themeToggle}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Koha Integration Guide Modal Trigger */}
            <button
              onClick={onOpenKohaGuide}
              title="Koha OPAC Integration Guide for Administrators"
              className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Code className="w-3.5 h-3.5 text-amber-500" />
              <span>KOHA Guide</span>
            </button>

            {/* Settings Modal Trigger */}
            <button
              onClick={onOpenSettings}
              title="Configure Gemini API Key & Providers"
              aria-label="Settings"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => onTabChange('catalogue')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md ${
              activeTab === 'catalogue' ? 'text-amber-600 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.navCatalog}
          </button>
          <button
            onClick={() => onTabChange('academic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md ${
              activeTab === 'academic' ? 'text-amber-600 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.navResearchTools}
          </button>
          <button
            onClick={() => onTabChange('faqs')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md ${
              activeTab === 'faqs' ? 'text-amber-600 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.navFaq}
          </button>
        </div>
      </div>
    </header>
  );
};
