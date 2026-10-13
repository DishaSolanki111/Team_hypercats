import { BookRecord, BookSearchFilters, CatalogueSearchResult, ICatalogueProvider, AvailabilityResult } from '../../types';

export class OpenLibraryProvider implements ICatalogueProvider {
  readonly name = 'Open Library';
  readonly isConnected = true;

  private baseUrl = 'https://openlibrary.org';

  async searchBooks(filters: BookSearchFilters): Promise<CatalogueSearchResult> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? Math.min(filters.limit, 20) : 10;
    const offset = (page - 1) * limit;

    const queryParams = new URLSearchParams();
    queryParams.set('limit', limit.toString());
    queryParams.set('offset', offset.toString());
    // Explicit fields to minimize payload size and improve latency
    queryParams.set('fields', 'key,title,author_name,first_publish_year,publish_year,isbn,publisher,cover_i,subject,edition_count');

    // Build specific search query
    if (filters.title) queryParams.set('title', filters.title);
    if (filters.author) queryParams.set('author', filters.author);
    if (filters.subject) queryParams.set('subject', filters.subject);
    if (filters.isbn) queryParams.set('isbn', filters.isbn);
    
    // Main query or keyword
    if (filters.query) {
      queryParams.set('q', filters.query);
    } else if (!filters.title && !filters.author && !filters.subject && !filters.isbn) {
      queryParams.set('q', 'forensic science');
    }

