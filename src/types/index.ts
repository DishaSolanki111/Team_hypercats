export type Language = 'en' | 'hi' | 'gu';

export type AvailabilityStatus = 'available' | 'checked_out' | 'reference_only' | 'unknown';

export interface AvailabilityResult {
  status: AvailabilityStatus;
  statusLabel: string;
  location?: string;
  callNumber?: string;
  notes?: string;
  isPhysicalKohaConnected: boolean;
  kohaSearchUrl?: string;
}

export interface BookRecord {
  id: string; // Open Library key or Koha biblionumber or demo ID
  title: string;
  authors: string[];
  firstPublishYear?: number; // Note: earliest publication of work in Open Library
  editionYear?: number; // Specific edition publication year when known
  publishers: string[];
  isbn?: string[];
  coverUrl?: string;
  subjects?: string[];
  editionCount?: number;
  source: 'Open Library' | 'NFSU Curated Catalogue' | 'NFSU KOHA OPAC (Future)';
  recordUrl: string;
  availability: AvailabilityResult;
}

export interface BookSearchFilters {
  query?: string;
  title?: string;
  author?: string;
  subject?: string;
  isbn?: string;
  year?: number;
  yearFrom?: number;
  yearTo?: number;
  page?: number;
  limit?: number;
}

export interface CatalogueSearchResult {
  books: BookRecord[];
  totalFound: number;
  page: number;
  limit: number;
  provider: 'openlibrary' | 'demo' | 'koha';
  query: string;
  spellingSuggestions?: string[];
  alternativeKeywords?: string[];
  isFallback?: boolean;
}

export type ChatIntent = 
  | 'catalogue_search'
  | 'faq_query'
  | 'academic_guidance'
  | 'koha_status'
  | 'citation_help'
  | 'boolean_builder'
  | 'general_help';

export interface ChatFilterExtraction {
  intent: ChatIntent;
  confidence: number;
  searchFilters?: BookSearchFilters;
  extractedTopic?: string;
  extractedAuthor?: string;
  extractedYear?: number;
  suggestedKeywords?: string[];
  suggestedFollowUps?: string[];
  citationRequest?: {
    topicOrTitle?: string;
    style?: 'APA' | 'MLA' | 'IEEE';
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  language?: Language;
  intent?: ChatIntent;
  extractedFilters?: BookSearchFilters;
  books?: BookRecord[];
  faqReference?: FAQItem;
  citationData?: {
    style: string;
    formattedCitation: string;
    bibtex?: string;
  };
  booleanQuery?: {
    topic: string;
    queryString: string;
    explanation: string;
  };
  suggestedFollowUps?: string[];
  relatedKeywords?: string[];
  kohaCheckUrl?: string;
}

export interface FAQItem {
  id: string;
  category: 'catalogue' | 'onos' | 'idp_access' | 'e_resources' | 'citations' | 'general_rules';
  question: {
    en: string;
    hi: string;
    gu: string;
  };
  answer: {
    en: string;
    hi: string;
    gu: string;
  };
  sourceUrl: string;
  sourceTitle: string;
  verificationStatus: 'verified' | 'verification_required';
  lastCheckedDate: string; // ISO date format YYYY-MM-DD
  keywords: string[];
}

export interface ICatalogueProvider {
  readonly name: string;
  readonly isConnected: boolean;
  searchBooks(filters: BookSearchFilters): Promise<CatalogueSearchResult>;
  getBookDetails(id: string): Promise<BookRecord | null>;
  getAvailability(id: string): Promise<AvailabilityResult>;
  getRecordUrl(id: string): string;
}
