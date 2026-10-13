import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  RefreshCw, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Library,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { BookRecord, BookSearchFilters, CatalogueSearchResult, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { catalogueService } from '../../services/catalogue';
import { BookCard } from './BookCard';

interface CatalogueExplorerProps {
  language: Language;
  onOpenAssistantWithTopic?: (topic: string) => void;
}

export const CatalogueExplorer: React.FC<CatalogueExplorerProps> = ({
  language,
  onOpenAssistantWithTopic
}) => {
  const t = translations[language];

  // Search State
  const [query, setQuery] = useState('');
  const [discipline, setDiscipline] = useState<string>('all');
  const [provider, setProvider] = useState<'openlibrary' | 'demo'>('openlibrary');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced Filters
  const [titleFilter, setTitleFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [yearFromFilter, setYearFromFilter] = useState<number | undefined>();
  const [yearToFilter, setYearToFilter] = useState<number | undefined>();

  // Results State
  const [searchResult, setSearchResult] = useState<CatalogueSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const disciplines = [
    { id: 'all', label: t.filterAll, query: 'forensic science' },
    { id: 'digital-forensics', label: 'Digital Forensics', query: 'digital forensics' },
    { id: 'cyber-security', label: 'Cyber Security', query: 'cyber security' },
    { id: 'toxicology', label: 'Forensic Toxicology', query: 'forensic toxicology' },
    { id: 'dna', label: 'DNA & Genetics', query: 'forensic DNA' },
    { id: 'ballistics', label: 'Forensic Ballistics', query: 'ballistics firearms' },
    { id: 'documents', label: 'Questioned Documents', query: 'questioned documents handwriting' },
    { id: 'law', label: 'Cyber Law & BNSS', query: 'cyber crime law' },
  ];

  const handleSearch = async (page: number = 1) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentPage(page);

    try {
      let finalQuery = query.trim();
      if (!finalQuery && discipline !== 'all') {
        const selected = disciplines.find(d => d.id === discipline);
        if (selected) finalQuery = selected.query;
      }

      const filters: BookSearchFilters = {
        query: finalQuery || undefined,
        title: titleFilter.trim() || undefined,
        author: authorFilter.trim() || undefined,
        subject: subjectFilter.trim() || undefined,
        yearFrom: yearFromFilter,
        yearTo: yearToFilter,
        page,
        limit: 12
      };

      const result = await catalogueService.search(filters, provider);
      setSearchResult(result);
    } catch (err: any) {
      console.error('Search failed:', err);
      setErrorMessage(t.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleSearch(1);
  }, [provider]);

  const handleDisciplineClick = (discId: string, discQuery: string) => {
    setDiscipline(discId);
    if (discId === 'all') {
      setQuery('');
    } else {
      setQuery(discQuery);
    }
    // Trigger immediate search
    setTimeout(() => {
      handleSearch(1);
    }, 50);
  };

  const handleClearFilters = () => {
    setTitleFilter('');
    setAuthorFilter('');
    setSubjectFilter('');
    setYearFromFilter(undefined);
    setYearToFilter(undefined);
    setQuery('');
    setDiscipline('all');
    handleSearch(1);
  };

  const totalPages = searchResult ? Math.ceil(searchResult.totalFound / searchResult.limit) : 0;

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-br from-[#0b1f3a] via-[#112a4f] to-[#071324] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-amber-500/20 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>National Forensic Sciences University • Catalogue Portal</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display mb-3">
            {t.heroTitle} <span className="text-amber-400">{t.heroHighlight}</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            {t.heroDescription}
          </p>

          {/* Unified Search Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(1); }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 dark:bg-black/30 backdrop-blur-md text-white placeholder-slate-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm shadow-inner transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`px-4 py-3.5 rounded-2xl border text-sm font-medium flex items-center space-x-2 transition-all ${
                  showAdvanced 
                    ? 'bg-amber-500 text-slate-950 border-amber-400' 
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
                title="Toggle Advanced Search Filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Provider Selection */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="text-slate-400">Catalogue Source:</span>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="radio"
                name="provider"
                checked={provider === 'openlibrary'}
                onChange={() => setProvider('openlibrary')}
                className="text-amber-500 focus:ring-amber-400"
              />
              <span className="font-medium">Open Library (Global Bibliographic API)</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="radio"
                name="provider"
                checked={provider === 'demo'}
                onChange={() => setProvider('demo')}
                className="text-amber-500 focus:ring-amber-400"
              />
              <span className="font-medium">NFSU Curated Stack (Verified Forensic Holdings)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Advanced Filters Expandable Drawer */}
      {showAdvanced && (
        <div className="bg-white dark:bg-[#101b2f] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Filter className="w-4 h-4 text-amber-500" />
              <span>Advanced Search Filters</span>
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Title Contains</label>
              <input
                type="text"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                placeholder="e.g. Criminalistics"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Author Name</label>
              <input
                type="text"
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                placeholder="e.g. James Spencer"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Subject / Discipline</label>
              <input
                type="text"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                placeholder="e.g. DNA Profiling"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Year Range (From - To)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={yearFromFilter || ''}
                  onChange={(e) => setYearFromFilter(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="2015"
                  className="w-1/2 px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  value={yearToFilter || ''}
                  onChange={(e) => setYearToFilter(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="2026"
                  className="w-1/2 px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discipline Quick Filters Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {disciplines.map((d) => (
          <button
            key={d.id}
            onClick={() => handleDisciplineClick(d.id, d.query)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              discipline === d.id
                ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-500/40'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Fallback Banner if Open Library had an issue or Curated is active */}
      {searchResult?.isFallback && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start space-x-3 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
          <div>
            <span className="font-bold">Offline / Curated Stack Active:</span> Showing high-precision bibliographic records from NFSU's verified forensic and cyber security stack. Physical rack holdings can be searched on the official Koha OPAC.
          </div>
        </div>
      )}

      {/* Results Header: Count & Alternative Keywords */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isLoading ? (
              <span className="flex items-center space-x-2 text-slate-500">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                <span>{t.searchingBooks}</span>
              </span>
            ) : (
              <span>
                {t.foundResults}: <strong className="text-amber-600 dark:text-amber-400">{searchResult?.totalFound || 0}</strong>
              </span>
            )}
          </h3>
          {searchResult && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Query: &ldquo;{searchResult.query}&rdquo; • Provider: {searchResult.provider === 'openlibrary' ? 'Open Library Search API' : 'NFSU Curated Catalogue'}
            </p>
          )}
        </div>

        {/* Alternative Suggestions */}
        {searchResult?.alternativeKeywords && searchResult.alternativeKeywords.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400">Suggested:</span>
            {searchResult.alternativeKeywords.slice(0, 3).map((keyword, i) => (
              <button
                key={i}
                onClick={() => { setQuery(keyword); handleSearch(1); }}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 text-[11px] font-medium"
              >
                + {keyword}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white dark:bg-[#101b2f] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
              <div className="flex gap-4">
                <div className="w-20 h-28 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                </div>
              </div>
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
          ))}
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && searchResult && searchResult.books.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {searchResult.books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              language={language}
              onSelectForChat={onOpenAssistantWithTopic ? () => onOpenAssistantWithTopic(book.title) : undefined}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && searchResult && searchResult.books.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#101b2f] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <BookOpen className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            {t.noResults}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try adjusting your search filters, using broader keywords, or switching to the NFSU Curated Stack.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => { setProvider('demo'); handleSearch(1); }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Browse NFSU Curated Stack
            </button>
            <a
              href="https://catalog.nfsu.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center space-x-1"
            >
              <Library className="w-3.5 h-3.5" />
              <span>Search NFSU KOHA OPAC</span>
            </a>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSearch(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {currentPage}
            </span>
            <button
              onClick={() => handleSearch(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
