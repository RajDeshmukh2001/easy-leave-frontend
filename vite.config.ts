import { defineConfig } from 'vite'
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
    setupFiles: './test_src/setupTests.ts',
    coverage: {
      provider: 'v8',           
      reporter: ['text', 'html'], 
      include: ['src/**/*.tsx'], 
      exclude: [                 
        'src/main.tsx',         
        'src/**/*.test.tsx',     
        'src/types/**',          
      ]
    }
  }
})
