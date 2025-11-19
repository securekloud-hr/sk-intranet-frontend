// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => {
  const API = process.env.VITE_API_URL;
  return {
    server: {
      host: '0.0.0.0',
      allowedHosts: ['roshansivakumar.net'],       // ✅ allow access from LAN / localhost
      port: 8081,             // ✅ same as before
      proxy: {
        // ✅ Proxy all /api requests to Node backend (port 8000)
        '/api': {
          target: API,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }
});