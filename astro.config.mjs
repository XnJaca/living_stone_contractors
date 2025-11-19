import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://livingstonecontractors.com', // Update with actual domain
  integrations: [
    tailwind(),
    sitemap()
  ],
  output: 'server',
  adapter: node({
    mode: 'middleware'
  }),
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  // Proxy API calls to backend during development
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    }
  }
});
