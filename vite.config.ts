// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // carrega variáveis do .env.* conforme o mode
  const env = loadEnv(mode, process.cwd(), '');

  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    base: isProduction ? '/' : '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    // se seu código usar process.env.API_KEY em algum lugar,
    // isso garante um fallback seguro para build.
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY ?? ''),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
      target: 'es2020',
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'vendor-react';
              return 'vendor';
            }
          },
        },
      },
    },

    server: {
      host: true,
      port: 5173,
      strictPort: false,
    },
  };
});
