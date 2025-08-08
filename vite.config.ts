import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
  // Carrega as variáveis de ambiente do .env
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // Define aliases e injeta suas ENV no build
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    plugins: [react()],
    css: {
      postcss: './postcss.config.cjs'
    },
    build: {
      outDir: 'dist'
    }
  }
})
