import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const devProxyCache = new Map<string, { body: string; contentType: string; expiresAt: number }>();

function toggleWwwDevUrl(urlStr: string): string | null {
  try {
    const parsed = new URL(urlStr);
    parsed.hostname = parsed.hostname.startsWith('www.') ? parsed.hostname.slice(4) : `www.${parsed.hostname}`;
    return parsed.toString();
  } catch {
    return null;
  }
}

function catalogProxyDevPlugin() {
  return {
    name: 'adshield-catalog-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/catalog-proxy', async (req: any, res: any) => {
        try {
          const urlObj = new URL(req.url || '', 'http://localhost');
          const targetUrl = urlObj.searchParams.get('url') || '';
          if (!targetUrl || (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://'))) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid url parameter' }));
            return;
          }

          const cached = devProxyCache.get(targetUrl);
          if (cached && Date.now() < cached.expiresAt) {
            res.statusCode = 200;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Content-Type', cached.contentType);
            res.end(cached.body);
            return;
          }

          const isJsonReq = /\.json(\?|$)/i.test(targetUrl);
          const reqHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'Accept': 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
          };

          let upstream = await fetch(targetUrl, { headers: reqHeaders });
          let body = await upstream.text();
          let contentType = upstream.headers.get('content-type') || 'application/json; charset=utf-8';
          const isInvalidJson = isJsonReq && !body.trim().startsWith('{') && !body.trim().startsWith('[');

          if (!upstream.ok || isInvalidJson) {
            const altUrl = toggleWwwDevUrl(targetUrl);
            if (altUrl) {
              try {
                const altUpstream = await fetch(altUrl, { headers: reqHeaders });
                const altBody = await altUpstream.text();
                if (altUpstream.ok && (!isJsonReq || altBody.trim().startsWith('{') || altBody.trim().startsWith('['))) {
                  upstream = altUpstream;
                  body = altBody;
                  contentType = altUpstream.headers.get('content-type') || contentType;
                }
              } catch {
                // Keep original response
              }
            }
          }

          if (upstream.ok && (!isJsonReq || body.trim().startsWith('{') || body.trim().startsWith('['))) {
            devProxyCache.set(targetUrl, { body, contentType, expiresAt: Date.now() + 10 * 60 * 1000 });
          }

          res.statusCode = upstream.status;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Content-Type', contentType);
          res.end(body);
        } catch (err: any) {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err?.message || 'Proxy error' }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), catalogProxyDevPlugin()],
  // @ts-ignore — Vitest configuration
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.agents/**']
  },
  server: {
    port: 3005,
    strictPort: false,
    watch: {
      ignored: ['**/*.pdf', '**/node_modules/**', '**/.git/**']
    }
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@fortawesome')) {
              return 'vendor-fontawesome';
            }
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            if (id.includes('gsap')) {
              return 'vendor-animation';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('canvas-confetti')) {
              return 'vendor-confetti';
            }
          }
          if (
            id.includes('/src/services/catalog/') ||
            id.includes('/src/services/supplyChain/') ||
            id.includes('/src/services/audits/')
          ) {
            return 'engine-catalog-auditors';
          }
        }
      }
    }
  }
})
