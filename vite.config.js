import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/B2BGateway': {
        target: 'https://apac.universal-api.pp.travelport.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
