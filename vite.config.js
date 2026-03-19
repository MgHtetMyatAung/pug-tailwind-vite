import { defineConfig } from 'vite';
import pugPlugin from 'vite-plugin-pug-transformer';
import tailwindcss from '@tailwindcss/vite';
import { resolve, basename } from 'path';
import { globSync } from 'glob';

import { siteData } from './src/utils/siteData.js';

import fs from 'fs';
import { navigation } from './src/constants/navigation.js';
import { products } from './src/mock/products.js';


export default defineConfig(({ command }) => {
  const isProd = command === 'build';

  // Helper to map URL to Pug file
  const getPugPath = (url) => {
    const cleanUrl = url.split('?')[0].replace(/\/$/, '') || '/';
    if (cleanUrl === '/') return 'src/pages/index.pug';
    if (cleanUrl === '/library') return 'src/dev/library.pug';
    const pagePath = `src/pages${cleanUrl}.pug`;
    return fs.existsSync(resolve(__dirname, pagePath)) ? pagePath : null;
  };

  const getPages = () => {
    const pages = { main: resolve(__dirname, 'index.html') };
    const pageFiles = globSync('src/pages/**/*.pug', { cwd: __dirname });
    const devFiles = globSync('src/dev/**/*.pug', { cwd: __dirname });

    [...pageFiles, ...devFiles].forEach((file) => {
      const name = basename(file, '.pug');
      pages[name] = resolve(__dirname, 'index.html');
    });
    return pages;
  };

  return {
    plugins: [
      tailwindcss(),
      {
        name: 'pug-dynamic-router',
        transformIndexHtml: {
          order: 'pre',
          handler(html, { originalUrl, path: htmlPath }) {
            // Priority: originalUrl (dev server), then basename of the html file (build)
            const url = originalUrl || `/${basename(htmlPath, '.html')}`;
            const pugPath = getPugPath(url);

            if (pugPath) {
              return html.replace(/data-src="[^"]*"/, `data-src="${pugPath}"`);
            }
            if (originalUrl && originalUrl !== '/' && !originalUrl.includes('.')) {
              return '<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem;"><h1>404 Not Found</h1><p>The requested page does not exist.</p><a href="/">Go Home</a></body></html>';
            }
            return html;
          }
        }
      },
      pugPlugin({
        pugLocals: {
          site: { ...siteData, navigation, products },
          isProd
        }
      })
    ],
    build: {
      rollupOptions: {
        input: globSync('./*.html', { cwd: __dirname }).reduce((acc, file) => {
          const name = basename(file, '.html');
          acc[name] = resolve(__dirname, file);
          return acc;
        }, {}),
        output: {
          entryFileNames: 'js/[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'css/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          }
        }
      }
    },
    server: {
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url.split('?')[0];
          if (!url.includes('.') && url !== '/favicon.ico') {
            if (getPugPath(url)) {
              req.url = '/index.html';
            }
          }
          next();
        });
      },
      port: 8000
    }
  };
});

