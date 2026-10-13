import { BookRecord, BookSearchFilters, CatalogueSearchResult, ICatalogueProvider, AvailabilityResult } from '../../types';
import { curatedForensicBooks } from '../../data/curatedCatalogue';

export class DemoCatalogueProvider implements ICatalogueProvider {
  readonly name = 'NFSU Curated Forensic Catalogue';
  readonly isConnected = true;

  private books: BookRecord[] = curatedForensicBooks;

  async searchBooks(filters: BookSearchFilters): Promise<CatalogueSearchResult> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 10;

    let filtered = [...this.books];

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(q) ||
        b.authors.some(a => a.toLowerCase().includes(q)) ||
        b.publishers.some(p => p.toLowerCase().includes(q)) ||
        (b.subjects && b.subjects.some(s => s.toLowerCase().includes(q))) ||
        (b.isbn && b.isbn.some(i => i.includes(q)))
      );
    }

    if (filters.title) {
      const t = filters.title.toLowerCase().trim();
      filtered = filtered.filter(b => b.title.toLowerCase().includes(t));
    }

    if (filters.author) {
      const a = filters.author.toLowerCase().trim();
      filtered = filtered.filter(b => b.authors.some(auth => auth.toLowerCase().includes(a)));
    }

    if (filters.subject) {
      const s = filters.subject.toLowerCase().trim();
      filtered = filtered.filter(b => b.subjects && b.subjects.some(sub => sub.toLowerCase().includes(s)));
    }

    if (filters.isbn) {
      const isbnClean = filters.isbn.replace(/[-\s]/g, '');
      filtered = filtered.filter(b => b.isbn && b.isbn.some(i => i.replace(/[-\s]/g, '').includes(isbnClean)));
    }

    if (filters.year) {
      filtered = filtered.filter(b => b.editionYear === filters.year || b.firstPublishYear === filters.year);
    } else if (filters.yearFrom || filters.yearTo) {
      filtered = filtered.filter(b => {
        const y = b.editionYear || b.firstPublishYear;
        if (!y) return true;
        if (filters.yearFrom && y < filters.yearFrom) return false;
        if (filters.yearTo && y > filters.yearTo) return false;
        return true;
      });
    }

    const totalFound = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginatedBooks = filtered.slice(startIndex, startIndex + limit);

    return {
      books: paginatedBooks,
      totalFound,
      page,
      limit,
      provider: 'demo',
      query: filters.query || filters.title || filters.subject || 'All Curated Titles',
      spellingSuggestions: [],
      alternativeKeywords: [
        'Digital Forensics',
        'Forensic Toxicology',
        'Questioned Documents',
        'Forensic Ballistics',
        'DNA Profiling'
      ],
      isFallback: true
    };
  }

  async getBookDetails(id: string): Promise<BookRecord | null> {
    const book = this.books.find(b => b.id === id);
    return book || null;
  }

  async getAvailability(id: string): Promise<AvailabilityResult> {
    const book = this.books.find(b => b.id === id);
    if (!book) {
      return {
        status: 'unknown',
        statusLabel: 'Record Not Found',
        isPhysicalKohaConnected: false
      };
    }
    return book.availability;
  }

  getRecordUrl(id: string): string {
    const book = this.books.find(b => b.id === id);
    return book ? book.recordUrl : 'https://catalog.nfsu.ac.in';
  }
}
