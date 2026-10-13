import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Info,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Language, FAQItem } from '../../types';
import { translations } from '../../i18n/translations';
import { verifiedFAQs } from '../../data/faqs';

interface FAQSectionProps {
  language: Language;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ language }) => {
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'verified' | 'verification_required'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('faq-onos-access');

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'onos', label: 'ONOS Portal' },
    { id: 'idp_access', label: 'Off-Campus IDP' },
    { id: 'catalogue', label: 'KOHA Catalogue' },
    { id: 'e_resources', label: 'E-Journals & Databases' },
    { id: 'general_rules', label: 'Library Rules & Access' },
    { id: 'citations', label: 'Citations' }
  ];

  const filteredFaqs = verifiedFAQs.filter(faq => {
    // Category match
    if (selectedCategory !== 'all' && faq.category !== selectedCategory) return false;

    // Status match
    if (selectedStatus !== 'all' && faq.verificationStatus !== selectedStatus) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const question = (faq.question[language] || faq.question.en).toLowerCase();
      const answer = (faq.answer[language] || faq.answer.en).toLowerCase();
      const keywords = faq.keywords.join(' ').toLowerCase();
      return question.includes(q) || answer.includes(q) || keywords.includes(q);
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#101b2f] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase text-amber-600 dark:text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Knowledge Base</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Verified Library & Research FAQs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Curated from verified NFSU sources (<a href="https://catalog.nfsu.ac.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-500">catalog.nfsu.ac.in</a>, <a href="https://idp.nfsu.edu.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-500">idp.nfsu.edu.in</a>, and <a href="https://onos.gov.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-500">onos.gov.in</a>). Policies requiring administrative confirmation are clearly flagged.
          </p>
        </div>

        {/* Verification Status Legend */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs">
          <button
            onClick={() => setSelectedStatus(selectedStatus === 'verified' ? 'all' : 'verified')}
            className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold flex items-center space-x-1.5 transition-all ${
              selectedStatus === 'verified'
                ? 'bg-emerald-500 text-white border-emerald-600'
                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Verified Official Sources</span>
          </button>

          <button
            onClick={() => setSelectedStatus(selectedStatus === 'verification_required' ? 'all' : 'verification_required')}
            className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold flex items-center space-x-1.5 transition-all ${
              selectedStatus === 'verification_required'
                ? 'bg-amber-500 text-slate-950 border-amber-600'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Verification Required (Policies)</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs by question, keyword (e.g. ONOS, IDP, KIBO, Koha)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#101b2f] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-[#101b2f] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-500/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          const isVerified = faq.verificationStatus === 'verified';
          const qText = faq.question[language] || faq.question.en;
          const aText = faq.answer[language] || faq.answer.en;

          return (
            <div
              key={faq.id}
              className={`bg-white dark:bg-[#101b2f] rounded-2xl border transition-all ${
                isExpanded 
                  ? 'border-amber-500/50 shadow-md ring-1 ring-amber-500/20' 
                  : 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Question Header Accordion Trigger */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 focus:outline-none"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Badge */}
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isVerified
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {isVerified ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Verified Official Fact</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          <span>Verification Required</span>
                        </>
                      )}
                    </span>

                    <span className="text-[10px] text-slate-400 font-mono">
                      Last Checked: {faq.lastCheckedDate}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {qText}
                  </h3>
                </div>

                <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Answer Drawer */}
              {isExpanded && (
                <div className="px-4 pb-5 sm:px-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-4 animate-fade-in text-xs">
                  <div className="mt-3 text-slate-700 dark:text-slate-200 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap">
                    {aText}
                  </div>

                  {/* Verification & Source Citation Box */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        Official Authority Reference:
                      </span>
                      <a
                        href={faq.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center space-x-1"
                      >
                        <span>{faq.sourceTitle}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <span className="text-[10px] text-slate-400">
                      Category: {faq.category.toUpperCase()}
                    </span>
                  </div>

                  {!isVerified && (
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 italic">
                      ⚠️ Note: To prevent inaccuracies, specific borrowing numbers, fine rules, and holiday schedules are not invented by the assistant and require direct verification with the NFSU Library Desk.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#101b2f] rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <p className="text-xs text-slate-500">No FAQ entries found matching &ldquo;{searchQuery}&rdquo;.</p>
          </div>
        )}
      </div>
    </div>
  );
};
