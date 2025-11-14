import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv'

// Load environment variables from .env file
config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true
  },
  define: {
    'process.env': process.env
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://dsfeu6p464.execute-api.us-east-2.amazonaws.com/prod',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
