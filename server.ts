import express from 'express';
import { createServer as createViteServer } from 'vite';
import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy Endpoint
  app.get('/api/proxy', async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) return res.status(400).send('URL is required');

    try {
      const response = await axios.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        responseType: 'text'
      });

      const $ = cheerio.load(response.data);
      const baseUrl = new URL(targetUrl).origin;

      // Basic link rewriting to keep traffic through proxy
      $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          $(el).attr('href', `/api/proxy?url=${encodeURIComponent(new URL(href, baseUrl).href)}`);
        } else if (href && href.startsWith('http')) {
           $(el).attr('href', `/api/proxy?url=${encodeURIComponent(href)}`);
        }
      });

      // Inject a small script to handle relative paths for assets
      $('head').prepend(`<base href="${baseUrl}/">`);

      res.send($.html());
    } catch (error) {
      res.status(500).send('Error fetching the page: ' + (error as Error).message);
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
