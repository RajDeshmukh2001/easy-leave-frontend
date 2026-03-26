import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/main.tsx'],
      thresholds: {
        branches: 90,
        functions: 100,
        lines: 100,
        statements: 100,
      }
    }
  },
})
