import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base:'/ckycform/',
  assetsInclude: ['**/*.xlsx'],
  plugins: [react()],
  server: {
    proxy: {
      '/form-api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/form-api/, ''),
      },
    },
  },
})
