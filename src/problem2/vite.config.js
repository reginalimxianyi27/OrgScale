import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@tanstack/react-query', '@tanstack/react-query-devtools'],
  },
})
