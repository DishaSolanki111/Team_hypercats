import { BookSearchFilters, CatalogueSearchResult, ICatalogueProvider } from '../../types';
import { OpenLibraryProvider } from './openLibraryProvider';
import { DemoCatalogueProvider } from './demoProvider';
import { KohaProvider } from './kohaProvider';

export class CatalogueService {
  private openLibraryProvider: OpenLibraryProvider;
  private demoProvider: DemoCatalogueProvider;
  private kohaProvider: KohaProvider;

  constructor() {
    this.openLibraryProvider = new OpenLibraryProvider();
    this.demoProvider = new DemoCatalogueProvider();
    this.kohaProvider = new KohaProvider();
  }

  getProvider(providerName: 'openlibrary' | 'demo' | 'koha'): ICatalogueProvider {
    switch (providerName) {
      case 'koha':
        return this.kohaProvider;
      case 'demo':
        return this.demoProvider;
      case 'openlibrary':
      default:
        return this.openLibraryProvider;
    }
  }

  async search(
    filters: BookSearchFilters,
    preferredProvider: 'openlibrary' | 'demo' | 'koha' = 'openlibrary'
  ): Promise<CatalogueSearchResult> {
    // If Koha is requested and not connected, fall back to openlibrary or demo
    if (preferredProvider === 'koha' && !this.kohaProvider.isConnected) {
      const demoResult = await this.demoProvider.searchBooks(filters);
      return {
        ...demoResult,
        alternativeKeywords: [
          'Koha ILS is configured for future connection. Showing verified NFSU forensic holdings.',
          ...(demoResult.alternativeKeywords || [])
        ]
      };
    }

    if (preferredProvider === 'demo') {
      return this.demoProvider.searchBooks(filters);
    }

    // Try Open Library first
    try {
      const result = await this.openLibraryProvider.searchBooks(filters);
      // If zero results were returned from Open Library, check if we have relevant curated records
      if (result.books.length === 0) {
        const demoFallback = await this.demoProvider.searchBooks(filters);
        if (demoFallback.books.length > 0) {
          return {
            ...demoFallback,
            isFallback: true,
            alternativeKeywords: [
              'Showing verified titles from NFSU curated collection for your query.',
              ...(demoFallback.alternativeKeywords || [])
            ]
          };
        }
      }
      return result;
    } catch (error) {
      console.warn('Open Library search encountered an issue. Falling back to Curated Forensic Catalogue.', error);
      const fallbackResult = await this.demoProvider.searchBooks(filters);
      return {
        ...fallbackResult,
        isFallback: true
      };
    }
  }
}

export const catalogueService = new CatalogueService();
