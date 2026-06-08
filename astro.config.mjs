import { defineConfig } from 'astro/config';

// Site statique (sortie HTML) - hébergeable gratuitement sur Netlify.
export default defineConfig({
  site: 'https://isabelle-de-saint-lager.netlify.app',
  output: 'static',
});
