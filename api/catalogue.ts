import { z } from 'zod';

const SearchQuerySchema = z.object({
  q: z.string().optional(),
  title: z.string().optional(),
  author: z.string().optional(),
  subject: z.string().optional(),
  isbn: z.string().optional(),
  year: z.coerce.number().optional(),
  yearFrom: z.coerce.number().optional(),
  yearTo: z.coerce.number().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  provider: z.enum(['openlibrary', 'demo', 'koha']).default('openlibrary')
});

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const parseResult = SearchQuerySchema.safeParse(req.query);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid search parameters', details: parseResult.error.errors });
  }

  const { q, title, author, subject, isbn, year, yearFrom, yearTo, page, limit, provider } = parseResult.data;

  // If Open Library requested, query with explicit fields
  if (provider === 'openlibrary') {
    try {
      const offset = (page - 1) * limit;
      const params = new URLSearchParams();
      params.set('limit', limit.toString());
      params.set('offset', offset.toString());
      params.set('fields', 'key,title,author_name,first_publish_year,publish_year,isbn,publisher,cover_i,subject,edition_count');

      if (title) params.set('title', title);
      if (author) params.set('author', author);
      if (subject) params.set('subject', subject);
      if (isbn) params.set('isbn', isbn);
      if (q) params.set('q', q);
      else if (!title && !author && !subject && !isbn) params.set('q', 'forensic science');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const resp = await fetch(`https://openlibrary.org/search.json?${params.toString()}`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'NFSU-Library-Assistant/1.0' }
      });
      clearTimeout(timeoutId);

      if (!resp.ok) {
        throw new Error(`Open Library returned ${resp.status}`);
      }

      const olData = await resp.json();
      const docs = olData.docs || [];

      const books = docs.map((doc: any) => {
        const cleanTitle = doc.title || 'Untitled';
        const authors = Array.isArray(doc.author_name) ? doc.author_name : ['Unknown Author'];
        const kohaSearchQuery = encodeURIComponent(`${cleanTitle} ${authors[0] || ''}`.trim());

        let coverUrl: string | undefined = undefined;
        if (doc.cover_i) {
          coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
        } else if (doc.isbn && doc.isbn[0]) {
          coverUrl = `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-M.jpg`;
        }

        let editionYear: number | undefined = undefined;
        if (Array.isArray(doc.publish_year) && doc.publish_year.length > 0) {
          editionYear = Math.max(...doc.publish_year.filter((y: any) => typeof y === 'number'));
        }

        return {
          id: doc.key || `ol-${Math.random().toString(36).substring(7)}`,
          title: cleanTitle,
          authors,
          firstPublishYear: typeof doc.first_publish_year === 'number' ? doc.first_publish_year : undefined,
          editionYear,
          publishers: Array.isArray(doc.publisher) ? doc.publisher.slice(0, 3) : [],
          isbn: Array.isArray(doc.isbn) ? doc.isbn.slice(0, 3) : [],
          coverUrl,
          subjects: Array.isArray(doc.subject) ? doc.subject.slice(0, 5) : [],
          editionCount: doc.edition_count,
          source: 'Open Library',
          recordUrl: doc.key ? `https://openlibrary.org${doc.key}` : 'https://openlibrary.org',
          availability: {
            status: 'unknown',
            statusLabel: 'Physical Holding Unknown (NFSU Koha Not Connected)',
            notes: 'Open Library bibliographic record. Verify physical shelf availability in NFSU Koha OPAC.',
            isPhysicalKohaConnected: false,
            kohaSearchUrl: `https://catalog.nfsu.ac.in/cgi-bin/koha/opac-search.pl?q=${kohaSearchQuery}`
          }
        };
      });

      return res.status(200).json({
        books,
        totalFound: olData.numFound || books.length,
        page,
        limit,
        provider: 'openlibrary',
        query: q || title || subject || 'All Titles',
        isFallback: false
      });
    } catch (err: any) {
      console.warn('Open Library serverless fetch error:', err);
      // Let client fall back to curated demo dataset
      return res.status(200).json({
        books: [],
        totalFound: 0,
        page: 1,
        limit,
        provider: 'openlibrary',
        error: err.message,
        isFallback: true
      });
    }
  }

  return res.status(200).json({
    books: [],
    totalFound: 0,
    page: 1,
    limit,
    provider,
    isFallback: false
  });
}
