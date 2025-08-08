// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Detecta ambiente de deploy (Vercel, Netlify, etc.)
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],
  
  // Define a base correta para rotas
  base: isProduction ? '/' : '/',

  // Resolve paths absolutos para evitar erros de import no deploy
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Otimizações de build para produção
  build: {
    outDir: 'dist',           // Pasta final do build
    sourcemap: false,         // Desativa mapas para diminuir peso
    chunkSizeWarningLimit: 1000, // Limite antes de dar warning
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },

  // Para evitar problemas no Vercel com server-side rendering
  server: {
    host: true,
    port: 5173,
  },
})
