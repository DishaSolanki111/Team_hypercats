import React, { useState } from 'react';
import { 
  Book, 
  ExternalLink, 
  Calendar, 
  User, 
  Building, 
  Hash, 
  Copy, 
  Check, 
  HelpCircle,
  Library,
  BookOpen
} from 'lucide-react';
import { BookRecord, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { academicAssistant } from '../../services/academic/researchAssistant';

interface BookCardProps {
  book: BookRecord;
  language?: Language;
  onSelectForChat?: (book: BookRecord) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  language = 'en',
  onSelectForChat
}) => {
  const t = translations[language];
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleCopyCitation = (style: 'IEEE' | 'APA' | 'MLA', e: React.MouseEvent) => {
    e.stopPropagation();
    const result = academicAssistant.generateCitation(
      book.title,
      book.authors,
      book.editionYear || book.firstPublishYear || 2022,
      book.publishers[0] || 'Scholarly Publisher',
      style
    );
    navigator.clipboard.writeText(result.citation);
    setCopiedCitation(style);
    setTimeout(() => setCopiedCitation(null), 2500);
  };

  const kohaSearchQuery = encodeURIComponent(`${book.title} ${book.authors[0] || ''}`.trim());
  const kohaSearchUrl = book.availability.kohaSearchUrl || `https://catalog.nfsu.ac.in/cgi-bin/koha/opac-search.pl?q=${kohaSearchQuery}`;

  return (
    <div className="bg-white dark:bg-[#101b2f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all p-5 flex flex-col justify-between group">
      <div>
        {/* Top Badges: Source & First Publish Note */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <BookOpen className="w-3 h-3 text-amber-500" />
            <span>{book.source}</span>
          </span>

          {book.firstPublishYear && (
            <div className="relative group/tooltip flex items-center">
              <span className="inline-flex items-center space-x-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <Calendar className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>First: {book.firstPublishYear}</span>
                <HelpCircle className="w-3 h-3 text-slate-400" />
              </span>
              <div className="absolute right-0 top-full mt-1 hidden group-hover/tooltip:block z-20 w-64 p-2 text-[10px] leading-tight text-white bg-slate-900 rounded shadow-lg border border-slate-700">
                {t.openLibraryNotice}
              </div>
            </div>
          )}
        </div>

        {/* Content Body: Cover Thumbnail + Info */}
        <div className="flex gap-4">
          {/* Cover image or fallback placeholder */}
          <div className="w-20 sm:w-24 h-28 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
            {book.coverUrl && !imageError ? (
              <img 
                src={book.coverUrl} 
                alt={book.title} 
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
            ) : (
              <div className="text-center p-2 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <Book className="w-8 h-8 mb-1 opacity-60" />
                <span className="text-[9px] font-mono leading-none">NO COVER</span>
              </div>
            )}
          </div>

          {/* Book Metadata */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {book.title}
            </h3>

            {/* Author list */}
            <div className="mt-1 flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-300">
              <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate font-medium">{book.authors.join(', ')}</span>
            </div>

            {/* Publisher */}
            {book.publishers.length > 0 && (
              <div className="mt-1 flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{book.publishers[0]}</span>
              </div>
            )}

            {/* Edition Year vs Work Year */}
            <div className="mt-1 flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              {book.editionYear ? (
                <span className="text-amber-700 dark:text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.2 rounded text-[11px]">
                  Edition Year: {book.editionYear}
                </span>
              ) : null}
              {book.editionCount && book.editionCount > 1 ? (
                <span className="text-[11px] text-slate-400">
                  ({book.editionCount} editions)
                </span>
              ) : null}
            </div>

            {/* ISBN */}
            {book.isbn && book.isbn.length > 0 && (
              <div className="mt-1 flex items-center space-x-1 text-[11px] text-slate-500 font-mono">
                <Hash className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">ISBN: {book.isbn[0]}</span>
              </div>
            )}
          </div>
        </div>

        {/* Subjects tags */}
        {book.subjects && book.subjects.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {book.subjects.slice(0, 3).map((subj, idx) => (
              <span 
                key={idx} 
                className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full"
              >
                {subj}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions: Physical Koha Check + Open Library Link + Citations */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        {/* Prominent Check Physical Availability on NFSU KOHA Button */}
        <a
          href={kohaSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-sm transition-all"
        >
          <Library className="w-3.5 h-3.5" />
          <span>{t.checkKohaAvailability}</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>

        {/* Secondary Links: Open Library + Citations */}
        <div className="flex items-center justify-between text-xs pt-1">
          <a
            href={book.recordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center space-x-1 font-medium transition-colors"
          >
            <span>{t.viewOnOpenLibrary}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Citation Fast-Copy */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-400 mr-1">Cite:</span>
            <button
              onClick={(e) => handleCopyCitation('IEEE', e)}
              className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Copy IEEE Citation"
            >
              {copiedCitation === 'IEEE' ? <Check className="w-3 h-3 text-emerald-500" /> : 'IEEE'}
            </button>
            <button
              onClick={(e) => handleCopyCitation('APA', e)}
              className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Copy APA Citation"
            >
              {copiedCitation === 'APA' ? <Check className="w-3 h-3 text-emerald-500" /> : 'APA'}
            </button>
          </div>
        </div>

        {/* Physical Holdings Note */}
        <p className="text-[10px] text-slate-400 dark:text-slate-500 italic leading-snug">
          {t.kohaDisclaimer}
        </p>
      </div>
    </div>
  );
};
