import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lpr-dataset-hub.vercel.app',
  integrations: [
    react(),
    sitemap(),
  ],
  output: 'static',
});