    const apiUrl = `${this.baseUrl}/search.json?${queryParams.toString()}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'NFSU-Library-Research-Assistant/1.0 (Hackathon Educational Demo)'
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Open Library API responded with status ${response.status}`);
      }

      const data = await response.json();
      const docs: any[] = data.docs || [];
      const totalFound: number = data.numFound || docs.length;

      let books: BookRecord[] = docs.map((doc: any) => this.mapDocToBookRecord(doc));

      // Handle client-side year filtering if specified, since first_publish_year might differ from edition year
      if (filters.year) {
        books = books.filter(b => {
          if (b.editionYear === filters.year) return true;
          if (b.firstPublishYear === filters.year) return true;
          return false;
        });
      } else if (filters.yearFrom || filters.yearTo) {
        books = books.filter(b => {
          const y = b.editionYear || b.firstPublishYear;
          if (!y) return true;
          if (filters.yearFrom && y < filters.yearFrom) return false;
          if (filters.yearTo && y > filters.yearTo) return false;
          return true;
        });
      }

      // Generate helpful related/alternative keywords based on query
      const suggestions = this.generateKeywordSuggestions(filters.query || filters.subject || filters.title || '');

      return {
        books,
        totalFound,
        page,
        limit,
        provider: 'openlibrary',
        query: filters.query || filters.title || filters.subject || 'All Books',
        spellingSuggestions: suggestions.spelling,
        alternativeKeywords: suggestions.alternatives,
        isFallback: false
      };
    } catch (error) {
      console.warn('Open Library search failed, falling back to curated catalogue:', error);
      throw error;
    }
  }

  async getBookDetails(id: string): Promise<BookRecord | null> {
    try {
      // Normalize work key
      const workKey = id.startsWith('/works/') ? id : `/works/${id}`;
      const url = `${this.baseUrl}${workKey}.json`;

      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) return null;

      const data = await response.json();
      return {
        id: data.key,
        title: data.title,
        authors: Array.isArray(data.authors) ? data.authors.map((a: any) => a.author?.key || 'Unknown Author') : [],
        firstPublishYear: undefined,
        publishers: [],
        coverUrl: data.covers?.[0] ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg` : undefined,
        subjects: data.subjects || [],
        source: 'Open Library',
        recordUrl: `https://openlibrary.org${data.key}`,
        availability: await this.getAvailability(data.key)
      };
    } catch {
      return null;
    }
  }

  async getAvailability(id: string): Promise<AvailabilityResult> {
    // For Open Library, physical NFSU availability must always return unknown.
    // Never claim that Open Library books are physically available at NFSU.
    return {
      status: 'unknown',
      statusLabel: 'Physical Holding Unknown (NFSU Koha Not Connected)',
      notes: 'Open Library records provide global bibliographic metadata. To verify physical availability at NFSU Gandhinagar or regional campus libraries, search the official KOHA catalogue.',
      isPhysicalKohaConnected: false,
      kohaSearchUrl: `https://catalog.nfsu.ac.in/cgi-bin/koha/opac-search.pl?q=${encodeURIComponent(id)}`
    };
  }

  getRecordUrl(id: string): string {
    const key = id.startsWith('/works/') ? id : `/works/${id}`;
    return `https://openlibrary.org${key}`;
  }

  private mapDocToBookRecord(doc: any): BookRecord {
    // Extract cover
    let coverUrl: string | undefined = undefined;
    if (doc.cover_i) {
      coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
    } else if (doc.isbn && doc.isbn[0]) {
      coverUrl = `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-M.jpg`;
    }

    // Determine edition year vs first_publish_year
    const firstPublishYear = typeof doc.first_publish_year === 'number' ? doc.first_publish_year : undefined;
    let editionYear: number | undefined = undefined;
    if (Array.isArray(doc.publish_year) && doc.publish_year.length > 0) {
      // Latest or closest edition year
      editionYear = Math.max(...doc.publish_year.filter((y: any) => typeof y === 'number'));
    }

    const cleanTitle = doc.title || 'Untitled Book';
    const authors: string[] = Array.isArray(doc.author_name) ? doc.author_name : ['Unknown Author'];
    const publishers: string[] = Array.isArray(doc.publisher) ? doc.publisher.slice(0, 3) : [];
    const isbns: string[] = Array.isArray(doc.isbn) ? doc.isbn.slice(0, 3) : [];
    const subjects: string[] = Array.isArray(doc.subject) ? doc.subject.slice(0, 5) : [];

    // URL to search on NFSU official Koha OPAC
    const kohaSearchQuery = encodeURIComponent(`${cleanTitle} ${authors[0] || ''}`.trim());
    const kohaSearchUrl = `https://catalog.nfsu.ac.in/cgi-bin/koha/opac-search.pl?q=${kohaSearchQuery}`;

    return {
      id: doc.key || `ol-${Math.random().toString(36).substring(7)}`,
      title: cleanTitle,
      authors,
      firstPublishYear,
      editionYear,
      publishers,
      isbn: isbns,
      coverUrl,
      subjects,
      editionCount: doc.edition_count,
      source: 'Open Library',
      recordUrl: doc.key ? `https://openlibrary.org${doc.key}` : 'https://openlibrary.org',
      availability: {
        status: 'unknown',
        statusLabel: 'Physical Holding Unknown (NFSU Koha Not Connected)',
        notes: 'Open Library bibliographic record. Verify physical shelf availability in NFSU Koha OPAC.',
        isPhysicalKohaConnected: false,
        kohaSearchUrl
      }
    };
  }

  private generateKeywordSuggestions(query: string): { spelling: string[]; alternatives: string[] } {
    const q = query.toLowerCase();
    const alternatives: string[] = [];

    if (q.includes('cyber') || q.includes('digital') || q.includes('computer')) {
      alternatives.push('Digital Forensics', 'Incident Response', 'Network Forensics', 'Malware Reverse Engineering', 'Memory Forensics');
    } else if (q.includes('dna') || q.includes('biology') || q.includes('genetic')) {
      alternatives.push('Forensic DNA Typing', 'STR Analysis', 'Mitochondrial DNA', 'Population Genetics', 'Serology');
    } else if (q.includes('toxic') || q.includes('poison') || q.includes('drug')) {
      alternatives.push('Forensic Toxicology', 'Chromatography MS', 'Pesticide Analysis', 'Postmortem Toxicology');
    } else if (q.includes('ballistic') || q.includes('firearm') || q.includes('weapon')) {
      alternatives.push('Internal Ballistics', 'Gunshot Residue (GSR)', 'Cartridge Case Examination', 'Terminal Ballistics');
    } else if (q.includes('document') || q.includes('handwriting') || q.includes('forgery')) {
      alternatives.push('Questioned Documents', 'Ink Dating', 'Handwriting Identification', 'Indented Writing (ESDA)');
    } else {
      alternatives.push('Criminalistics', 'Crime Scene Investigation', 'Forensic Pathology', 'Chain of Custody');
    }

    return {
      spelling: [],
      alternatives
    };
  }
}
