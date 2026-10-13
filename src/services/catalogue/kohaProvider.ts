import { BookRecord, BookSearchFilters, CatalogueSearchResult, ICatalogueProvider, AvailabilityResult } from '../../types';

export interface KohaConfig {
  endpoint: string;
  clientId?: string;
  clientSecret?: string;
  bearerToken?: string;
  opacUrl: string;
  enabled: boolean;
}

export class KohaProvider implements ICatalogueProvider {
  readonly name = 'NFSU KOHA Integrated Library System (ILS)';
  readonly isConnected: boolean;

  private config: KohaConfig;

  constructor(config?: Partial<KohaConfig>) {
    const env: any = (typeof process !== 'undefined' && process.env) 
      ? process.env 
      : (typeof import.meta !== 'undefined' && (import.meta as any).env) 
        ? (import.meta as any).env 
        : {};

    this.config = {
      endpoint: config?.endpoint || env.KOHA_API_ENDPOINT || 'https://catalog.nfsu.ac.in/api/v1',
      clientId: config?.clientId || env.KOHA_CLIENT_ID || '',
      clientSecret: config?.clientSecret || env.KOHA_CLIENT_SECRET || '',
      opacUrl: config?.opacUrl || env.KOHA_OPAC_URL || 'https://catalog.nfsu.ac.in',
      enabled: config?.enabled ?? false // Disabled by default until NFSU provides authorized credentials
    };
    this.isConnected = this.config.enabled && !!this.config.clientId;
  }

  async searchBooks(filters: BookSearchFilters): Promise<CatalogueSearchResult> {
    if (!this.isConnected) {
      // Return clear status explaining future connection
      return {
        books: [],
        totalFound: 0,
        page: 1,
        limit: 10,
        provider: 'koha',
        query: filters.query || '',
        isFallback: false,
        alternativeKeywords: [
          'Direct search available on official OPAC: catalog.nfsu.ac.in'
        ]
      };
    }

    try {
      // Future-ready KOHA REST API call (e.g. Koha /api/v1/biblios)
      const queryParams = new URLSearchParams();
      if (filters.query) queryParams.set('q', filters.query);
      if (filters.title) queryParams.set('title', filters.title);
      if (filters.author) queryParams.set('author', filters.author);

      const response = await fetch(`${this.config.endpoint}/biblios?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken || ''}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Koha REST API returned HTTP ${response.status}`);
      }

      const rawBiblios = await response.json();
      const books: BookRecord[] = rawBiblios.map((item: any) => ({
        id: `koha-${item.biblionumber}`,
        title: item.title,
        authors: item.author ? [item.author] : [],
        editionYear: item.copyrightdate || item.publicationyear,
        publishers: item.publishercode ? [item.publishercode] : [],
        isbn: item.isbn ? [item.isbn] : [],
        source: 'NFSU KOHA OPAC (Future)' as const,
        recordUrl: `${this.config.opacUrl}/cgi-bin/koha/opac-detail.pl?biblionumber=${item.biblionumber}`,
        availability: {
          status: item.items_count > 0 ? 'available' : 'checked_out',
          statusLabel: item.items_count > 0 ? 'Available on Shelf' : 'All Copies Checked Out',
          isPhysicalKohaConnected: true
        }
      }));

      return {
        books,
        totalFound: books.length,
        page: filters.page || 1,
        limit: filters.limit || 10,
        provider: 'koha',
        query: filters.query || ''
      };
    } catch (err) {
      console.warn('Live Koha API request failed or not configured:', err);
      throw err;
    }
  }

  async getBookDetails(id: string): Promise<BookRecord | null> {
    if (!this.isConnected) return null;
    return null;
  }

  async getAvailability(id: string): Promise<AvailabilityResult> {
    const biblionumber = id.replace('koha-', '');
    return {
      status: 'unknown',
      statusLabel: 'Koha ILS Integration Ready (Pending NFSU IT API Access)',
      notes: 'Koha REST API endpoint configured. Requires institutional OAuth2 client credentials to query live item shelf status.',
      isPhysicalKohaConnected: false,
      kohaSearchUrl: `${this.config.opacUrl}/cgi-bin/koha/opac-detail.pl?biblionumber=${biblionumber}`
    };
  }

  getRecordUrl(id: string): string {
    const biblionumber = id.replace('koha-', '');
    return `${this.config.opacUrl}/cgi-bin/koha/opac-detail.pl?biblionumber=${biblionumber}`;
  }
}
