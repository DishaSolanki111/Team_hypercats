import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Search, 
  BookOpen, 
  FileText, 
  Database, 
  ExternalLink, 
  Lightbulb,
  CheckCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';
import { academicAssistant } from '../../services/academic/researchAssistant';

interface AcademicResearchSuiteProps {
  language: Language;
  onAskChatbotWithQuery?: (query: string) => void;
}

export const AcademicResearchSuite: React.FC<AcademicResearchSuiteProps> = ({
  language,
  onAskChatbotWithQuery
}) => {
  const t = translations[language];

  const [activeTool, setActiveTool] = useState<'citation' | 'boolean' | 'literature' | 'databases'>('citation');

  // Citation Tool State
  const [citeTitle, setCiteTitle] = useState('Digital Forensics and Cyber Crime Investigation');
  const [citeAuthors, setCiteAuthors] = useState('Thomas J. Holt, Adam M. Bossler');
  const [citeYear, setCiteYear] = useState(2022);
  const [citePublisher, setCitePublisher] = useState('Routledge Taylor & Francis');
  const [citeStyle, setCiteStyle] = useState<'IEEE' | 'APA' | 'MLA'>('IEEE');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [copiedBibtex, setCopiedBibtex] = useState(false);

  // Boolean Builder State
  const [boolTopic, setBoolTopic] = useState('Ransomware attack detection in smart grids');
  const [copiedBool, setCopiedBool] = useState(false);

  // Database Resources
  const databases = [
    {
      name: "ONOS (One Nation One Subscription)",
      category: "National Gateway",
      url: "https://onos.gov.in",
      access: "Campus Static IP or INFED IDP",
      description: "MoE & INFLIBNET initiative providing access to core international peer-reviewed journals for Indian institutions."
    },
    {
      name: "NFSU INFED-IDP SSO",
      category: "Off-Campus Authentication",
      url: "https://idp.nfsu.edu.in",
      access: "Official @nfsu.ac.in credentials",
      description: "Shibboleth-based single sign-on federation setup at INFLIBNET Centre Gandhinagar for remote electronic library access."
    },
    {
      name: "IEEE Xplore Digital Library",
      category: "Engineering & Cyber Forensics",
      url: "https://ieeexplore.ieee.org",
      access: "ONOS / NFSU Subscription",
      description: "Premier database for hardware security, malware reverse engineering, network forensics, and cryptography."
    },
    {
      name: "Elsevier ScienceDirect",
      category: "Forensic Science & Toxicology",
      url: "https://sciencedirect.com",
      access: "ONOS / NFSU Subscription",
      description: "Forensic Science International (FSI) series, Legal Medicine, and Forensic Toxicology journals."
    },
    {
      name: "Manupatra & LiveLaw",
      category: "Cyber Law & Criminal Jurisprudence",
      url: "https://www.manupatrafast.com",
      access: "Law School Library / RefRead",
      description: "Indian Supreme Court and High Court judgments, IT Act 2000 jurisprudence, and evidentiary case laws."
    },
    {
      name: "Turnitin Plagiarism Portal",
      category: "Academic Integrity",
      url: "https://www.turnitin.com",
      access: "Nodal Officer / Faculty Account",
      description: "Official institutional similarity checking system for theses, dissertations, and research papers."
    }
  ];

  const citationResult = academicAssistant.generateCitation(
    citeTitle,
    citeAuthors.split(',').map(a => a.trim()),
    citeYear,
    citePublisher,
    citeStyle
  );

  const booleanResult = academicAssistant.generateBooleanQuery(boolTopic);
  const literatureRoadmap = academicAssistant.getLiteratureReviewRoadmap(boolTopic);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(citationResult.citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(citationResult.bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  const handleCopyBoolean = () => {
    navigator.clipboard.writeText(booleanResult.queryString);
    setCopiedBool(true);
    setTimeout(() => setCopiedBool(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#101b2f] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase text-amber-600 dark:text-amber-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Academic Research Suite</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Research Strategy & Citation Tools
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Formulate high-precision search queries, format peer-reviewed citations, and navigate institutional e-resources.
          </p>
        </div>

        {/* Tool Switcher */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTool('citation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTool === 'citation'
                ? 'bg-white dark:bg-[#0c1527] text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {t.citationGenerator}
          </button>
          <button
            onClick={() => setActiveTool('boolean')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTool === 'boolean'
                ? 'bg-white dark:bg-[#0c1527] text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {t.booleanBuilder}
          </button>
          <button
            onClick={() => setActiveTool('literature')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTool === 'literature'
                ? 'bg-white dark:bg-[#0c1527] text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {t.literatureReview}
          </button>
          <button
            onClick={() => setActiveTool('databases')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTool === 'databases'
                ? 'bg-white dark:bg-[#0c1527] text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            E-Databases
          </button>
        </div>
      </div>

      {/* Tool 1: Interactive Citation Generator */}
      {activeTool === 'citation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#101b2f] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Reference Details</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Work Title</label>
                <input
                  type="text"
                  value={citeTitle}
                  onChange={(e) => setCiteTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Authors (comma-separated)</label>
                <input
                  type="text"
                  value={citeAuthors}
                  onChange={(e) => setCiteAuthors(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Publication Year</label>
                  <input
                    type="number"
                    value={citeYear}
                    onChange={(e) => setCiteYear(parseInt(e.target.value) || 2022)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Citation Style</label>
                  <select
                    value={citeStyle}
                    onChange={(e) => setCiteStyle(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="IEEE">IEEE (Digital Forensics/Cyber)</option>
                    <option value="APA">APA 7th (Forensic Psychology)</option>
                    <option value="MLA">MLA 9th (Law & Humanities)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Publisher / Journal</label>
                <input
                  type="text"
                  value={citePublisher}
                  onChange={(e) => setCitePublisher(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Formatted Output */}
          <div className="lg:col-span-2 bg-white dark:bg-[#101b2f] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Formatted {citeStyle} Citation
                </span>
                <button
                  onClick={handleCopyCitation}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs shadow-sm hover:bg-amber-400 transition-colors"
                >
                  {copiedCitation ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCitation ? t.citationCopied : t.copyCitation}</span>
                </button>
              </div>

              <blockquote className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-l-4 border-amber-500 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-serif leading-relaxed">
                {citationResult.citation}
              </blockquote>

              {/* In-Text Citation */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">In-Text Citation Format: </span>
                <code className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded text-amber-600 dark:text-amber-400">
                  {citationResult.inTextCitation}
                </code>
              </div>

              {/* BibTeX Entry */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>BibTeX (for LaTeX / Overleaf):</span>
                  <button onClick={handleCopyBibtex} className="text-amber-600 dark:text-amber-400 hover:underline">
                    {copiedBibtex ? "Copied!" : "Copy BibTeX"}
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
                  {citationResult.bibtex}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Compliant with IEEE and APA 7th manual rules for thesis submission at NFSU.</span>
            </div>
          </div>
        </div>
      )}

      {/* Tool 2: Boolean Query Builder */}
      {activeTool === 'boolean' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#101b2f] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Search className="w-4 h-4 text-amber-500" />
              <span>Construct Targeted Database Query</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={boolTopic}
                onChange={(e) => setBoolTopic(e.target.value)}
                placeholder="Enter research topic (e.g., Memory forensics volatility analysis)"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleCopyBoolean}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-sm hover:bg-amber-400 transition-colors"
              >
                {copiedBool ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBool ? "Copied Query" : "Copy Boolean String"}</span>
              </button>
            </div>

            {/* Generated Boolean String */}
            <div className="p-4 rounded-xl bg-slate-950 text-amber-400 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
              {booleanResult.queryString}
            </div>

            {/* Facets Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary Concept:</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono">
                  {booleanResult.facets.primaryConcepts.join(', ')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">OR Synonyms:</span>
                <span className="text-slate-600 dark:text-slate-400 font-mono">
                  {booleanResult.facets.synonyms.join(' OR ')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">NOT Exclusions:</span>
                <span className="text-red-500 font-mono">
                  {booleanResult.facets.exclusions.join(' NOT ')}
                </span>
              </div>
            </div>

            {/* Specific Platform Formats */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Database-Specific Syntax:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">IEEE Xplore Command Search:</span>
                  <code className="text-slate-600 dark:text-slate-400 font-mono text-[11px] block break-all">
                    {booleanResult.ieeQuery}
                  </code>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Scopus / ScienceDirect Advanced:</span>
                  <code className="text-slate-600 dark:text-slate-400 font-mono text-[11px] block break-all">
                    {booleanResult.scopusQuery}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tool 3: Literature Review Roadmap */}
      {activeTool === 'literature' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#101b2f] p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>5-Stage Systematic Literature Review Protocol (PRISMA-Aligned)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Tailored for postgraduate dissertations (M.Tech/M.Sc) and Ph.D. proposals across forensic sciences, cyber security, and criminal law at NFSU.
            </p>

            <div className="space-y-4">
              {literatureRoadmap.steps.map((step, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {step.phase}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">Stage {idx + 1}/5</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200">
                    {step.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                    <span className="text-slate-400">Tools:</span>
                    {step.recommendedTools.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500 italic pt-1">
                    💡 Tip: {step.tips[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tool 4: E-Databases Directory */}
      {activeTool === 'databases' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {databases.map((db, idx) => (
            <div key={idx} className="bg-white dark:bg-[#101b2f] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                  {db.category}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {db.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {db.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-[11px] text-slate-500 font-medium">
                  Authentication: <span className="text-slate-800 dark:text-slate-200">{db.access}</span>
                </div>
                <a
                  href={db.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-200 transition-all"
                >
                  <span>Access Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
