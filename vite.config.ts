import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite dev server plugin to handle /api/* requests during local development
function apiDevPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        try {
          if (pathname === '/api/health') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              status: 'healthy',
              mode: 'vite-local-dev',
              timestamp: new Date().toISOString()
            }));
            return;
          }

          if (pathname === '/api/faq') {
            const { verifiedFAQs } = await server.ssrLoadModule('/src/data/faqs.ts');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              total: verifiedFAQs.length,
              faqs: verifiedFAQs
            }));
            return;
          }

          if (pathname === '/api/catalogue') {
            const q = url.searchParams.get('q') || '';
            const page = parseInt(url.searchParams.get('page') || '1', 10);
            const limit = parseInt(url.searchParams.get('limit') || '10', 10);
            const provider = (url.searchParams.get('provider') || 'openlibrary') as any;

            const { catalogueService } = await server.ssrLoadModule('/src/services/catalogue/index.ts');
            const result = await catalogueService.search({ query: q, page, limit }, provider);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
            return;
          }

          if (pathname === '/api/chat' && req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body);
                const { geminiService } = await server.ssrLoadModule('/src/services/ai/geminiService.ts');
                if (parsed.clientApiKey) {
                  geminiService.setApiKey(parsed.clientApiKey);
                }
                const result = await geminiService.processMessage(
                  parsed.message,
                  parsed.history || [],
                  parsed.language || 'en'
                );
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  status: 'success',
                  data: result.extraction,
                  assistantResponse: result.assistantResponse,
                  suggestedFollowUps: result.suggestedFollowUps,
                  relatedKeywords: result.relatedKeywords,
                  kohaCheckUrl: result.kohaCheckUrl,
                  isGeminiPowered: result.isGeminiPowered
                }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          next();
        } catch (err: any) {
          console.error('API Dev error:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiDevPlugin()],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true
  }
});
