import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig({
  css: { postcss: './postcss.config.cjs' },
  // … resto da config
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
