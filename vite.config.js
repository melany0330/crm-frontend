import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://dsfeu6p464.execute-api.us-east-2.amazonaws.com/prod',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 Proxy request:', req.method, req.url, '→', options.target + req.url);
          });
        }
      }
    }
  }
})